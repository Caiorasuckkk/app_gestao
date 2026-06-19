import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, FileText, Clock, User } from 'lucide-react';
import { useState } from 'react';

const records = [
  { id: 1, patient: 'Maria Silva', date: '2024-03-15', type: 'Consulta de Rotina', doctor: 'Dr. Carlos Silva' },
  { id: 2, patient: 'João Santos', date: '2024-03-14', type: 'Retorno', doctor: 'Dr. Carlos Silva' },
  { id: 3, patient: 'Ana Costa', date: '2024-03-13', type: 'Primeira Consulta', doctor: 'Dr. Carlos Silva' },
  { id: 4, patient: 'Pedro Oliveira', date: '2024-03-12', type: 'Consulta', doctor: 'Dr. Carlos Silva' },
  { id: 5, patient: 'Carlos Mendes', date: '2024-03-11', type: 'Retorno', doctor: 'Dr. Carlos Silva' },
];

export function Prontuarios() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Prontuários</h1>
          <p className="text-[#6B7280] mt-1">Acesse e gerencie os prontuários eletrônicos</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Total de Prontuários</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Este Mês</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">87</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Hoje</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Pendentes</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">3</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              type="search"
              placeholder="Buscar prontuário por paciente ou data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {records.map((record) => (
              <div key={record.id} className="p-6 hover:bg-[#F6F8FA] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-[#6FB7A7]" />
                      <h3 className="font-semibold text-[#1F4E5F]">{record.patient}</h3>
                    </div>
                    <div className="flex gap-6 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {record.doctor}
                      </div>
                      <div>{record.type}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Abrir Prontuário</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
