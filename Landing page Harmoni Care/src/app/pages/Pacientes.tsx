import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Phone, Mail, Calendar, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const patients = [
  { id: 1, name: 'Maria Silva', age: 34, phone: '(11) 98765-4321', email: 'maria@email.com', lastVisit: '2024-03-10', appointments: 8 },
  { id: 2, name: 'João Santos', age: 45, phone: '(11) 98765-4322', email: 'joao@email.com', lastVisit: '2024-03-12', appointments: 5 },
  { id: 3, name: 'Ana Costa', age: 28, phone: '(11) 98765-4323', email: 'ana@email.com', lastVisit: '2024-03-15', appointments: 3 },
  { id: 4, name: 'Pedro Oliveira', age: 52, phone: '(11) 98765-4324', email: 'pedro@email.com', lastVisit: '2024-03-14', appointments: 12 },
  { id: 5, name: 'Carlos Mendes', age: 39, phone: '(11) 98765-4325', email: 'carlos@email.com', lastVisit: '2024-03-11', appointments: 6 },
];

export function Pacientes() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Pacientes</h1>
          <p className="text-[#6B7280] mt-1">Gerencie seu cadastro de pacientes</p>
        </div>
        <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Total de Pacientes</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">247</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Novos este Mês</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Ativos</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">198</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Taxa de Retorno</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">84%</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <Input
                type="search"
                placeholder="Buscar paciente por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-[#F6F8FA] transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#6FB7A7] text-white">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#1F4E5F]">{patient.name}</h3>
                        <p className="text-sm text-[#6B7280] mt-1">{patient.age} anos</p>
                      </div>
                      <Button variant="outline" size="sm">Ver Prontuário</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <Mail className="w-4 h-4" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <Calendar className="w-4 h-4" />
                        Última: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <FileText className="w-4 h-4" />
                        {patient.appointments} consultas
                      </div>
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
