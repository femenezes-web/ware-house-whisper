import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProductSearchInput } from './ProductSearchInput';
import { ProductDataSelect } from './ProductDataSelect';

interface StockItem {
  code: string;
  description: string;
  quantity: number;
  address: string;
  lote: string;
}

interface ProductEntryProps {
  onAdd: (code: string, description: string, quantity: number, address: string, lote: string) => void;
  stock: StockItem[];
}

export const ProductEntry = ({ onAdd, stock }: ProductEntryProps) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');
  const [lote, setLote] = useState('');

  const handleProductSelect = (selectedCode: string, selectedDescription: string) => {
    setCode(selectedCode);
    setDescription(selectedDescription);
    setProductSearch(`${selectedCode} - ${selectedDescription}`);
    // Reset lote and address when product changes
    setLote('');
    setAddress('');
  };

  // Handle manual input - parse code and description from the search field
  const handleSearchChange = (value: string) => {
    setProductSearch(value);
    
    // Try to parse "CODE - DESCRIPTION" format
    const parts = value.split('-').map(p => p.trim());
    if (parts.length >= 2) {
      setCode(parts[0]);
      setDescription(parts.slice(1).join(' - '));
    } else if (value.trim()) {
      // If no dash, treat entire value as code
      setCode(value.trim());
      setDescription(value.trim());
    }
  };

  // Get available lotes and addresses for selected product
  const availableLotes = code 
    ? Array.from(new Set(stock.filter(item => item.code === code).map(item => item.lote)))
    : [];
  
  const availableAddresses = code
    ? Array.from(new Set(stock.filter(item => item.code === code).map(item => item.address)))
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Specific validation for each field
    if (!code.trim()) {
      toast({
        title: 'Erro',
        description: 'O campo "Produto (Código)" deve estar preenchido',
        variant: 'destructive',
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: 'Erro',
        description: 'O campo "Produto (Descrição)" deve estar preenchido',
        variant: 'destructive',
      });
      return;
    }
    
    if (!quantity.trim()) {
      toast({
        title: 'Erro',
        description: 'O campo "Quantidade" deve estar preenchido',
        variant: 'destructive',
      });
      return;
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: 'Erro',
        description: 'O campo "Quantidade" deve ser maior que zero',
        variant: 'destructive',
      });
      return;
    }
    
    if (!address.trim()) {
      toast({
        title: 'Erro',
        description: 'O campo "Endereço" deve estar preenchido',
        variant: 'destructive',
      });
      return;
    }
    
    // Lote is optional - use "Sem Lote" if not provided
    const finalLote = lote.trim() || 'SEM LOTE';
    
    onAdd(code.trim().toUpperCase(), description.trim(), qty, address.trim().toUpperCase(), finalLote.toUpperCase());
    
    toast({
      title: 'Sucesso!',
      description: `${qty} unidade(s) de ${description} adicionadas ao endereço ${address.toUpperCase()}, lote ${finalLote.toUpperCase()}`,
    });
    
    setCode('');
    setDescription('');
    setProductSearch('');
    setQuantity('');
    setAddress('');
    setLote('');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5 text-primary" />
          <CardTitle>Entrada de Produtos</CardTitle>
        </div>
        <CardDescription>Adicione novos produtos ao estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="entry-product">Produto (Código - Descrição)</Label>
              <Input
                id="entry-product"
                type="text"
                placeholder="Digite o código ou nome do produto..."
                value={productSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                list="products-datalist"
              />
              <datalist id="products-datalist">
                {Array.from(new Map(stock.map(p => [p.code, p])).values()).map((product) => (
                  <option 
                    key={product.code} 
                    value={`${product.code} - ${product.description}`}
                  />
                ))}
              </datalist>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-quantity">Quantidade</Label>
              <Input
                id="entry-quantity"
                type="number"
                min="1"
                placeholder="Ex: 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-address">Endereço</Label>
              <ProductDataSelect
                value={address}
                onSelect={setAddress}
                options={availableAddresses}
                placeholder="Selecione ou digite um endereço"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-lote">Lote</Label>
              <ProductDataSelect
                value={lote}
                onSelect={setLote}
                options={availableLotes}
                placeholder="Selecione ou digite um lote"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <PackagePlus className="mr-2 h-4 w-4" />
            Adicionar ao Estoque
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
