import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ExcelUploadProps {
  onImport: (data: Array<{ code: string; description: string; quantity: number; address: string }>) => void;
}

export const ExcelUpload = ({ onImport }: ExcelUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const products = jsonData.map((row: any) => {
          const code = row['Código'] || row['Codigo'] || row['codigo'] || row['CÓDIGO'];
          const description = row['Descrição'] || row['Descricao'] || row['descricao'] || row['DESCRIÇÃO'];
          const quantity = row['Quantidade'] || row['quantidade'] || row['QUANTIDADE'];
          const address = row['Endereço'] || row['Endereco'] || row['endereco'] || row['ENDEREÇO'];

          if (!code || !description || !quantity || !address) {
            throw new Error('Planilha inválida: faltam colunas obrigatórias (Código, Descrição, Quantidade, Endereço)');
          }

          return {
            code: String(code),
            description: String(description),
            quantity: Number(quantity),
            address: String(address)
          };
        });

        onImport(products);
        toast.success(`${products.length} produtos importados com sucesso!`);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao importar planilha');
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importar Planilha Excel
        </CardTitle>
        <CardDescription>
          Envie uma planilha .xlsx ou .csv com as colunas: Código, Descrição, Quantidade, Endereço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-upload"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Selecionar Arquivo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
