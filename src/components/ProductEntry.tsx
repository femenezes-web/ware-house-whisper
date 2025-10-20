import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PackagePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductEntryProps {
  onAdd: (code: string, description: string, quantity: number, address: string) => void;
}

export const ProductEntry = ({ onAdd }: ProductEntryProps) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !description.trim() || !address.trim()) {
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
    
    onAdd(code.trim().toUpperCase(), description.trim(), qty, address.trim().toUpperCase());
    
    toast({
      title: 'Sucesso!',
      description: `${qty} unidade(s) de ${description} adicionadas ao endereço ${address.toUpperCase()}`,
    });
    
    setCode('');
    setDescription('');
    setQuantity('');
    setAddress('');
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
            <div className="space-y-2">
              <Label htmlFor="entry-code">Código do Produto</Label>
              <Input
                id="entry-code"
                placeholder="Ex: PROD001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entry-description">Descrição</Label>
              <Input
                id="entry-description"
                placeholder="Ex: Notebook Dell"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
