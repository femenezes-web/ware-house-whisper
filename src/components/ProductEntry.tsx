import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProductSearchInput } from './ProductSearchInput';

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !description.trim() || !address.trim() || !lote.trim()) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: 'Erro',
        description: 'Quantidade deve ser maior que zero',
        variant: 'destructive',
      });
      return;
    }
    
    onAdd(code.trim().toUpperCase(), description.trim(), qty, address.trim().toUpperCase(), lote.trim().toUpperCase());
    
    toast({
      title: 'Sucesso!',
      description: `${qty} unidade(s) de ${description} adicionadas ao endereço ${address.toUpperCase()}, lote ${lote.toUpperCase()}`,
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
              <ProductSearchInput
                value={productSearch}
                onSelect={handleProductSelect}
                products={stock}
                placeholder="Buscar ou digitar novo produto..."
              />
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
              <Input
                id="entry-address"
                placeholder="Ex: A01"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-lote">Lote</Label>
              <Input
                id="entry-lote"
                placeholder="Ex: L001"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
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
