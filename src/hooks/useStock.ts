import { useState, useEffect } from 'react';

export interface StockItem {
  code: string;
  description: string;
  quantity: number;
  address: string;
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

  const addProduct = (code: string, description: string, quantity: number, address: string) => {
    setStock(prev => {
      const existing = prev.find(item => item.code === code && item.address === address);
      
      if (existing) {
        return prev.map(item =>
          item.code === code && item.address === address
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { code, description, quantity, address }];
    });
  };

  const removeProduct = (code: string, address: string, quantity: number) => {
    setStock(prev => {
      const existing = prev.find(item => item.code === code && item.address === address);
      
      if (!existing) {
        throw new Error('Produto não encontrado neste endereço');
      }
      
      if (existing.quantity < quantity) {
        throw new Error('Quantidade insuficiente em estoque');
      }
      
      if (existing.quantity === quantity) {
        return prev.filter(item => !(item.code === code && item.address === address));
      }
      
      return prev.map(item =>
        item.code === code && item.address === address
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
    });
  };

  const transferProduct = (code: string, fromAddress: string, toAddress: string, quantity: number) => {
    setStock(prev => {
      const source = prev.find(item => item.code === code && item.address === fromAddress);
      
      if (!source) {
        throw new Error('Produto não encontrado no endereço de origem');
      }
      
      if (source.quantity < quantity) {
        throw new Error('Quantidade insuficiente no endereço de origem');
      }
      
      let newStock = [...prev];
      
      // Remove from source
      if (source.quantity === quantity) {
        newStock = newStock.filter(item => !(item.code === code && item.address === fromAddress));
      } else {
        newStock = newStock.map(item =>
          item.code === code && item.address === fromAddress
            ? { ...item, quantity: item.quantity - quantity }
            : item
        );
      }
      
      // Add to destination
      const destination = newStock.find(item => item.code === code && item.address === toAddress);
      if (destination) {
        newStock = newStock.map(item =>
          item.code === code && item.address === toAddress
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newStock.push({
          code,
          description: source.description,
          quantity,
          address: toAddress
        });
      }
      
      return newStock;
    });
  };

  const exportToCSV = () => {
    const headers = ['Código', 'Descrição', 'Quantidade', 'Endereço'];
    const rows = stock.map(item => [
      item.code,
      item.description,
      item.quantity.toString(),
      item.address
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
    exportToCSV
  };
};
