import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Package } from 'lucide-react';
import { StockItem } from '@/hooks/useStock';

interface StockTableProps {
  stock: StockItem[];
  onExport: () => void;
}

export const StockTable = ({ stock, onExport }: StockTableProps) => {
  const [search, setSearch] = useState('');

  const filteredStock = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return stock;
    
    return stock.filter(item =>
      item.code.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.lote.toLowerCase().includes(query)
    );
  }, [stock, search]);

  const totalItems = useMemo(() => {
    return stock.reduce((sum, item) => sum + item.quantity, 0);
  }, [stock]);

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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Código</TableHead>
                <TableHead className="font-semibold">Descrição</TableHead>
                <TableHead className="font-semibold text-right">Quantidade</TableHead>
                <TableHead className="font-semibold">Endereço</TableHead>
                <TableHead className="font-semibold">Lote</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {search ? 'Nenhum produto encontrado' : 'Estoque vazio. Adicione produtos para começar.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStock.map((item, index) => (
                  <TableRow key={`${item.code}-${item.address}-${item.lote}-${index}`}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item.address}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {item.lote}
                      </span>
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
