import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PackageMinus } from 'lucide-react';
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

interface ProductExitProps {
  onRemove: (code: string, address: string, lote: string, quantity: number) => void;
  stock: StockItem[];
}

export const ProductExit = ({ onRemove, stock }: ProductExitProps) => {
  const [code, setCode] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [address, setAddress] = useState('');
  const [lote, setLote] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleProductSelect = (selectedCode: string, selectedDescription: string) => {
    setCode(selectedCode);
    setProductSearch(`${selectedCode} - ${selectedDescription}`);
    // Reset lote and address when product changes
    setAddress('');
    setLote('');
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
    
    if (!code.trim() || !address.trim() || !lote.trim()) {
      toast({
        title: 'Erro',
        description: 'Preencha código, endereço e lote',
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
    
    try {
      onRemove(code.trim().toUpperCase(), address.trim().toUpperCase(), lote.trim().toUpperCase(), qty);
      
      toast({
        title: 'Sucesso!',
        description: `${qty} unidade(s) removidas do endereço ${address.toUpperCase()}, lote ${lote.toUpperCase()}`,
      });
      
      setCode('');
      setAddress('');
      setLote('');
      setQuantity('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao remover produto',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PackageMinus className="h-5 w-5 text-destructive" />
          <CardTitle>Saída de Produtos</CardTitle>
        </div>
        <CardDescription>Remova produtos do estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="exit-product">Produto (Código - Descrição)</Label>
              <ProductSearchInput
                value={productSearch}
                onSelect={handleProductSelect}
                products={stock}
                placeholder="Buscar produto..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exit-address">Endereço</Label>
              <ProductDataSelect
                value={address}
                onSelect={setAddress}
                options={availableAddresses}
                placeholder="Selecione ou digite um endereço"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exit-lote">Lote</Label>
              <ProductDataSelect
                value={lote}
                onSelect={setLote}
                options={availableLotes}
                placeholder="Selecione ou digite um lote"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exit-quantity">Quantidade</Label>
              <Input
                id="exit-quantity"
                type="number"
                min="1"
                placeholder="Ex: 5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" variant="destructive" className="w-full">
            <PackageMinus className="mr-2 h-4 w-4" />
            Remover do Estoque
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
