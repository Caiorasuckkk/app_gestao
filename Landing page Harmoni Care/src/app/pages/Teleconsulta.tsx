import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Video, Calendar, Clock, User } from 'lucide-react';

const upcomingSessions = [
  { id: 1, patient: 'Maria Silva', date: '2024-03-17', time: '14:00', duration: 60, status: 'scheduled' },
  { id: 2, patient: 'Pedro Oliveira', date: '2024-03-17', time: '15:30', duration: 60, status: 'scheduled' },
  { id: 3, patient: 'Ana Costa', date: '2024-03-18', time: '10:00', duration: 60, status: 'scheduled' },
];

export function Teleconsulta() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Teleconsulta</h1>
          <p className="text-[#6B7280] mt-1">Atenda seus pacientes remotamente com segurança</p>
        </div>
        <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
          <Video className="w-4 h-4 mr-2" />
          Iniciar Teleconsulta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Teleconsultas este Mês</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">45</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Agendadas Hoje</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Taxa de Conclusão</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">98%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-[#6B7280]">Tempo Médio</p>
            <p className="text-2xl font-bold text-[#1F4E5F] mt-1">52min</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#1F4E5F] mb-6">Próximas Teleconsultas</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-6 rounded-lg bg-[#F6F8FA] border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="bg-[#6FB7A7]/10 p-4 rounded-lg">
                    <Video className="w-6 h-6 text-[#6FB7A7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F4E5F]">{session.patient}</h3>
                    <div className="flex gap-6 mt-2 text-sm text-[#6B7280]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {session.time} ({session.duration}min)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Detalhes</Button>
                  <Button className="bg-[#6FB7A7] hover:bg-[#1F4E5F]">
                    <Video className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#1F4E5F] to-[#6FB7A7] text-white">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">Recursos da Teleconsulta</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Vídeo HD</h4>
              <p className="text-white/90 text-sm">Qualidade de imagem e som profissional</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Gravação</h4>
              <p className="text-white/90 text-sm">Grave consultas com consentimento do paciente</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Segurança</h4>
              <p className="text-white/90 text-sm">Criptografia de ponta a ponta</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
