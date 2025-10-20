import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PackageMinus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductExitProps {
  onRemove: (code: string, address: string, lote: string, quantity: number) => void;
}

export const ProductExit = ({ onRemove }: ProductExitProps) => {
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [lote, setLote] = useState('');
  const [quantity, setQuantity] = useState('');

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
            <div className="space-y-2">
              <Label htmlFor="exit-code">Código do Produto</Label>
              <Input
                id="exit-code"
                placeholder="Ex: PROD001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exit-address">Endereço</Label>
              <Input
                id="exit-address"
                placeholder="Ex: A01"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exit-lote">Lote</Label>
              <Input
                id="exit-lote"
                placeholder="Ex: L001"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
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
