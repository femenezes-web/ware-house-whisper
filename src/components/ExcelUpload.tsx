import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ExcelUploadProps {
  onImport: (data: Array<{ code: string; description: string; quantity: number; address: string; lote: string }>) => void;
}

export const ExcelUpload = ({ onImport }: ExcelUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const template = [
      {
        'Produto': 'INS-37741 - CAJETILLA 25GR ZOMO REP DOMINICANA STRONG MINT',
        'Quantidade': 10,
        'Endereço': 'A1-01-01',
        'Lote': 'LOTE123'
      },
      {
        'Produto': 'INS-12345 - PRODUTO EXEMPLO 2',
        'Quantidade': 5,
        'Endereço': 'B2-02-03',
        'Lote': 'LOTE456'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque');

    XLSX.writeFile(workbook, `template_estoque_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Template baixado com sucesso!');
  };

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

          const products = jsonData.map((row: any, rowIndex: number) => {
            const productField = row['Produto'] || row['produto'] || row['PRODUTO'];
            const quantity = row['Quantidade'] || row['quantidade'] || row['QUANTIDADE'];
            const address = row['Endereço'] || row['Endereco'] || row['endereco'] || row['ENDEREÇO'] || row['ENDERECO'];
            const lote = row['Lote'] || row['lote'] || row['LOTE'];

            if (!productField || !quantity || !address || !lote) {
              throw new Error(`Linha ${rowIndex + 2}: Faltam dados obrigatórios. Certifique-se de que todas as colunas estão preenchidas: Produto, Quantidade, Endereço, Lote`);
            }

            // Separar código e descrição do campo Produto (formato: "CODIGO - DESCRIÇÃO")
            const parts = String(productField).split(' - ');
            const code = parts[0]?.trim() || '';
            const description = parts.slice(1).join(' - ').trim() || parts[0]?.trim() || '';

            if (!code) {
              throw new Error(`Linha ${rowIndex + 2}: Campo Produto está vazio ou inválido`);
            }

            const qty = Number(quantity);
            if (isNaN(qty) || qty <= 0) {
              throw new Error(`Linha ${rowIndex + 2}: Quantidade deve ser um número maior que zero`);
            }

            return {
              code: code.toUpperCase(),
              description,
              quantity: qty,
              address: String(address).toUpperCase(),
              lote: String(lote).toUpperCase()
            };
          });

          onImport(products);
          toast.success(`${products.length} produto(s) importado(s) com sucesso!`);
        
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
          Envie uma planilha .xlsx ou .csv com as colunas: Produto (código - descrição), Quantidade, Endereço, Lote
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Template Excel
          </Button>
          
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
            variant="default"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Selecionar e Importar Arquivo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
