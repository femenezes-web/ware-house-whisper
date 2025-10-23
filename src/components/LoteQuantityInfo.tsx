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

  // Group by address
  const addressGroups = productItems.reduce((acc, item) => {
    if (!acc[item.address]) {
      acc[item.address] = 0;
    }
    acc[item.address] += item.quantity;
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lotes Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm font-semibold text-muted-foreground">Por Lote</span>
            <Badge variant="secondary" className="font-semibold">
              {totalQuantity} unidades
            </Badge>
          </div>
          
          {Object.entries(loteGroups).map(([lote, quantity]) => (
            <div key={lote} className="flex items-center justify-between pl-3 border-l-2 border-muted">
              <span className="text-sm text-muted-foreground">Lote {lote}:</span>
              <Badge 
                variant={selectedLote === lote ? "default" : "outline"}
                className="text-xs"
              >
                {quantity} un.
              </Badge>
            </div>
          ))}
        </div>

        {/* Addresses Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm font-semibold text-muted-foreground">Por Endereço</span>
            <Badge variant="secondary" className="font-semibold">
              {totalQuantity} unidades
            </Badge>
          </div>
          
          {Object.entries(addressGroups).map(([address, quantity]) => (
            <div key={address} className="flex items-center justify-between pl-3 border-l-2 border-muted">
              <span className="text-sm text-muted-foreground">{address}:</span>
              <Badge 
                variant={selectedAddress === address ? "default" : "outline"}
                className="text-xs"
              >
                {quantity} un.
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {specificQuantity !== null && (
        <div className="flex items-center justify-between pl-4 border-l-2 border-primary mt-3 pt-3 border-t">
          <span className="text-sm font-medium">Neste endereço e lote:</span>
          <Badge variant="default" className="font-semibold">
            {specificQuantity} unidade(s)
          </Badge>
        </div>
      )}
    </div>
  );
};
