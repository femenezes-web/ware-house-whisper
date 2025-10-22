import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { History, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HistoryEntry } from '@/hooks/useHistory';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface HistoryTableProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
}

export const HistoryTable = ({ history, onClearHistory }: HistoryTableProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ENTRADA':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'SAÍDA':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'TRANSFERÊNCIA':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'EDIÇÃO_LOTE':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle>Histórico de Movimentações</CardTitle>
            </div>
            <CardDescription>Registro de todas as operações realizadas</CardDescription>
          </div>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearHistory}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma movimentação registrada ainda
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(entry.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(entry.type)} variant="secondary">
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.code}</div>
                      <div className="text-sm text-muted-foreground">{entry.description}</div>
                    </TableCell>
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm">{entry.details}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
