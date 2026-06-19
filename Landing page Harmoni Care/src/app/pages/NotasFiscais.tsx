import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileCheck, Download, Plus, Eye } from 'lucide-react';

const invoices = [
  { id: 1, number: 'NF-2024-001', patient: 'Maria Silva', value: 350, date: '2024-03-15', status: 'emitida' },
  { id: 2, number: 'NF-2024-002', patient: 'João Santos', value: 350, date: '2024-03-14', status: 'emitida' },
  { id: 3, number: 'NF-2024-003', patient: 'Ana Costa', value: 350, date: '2024-03-13', status: 'pendente' },
  { id: 4, number: 'NF-2024-004', patient: 'Pedro Oliveira', value: 350, date: '2024-03-12', status: 'emitida' },
];

export function NotasFiscais() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Notas Fiscais</h1>
          <p className="text-[#6B7280] mt-1">Emissão automática de notas fiscais</p>
        </div>
        <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
          <Plus className="w-4 h-4 mr-2" />
          Emitir Nota Fiscal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Emitidas este Mês</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">87</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Valor Total</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">R$ 28.450</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Pendentes</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Taxa de Automação</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">94%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-6 hover:bg-[#F6F8FA] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#6FB7A7]/10 p-3 rounded-lg">
                      <FileCheck className="w-6 h-6 text-[#6FB7A7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1F4E5F]">{invoice.number}</h3>
                      <p className="text-sm text-[#6B7280] mt-1">{invoice.patient}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-[#1F4E5F]">R$ {invoice.value}</p>
                      <p className="text-sm text-[#6B7280]">{new Date(invoice.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      invoice.status === 'emitida'
                        ? 'bg-[#6FB7A7]/10 text-[#6FB7A7]'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invoice.status === 'emitida' ? 'Emitida' : 'Pendente'}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
