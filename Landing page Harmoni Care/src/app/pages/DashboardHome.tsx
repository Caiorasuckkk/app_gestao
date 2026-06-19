import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';

const stats = [
  {
    title: 'Consultas Hoje',
    value: '8',
    change: '+2 desde ontem',
    icon: Calendar,
    color: 'text-[#6FB7A7]',
    bgColor: 'bg-[#6FB7A7]/10',
  },
  {
    title: 'Total de Pacientes',
    value: '247',
    change: '+12 este mês',
    icon: Users,
    color: 'text-[#1F4E5F]',
    bgColor: 'bg-[#1F4E5F]/10',
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 28.450',
    change: '+18% vs. mês anterior',
    icon: DollarSign,
    color: 'text-[#6FB7A7]',
    bgColor: 'bg-[#6FB7A7]/10',
  },
  {
    title: 'Taxa de Ocupação',
    value: '87%',
    change: 'Acima da média',
    icon: TrendingUp,
    color: 'text-[#1F4E5F]',
    bgColor: 'bg-[#1F4E5F]/10',
  },
];

const upcomingAppointments = [
  { time: '09:00', patient: 'Maria Silva', type: 'Consulta de Rotina', status: 'confirmed' },
  { time: '10:30', patient: 'João Santos', type: 'Retorno', status: 'confirmed' },
  { time: '14:00', patient: 'Ana Costa', type: 'Primeira Consulta', status: 'pending' },
  { time: '15:30', patient: 'Pedro Oliveira', type: 'Teleconsulta', status: 'confirmed' },
];

const recentActivities = [
  { action: 'Prontuário atualizado', patient: 'Maria Silva', time: '10 minutos atrás' },
  { action: 'Nova consulta agendada', patient: 'Carlos Mendes', time: '1 hora atrás' },
  { action: 'Pagamento recebido', patient: 'Ana Costa', time: '2 horas atrás' },
  { action: 'Prontuário criado', patient: 'Pedro Oliveira', time: '3 horas atrás' },
];

export function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F4E5F]">Bem-vindo de volta!</h1>
        <p className="text-[#6B7280] mt-1">
          Aqui está um resumo da sua prática hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#6B7280] font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#1F4E5F] mt-2">{stat.value}</p>
                    <p className="text-xs text-[#6B7280] mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-[#1F4E5F]">
              Próximas Consultas
            </CardTitle>
            <Button variant="outline" size="sm">Ver todas</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-[#F6F8FA] hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 text-[#1F4E5F] font-medium min-w-[60px]">
                    <Clock className="w-4 h-4" />
                    {appointment.time}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1F4E5F]">{appointment.patient}</p>
                    <p className="text-sm text-[#6B7280]">{appointment.type}</p>
                  </div>
                  <div>
                    {appointment.status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#6FB7A7]/10 text-[#6FB7A7] text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmada
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#1F4E5F]">
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#6FB7A7] mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1F4E5F]">{activity.action}</p>
                    <p className="text-sm text-[#6B7280]">{activity.patient}</p>
                    <p className="text-xs text-[#6B7280] mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#1F4E5F]">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="h-auto py-4 flex-col gap-2 bg-[#1F4E5F] hover:bg-[#6FB7A7]">
              <Calendar className="w-6 h-6" />
              <span>Nova Consulta</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2 bg-[#1F4E5F] hover:bg-[#6FB7A7]">
              <Users className="w-6 h-6" />
              <span>Novo Paciente</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2 bg-[#1F4E5F] hover:bg-[#6FB7A7]">
              <DollarSign className="w-6 h-6" />
              <span>Registrar Pagamento</span>
            </Button>
            <Button className="h-auto py-4 flex-col gap-2 bg-[#1F4E5F] hover:bg-[#6FB7A7]">
              <TrendingUp className="w-6 h-6" />
              <span>Ver Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
