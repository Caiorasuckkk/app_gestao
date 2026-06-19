import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Plus, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Jan', receita: 24500, despesas: 8200 },
  { month: 'Fev', receita: 26800, despesas: 8900 },
  { month: 'Mar', receita: 28450, despesas: 9100 },
  { month: 'Abr', receita: 30200, despesas: 9500 },
  { month: 'Mai', receita: 29800, despesas: 9200 },
  { month: 'Jun', receita: 31500, despesas: 9800 },
];

const transactions = [
  { id: 1, type: 'receita', description: 'Consulta - Maria Silva', value: 350, date: '2024-03-15', status: 'pago' },
  { id: 2, type: 'receita', description: 'Consulta - João Santos', value: 350, date: '2024-03-14', status: 'pago' },
  { id: 3, type: 'despesa', description: 'Aluguel do consultório', value: 3500, date: '2024-03-10', status: 'pago' },
  { id: 4, type: 'receita', description: 'Consulta - Ana Costa', value: 350, date: '2024-03-13', status: 'pendente' },
  { id: 5, type: 'despesa', description: 'Material de escritório', value: 450, date: '2024-03-12', status: 'pago' },
];

export function Financeiro() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F4E5F]">Financeiro</h1>
          <p className="text-[#6B7280] mt-1">Acompanhe receitas, despesas e fluxo de caixa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Receita Mensal</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-2">R$ 28.450</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+18%</span>
                </div>
              </div>
              <div className="bg-[#6FB7A7]/10 p-3 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#6FB7A7]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280]">Despesas Mensais</p>
                <p className="text-2xl font-bold text-[#1F4E5F] mt-2">R$ 9.100</p>
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm">+5%</span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-[#6B7280]">Lucro Líquido</p>
              <p className="text-2xl font-bold text-[#1F4E5F] mt-2">R$ 19.350</p>
              <p className="text-sm text-[#6B7280] mt-2">Margem de 68%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-[#6B7280]">A Receber</p>
              <p className="text-2xl font-bold text-[#1F4E5F] mt-2">R$ 3.500</p>
              <p className="text-sm text-[#6B7280] mt-2">5 pendências</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1F4E5F]">
              Receitas vs Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="receita" fill="#6FB7A7" radius={[8, 8, 0, 0]} />
                <Bar dataKey="despesas" fill="#1F4E5F" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#1F4E5F]">
              Evolução da Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="receita" stroke="#6FB7A7" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1F4E5F]">
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-[#F6F8FA]">
                <div className="flex-1">
                  <p className="font-medium text-[#1F4E5F]">{transaction.description}</p>
                  <p className="text-sm text-[#6B7280] mt-1">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'receita' ? '+' : '-'} R$ {transaction.value.toLocaleString('pt-BR')}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'pago'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.status === 'pago' ? 'Pago' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
