import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Users, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const team = [
  { id: 1, name: 'Dr. Carlos Silva', role: 'Médico - CRM 12345', specialty: 'Clínica Geral', patients: 247, email: 'carlos@clinic.com', phone: '(11) 98765-4321' },
  { id: 2, name: 'Dra. Ana Paula', role: 'Psicóloga - CRP 06/12345', specialty: 'Psicologia Clínica', patients: 189, email: 'ana@clinic.com', phone: '(11) 98765-4322' },
  { id: 3, name: 'Nutricionista João', role: 'Nutricionista - CRN 12345', specialty: 'Nutrição Esportiva', patients: 156, email: 'joao@clinic.com', phone: '(11) 98765-4323' },
  { id: 4, name: 'Fisioterapeuta Maria', role: 'Fisioterapeuta - CREFITO 12345', specialty: 'Fisioterapia', patients: 203, email: 'maria@clinic.com', phone: '(11) 98765-4324' },
];

export function Equipes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Equipes</h1>
          <p className="text-[#6B7280] mt-1">Gerencie sua equipe multidisciplinar</p>
        </div>
        <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Profissional
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Total de Profissionais</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Especialidades</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Pacientes Atendidos</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">795</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Média por Profissional</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">199</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {team.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-[#6FB7A7] text-white text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#1F4E5F]">{member.name}</h3>
                  <p className="text-sm text-[#6B7280] mt-1">{member.role}</p>
                  <p className="text-sm text-[#6FB7A7] mt-1">{member.specialty}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Users className="w-4 h-4" />
                      {member.patients} pacientes ativos
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Ver Perfil</Button>
                    <Button variant="outline" size="sm">Agenda</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
