import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Package, Pencil, Check, X, Trash2, ArrowUpDown } from 'lucide-react';
import { StockItem } from '@/hooks/useStock';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

interface StockTableProps {
  stock: StockItem[];
  onExport: () => void;
  onUpdateLote: (oldItem: StockItem, newLote: string) => void;
  onClearStock: () => void;
}

type SortField = 'quantity' | 'address' | null;
type SortDirection = 'asc' | 'desc';

export const StockTable = ({ stock, onExport, onUpdateLote, onClearStock }: StockTableProps) => {
  const [search, setSearch] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLoteValue, setEditLoteValue] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [passwordInput, setPasswordInput] = useState('');

  const filteredStock = useMemo(() => {
    const query = search.toLowerCase().trim();
    let result = query 
      ? stock.filter(item =>
          item.code.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.lote.toLowerCase().includes(query)
        )
      : [...stock];
    
    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'quantity') {
          comparison = a.quantity - b.quantity;
        } else if (sortField === 'address') {
          comparison = a.address.localeCompare(b.address);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  }, [stock, search, sortField, sortDirection]);

  const totalItems = useMemo(() => {
    return stock.reduce((sum, item) => sum + item.quantity, 0);
  }, [stock]);

  const handleEditLote = (index: number, currentLote: string) => {
    setEditingIndex(index);
    setEditLoteValue(currentLote);
  };

  const handleSaveLote = (item: StockItem, index: number) => {
    if (!editLoteValue.trim()) {
      toast({
        title: 'Erro',
        description: 'Lote não pode estar vazio',
        variant: 'destructive',
      });
      return;
    }

    if (editLoteValue.trim().toUpperCase() !== item.lote) {
      onUpdateLote(item, editLoteValue.trim().toUpperCase());
      toast({
        title: 'Sucesso',
        description: 'Lote atualizado com sucesso',
      });
    }
    
    setEditingIndex(null);
    setEditLoteValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditLoteValue('');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearStockSubmit = () => {
    if (passwordInput === 'elite') {
      onClearStock();
      setPasswordInput('');
      toast({
        title: 'Estoque limpo',
        description: 'Todo o estoque foi removido com sucesso',
      });
    } else {
      toast({
        title: 'Erro',
        description: 'Senha incorreta',
        variant: 'destructive',
      });
      setPasswordInput('');
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Estoque Atual
            </CardTitle>
            <CardDescription>
              {stock.length} produto(s) • {totalItems} unidade(s) no total
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, descrição, endereço ou lote..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Button onClick={onExport} variant="outline" disabled={stock.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={stock.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Estoque
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar Todo o Estoque</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação removerá permanentemente todos os itens do estoque. Digite a senha para confirmar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 py-4">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Usuário: elite | Senha: elite
                  </p>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPasswordInput('')}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearStockSubmit}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Produto (Código - Descrição)</TableHead>
                <TableHead className="font-semibold text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('quantity')}
                    className="h-8 -ml-3"
                  >
                    Quantidade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('address')}
                    className="h-8 -ml-3"
                  >
                    Endereço
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold">Lote</TableHead>
                <TableHead className="font-semibold w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? 'Nenhum produto encontrado' : 'Estoque vazio. Adicione produtos para começar.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStock.map((item, index) => (
                  <TableRow key={`${item.code}-${item.address}-${item.lote}-${index}`}>
                    <TableCell className="font-medium">
                      {item.code} - {item.description}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item.address}
                      </span>
                    </TableCell>
                    <TableCell>
                      {editingIndex === index ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editLoteValue}
                            onChange={(e) => setEditLoteValue(e.target.value)}
                            className="h-8 w-32"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveLote(item, index)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {item.lote}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingIndex !== index && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditLote(index, item.lote)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
