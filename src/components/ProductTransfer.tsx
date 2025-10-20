import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductTransferProps {
  onTransfer: (code: string, fromAddress: string, toAddress: string, lote: string, quantity: number) => void;
}

export const ProductTransfer = ({ onTransfer }: ProductTransferProps) => {
  const [code, setCode] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [lote, setLote] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim() || !fromAddress.trim() || !toAddress.trim() || !lote.trim()) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos',
        variant: 'destructive',
      });
      return;
    }
    
    if (fromAddress.trim().toUpperCase() === toAddress.trim().toUpperCase()) {
      toast({
        title: 'Erro',
        description: 'Endereços de origem e destino devem ser diferentes',
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
      onTransfer(
        code.trim().toUpperCase(),
        fromAddress.trim().toUpperCase(),
        toAddress.trim().toUpperCase(),
        lote.trim().toUpperCase(),
        qty
      );
      
      toast({
        title: 'Sucesso!',
        description: `${qty} unidade(s) transferidas de ${fromAddress.toUpperCase()} para ${toAddress.toUpperCase()}, lote ${lote.toUpperCase()}`,
      });
      
      setCode('');
      setFromAddress('');
      setToAddress('');
      setLote('');
      setQuantity('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao transferir produto',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-accent" />
          <CardTitle>Remanejamento (De/Para)</CardTitle>
        </div>
        <CardDescription>Movimente produtos entre endereços</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-code">Código do Produto</Label>
              <Input
                id="transfer-code"
                placeholder="Ex: PROD001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transfer-lote">Lote</Label>
              <Input
                id="transfer-lote"
                placeholder="Ex: L001"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transfer-quantity">Quantidade</Label>
              <Input
                id="transfer-quantity"
                type="number"
                min="1"
                placeholder="Ex: 3"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transfer-from">Endereço de Origem</Label>
              <Input
                id="transfer-from"
                placeholder="Ex: A01"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transfer-to">Endereço de Destino</Label>
              <Input
                id="transfer-to"
                placeholder="Ex: B02"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transferir Produto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
