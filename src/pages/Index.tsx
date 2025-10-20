import { Warehouse } from 'lucide-react';
import { ProductEntry } from '@/components/ProductEntry';
import { ProductExit } from '@/components/ProductExit';
import { ProductTransfer } from '@/components/ProductTransfer';
import { StockTable } from '@/components/StockTable';
import { useStock } from '@/hooks/useStock';

const Index = () => {
  const { stock, addProduct, removeProduct, transferProduct, exportToCSV } = useStock();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sistema WMS</h1>
              <p className="text-sm text-muted-foreground">Gestão de Armazém Simplificada</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProductEntry onAdd={addProduct} />
          <ProductExit onRemove={removeProduct} />
        </div>

        <div className="mb-8">
          <ProductTransfer onTransfer={transferProduct} />
        </div>

        <StockTable stock={stock} onExport={exportToCSV} />
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Sistema de Gestão de Armazém © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
