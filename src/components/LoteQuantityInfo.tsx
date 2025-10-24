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
  
  if (productItems.length === 0) return null;
  
  // Calculate total quantity with max 4 decimal places
  const totalQuantity = parseFloat(productItems.reduce((sum, item) => sum + item.quantity, 0).toFixed(4));
  
  // Group by lote and address combination
  const loteAddressGroups = productItems.reduce((acc, item) => {
    const key = `${item.lote}|||${item.address}`;
    if (!acc[key]) {
      acc[key] = {
        lote: item.lote,
        address: item.address,
        quantity: 0
      };
    }
    acc[key].quantity += item.quantity;
    return acc;
  }, {} as Record<string, { lote: string; address: string; quantity: number }>);

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
      
      <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
        <span className="text-sm font-semibold">Quantidade Total:</span>
        <Badge variant="secondary" className="font-semibold">
          {totalQuantity}
        </Badge>
      </div>

      {specificQuantity !== null && (
        <div className="flex items-center justify-between p-2 bg-accent/10 rounded border border-accent/20">
          <span className="text-sm font-medium">Neste endereço e lote:</span>
          <Badge variant="default" className="font-semibold">
            {parseFloat(specificQuantity.toFixed(4))}
          </Badge>
        </div>
      )}
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Por Endereço e Lote:</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {Object.values(loteAddressGroups).map((group, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{group.address}</span>
                <span className="text-xs text-muted-foreground">{group.lote}</span>
              </div>
              <Badge variant="outline">{parseFloat(group.quantity.toFixed(4))}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
