import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface StockItem {
  code: string;
  description: string;
  quantity: number;
  address: string;
  lote: string;
}

interface LoteQuantityInfoProps {
  code: string;
  stock: StockItem[];
  selectedLote?: string;
  selectedAddress?: string;
}

export const LoteQuantityInfo = ({ code, stock, selectedLote, selectedAddress }: LoteQuantityInfoProps) => {
  if (!code) return null;

  // Get all items for this product
  const productItems = stock.filter(item => item.code === code);
  
  // Calculate total quantity
  const totalQuantity = productItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Group by lote
  const loteGroups = productItems.reduce((acc, item) => {
    if (!acc[item.lote]) {
      acc[item.lote] = 0;
    }
    acc[item.lote] += item.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Get specific quantity if lote and address are selected
  const specificQuantity = selectedLote && selectedAddress
    ? stock.find(item => item.code === code && item.lote === selectedLote && item.address === selectedAddress)?.quantity || 0
    : null;

  return (
    <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Quantidades Disponíveis:</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total geral:</span>
          <Badge variant="secondary" className="font-semibold">
            {totalQuantity} unidade(s)
          </Badge>
        </div>
        
        {Object.entries(loteGroups).map(([lote, quantity]) => (
          <div key={lote} className="flex items-center justify-between pl-4 border-l-2 border-muted">
            <span className="text-sm text-muted-foreground">Lote {lote}:</span>
            <Badge 
              variant={selectedLote === lote ? "default" : "outline"}
              className="text-xs"
            >
              {quantity} unidade(s)
            </Badge>
          </div>
        ))}

        {specificQuantity !== null && (
          <div className="flex items-center justify-between pl-4 border-l-2 border-primary mt-3 pt-2">
            <span className="text-sm font-medium">Neste endereço:</span>
            <Badge variant="default" className="font-semibold">
              {specificQuantity} unidade(s)
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
