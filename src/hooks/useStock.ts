import { useState, useEffect } from 'react';

export interface StockItem {
  code: string;
  description: string;
  quantity: number;
  address: string;
  lote: string;
}

const STORAGE_KEY = 'wms_stock_data';

export const useStock = () => {
  const [stock, setStock] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stock));
  }, [stock]);

  const addProduct = (code: string, description: string, quantity: number, address: string, lote: string) => {
    setStock(prev => {
      const existing = prev.find(item => item.code === code && item.address === address && item.lote === lote);
      
      if (existing) {
        return prev.map(item =>
          item.code === code && item.address === address && item.lote === lote
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { code, description, quantity, address, lote }];
    });
  };

  const removeProduct = (code: string, address: string, lote: string, quantity: number) => {
    setStock(prev => {
      const existing = prev.find(item => item.code === code && item.address === address && item.lote === lote);
      
      if (!existing) {
        throw new Error('Produto não encontrado neste endereço e lote');
      }
      
      if (existing.quantity < quantity) {
        throw new Error('Quantidade insuficiente em estoque');
      }
      
      if (existing.quantity === quantity) {
        return prev.filter(item => !(item.code === code && item.address === address && item.lote === lote));
      }
      
      return prev.map(item =>
        item.code === code && item.address === address && item.lote === lote
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
    });
  };

  const transferProduct = (code: string, fromAddress: string, toAddress: string, lote: string, quantity: number) => {
    setStock(prev => {
      const source = prev.find(item => item.code === code && item.address === fromAddress && item.lote === lote);
      
      if (!source) {
        throw new Error('Produto não encontrado no endereço de origem e lote');
      }
      
      if (source.quantity < quantity) {
        throw new Error('Quantidade insuficiente no endereço de origem');
      }
      
      let newStock = [...prev];
      
      // Remove from source
      if (source.quantity === quantity) {
        newStock = newStock.filter(item => !(item.code === code && item.address === fromAddress && item.lote === lote));
      } else {
        newStock = newStock.map(item =>
          item.code === code && item.address === fromAddress && item.lote === lote
            ? { ...item, quantity: item.quantity - quantity }
            : item
        );
      }
      
      // Add to destination
      const destination = newStock.find(item => item.code === code && item.address === toAddress && item.lote === lote);
      if (destination) {
        newStock = newStock.map(item =>
          item.code === code && item.address === toAddress && item.lote === lote
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newStock.push({
          code,
          description: source.description,
          quantity,
          address: toAddress,
          lote
        });
      }
      
      return newStock;
    });
  };

  const importFromExcel = (products: Array<{ code: string; description: string; quantity: number; address: string; lote: string }>) => {
    products.forEach(product => {
      addProduct(product.code, product.description, product.quantity, product.address, product.lote);
    });
  };

  const exportToCSV = () => {
    const headers = ['Código', 'Descrição', 'Quantidade', 'Endereço', 'Lote'];
    const rows = stock.map(item => [
      item.code,
      item.description,
      item.quantity.toString(),
      item.address,
      item.lote
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `estoque_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    stock,
    addProduct,
    removeProduct,
    transferProduct,
    importFromExcel,
    exportToCSV
  };
};
