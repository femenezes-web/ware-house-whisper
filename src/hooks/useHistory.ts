import { useState, useEffect } from 'react';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  type: 'ENTRADA' | 'SAÍDA' | 'TRANSFERÊNCIA' | 'EDIÇÃO_LOTE';
  code: string;
  description: string;
  quantity: number;
  fromAddress?: string;
  toAddress?: string;
  lote: string;
  oldLote?: string;
  details: string;
}

const HISTORY_KEY = 'wms_history_data';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addEntry,
    clearHistory,
  };
};
