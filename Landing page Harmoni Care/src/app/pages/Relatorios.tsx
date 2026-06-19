import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart3, Download, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const monthlyPatients = [
  { month: 'Jan', novos: 12, retornos: 45 },
  { month: 'Fev', novos: 15, retornos: 52 },
  { month: 'Mar', novos: 18, retornos: 58 },
  { month: 'Abr', novos: 14, retornos: 61 },
  { month: 'Mai', novos: 16, retornos: 55 },
  { month: 'Jun', novos: 19, retornos: 64 },
];

const specialtyData = [
  { name: 'Consultas de Rotina', value: 45, color: '#6FB7A7' },
  { name: 'Retornos', value: 30, color: '#1F4E5F' },
  { name: 'Primeira Consulta', value: 15, color: '#DCEFF3' },
  { name: 'Teleconsulta', value: 10, color: '#6B7280' },
];

export function Relatorios() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Relatórios</h1>
          <p className="text-[#6B7280] mt-1">Análises e insights da sua prática</p>
        </div>
        <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatórios
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Total de Consultas</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-2">1,234</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+23%</span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-[#6FB7A7]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Novos Pacientes</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-2">94</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+15%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-[#6FB7A7]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Receita Total</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-2">R$ 180K</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+18%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-[#6FB7A7]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Ticket Médio</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-2">R$ 350</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+8%</span>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-[#6FB7A7]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1F4E5F]">
              Crescimento de Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPatients}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="novos" fill="#6FB7A7" name="Novos Pacientes" radius={[8, 8, 0, 0]} />
                <Bar dataKey="retornos" fill="#1F4E5F" name="Retornos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1F4E5F]">
              Distribuição por Tipo de Consulta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1F4E5F]">
            Métricas Principais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-[#F6F8FA]">
              <p className="text-sm text-[#6B7280] mb-2">Taxa de Comparecimento</p>
              <p className="text-3xl font-bold text-[#1F4E5F]">92%</p>
              <p className="text-sm text-green-600 mt-2">+3% vs. mês anterior</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F6F8FA]">
              <p className="text-sm text-[#6B7280] mb-2">Taxa de Retorno</p>
              <p className="text-3xl font-bold text-[#1F4E5F]">84%</p>
              <p className="text-sm text-green-600 mt-2">+5% vs. mês anterior</p>
            </div>
            <div className="p-4 rounded-lg bg-[#F6F8FA]">
              <p className="text-sm text-[#6B7280] mb-2">Satisfação do Paciente</p>
              <p className="text-3xl font-bold text-[#1F4E5F]">4.8/5</p>
              <p className="text-sm text-green-600 mt-2">Acima da média</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
