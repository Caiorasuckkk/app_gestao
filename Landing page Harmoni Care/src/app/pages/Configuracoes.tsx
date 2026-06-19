import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { User, Building2, Bell, Shield, CreditCard, Calendar, Save } from 'lucide-react';

export function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1F4E5F]">Configurações</h1>
        <p className="text-[#6B7280] mt-1">Gerencie suas preferências e configurações da conta</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clínica</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Agenda</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Cobrança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-[#6FB7A7] text-white text-2xl">DC</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Alterar Foto</Button>
                  <p className="text-sm text-[#6B7280] mt-2">JPG, PNG ou GIF. Máx. 2MB</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="Dr. Carlos Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input id="specialty" defaultValue="Medicina - Clínica Geral" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm">Registro Profissional</Label>
                  <Input id="crm" defaultValue="CRM 12345/SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue="carlos@harmonicare.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Data de Nascimento</Label>
                  <Input id="birthdate" type="date" defaultValue="1985-05-15" />
                </div>
              </div>
              <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Dados da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Nome da Clínica</Label>
                  <Input id="clinicName" defaultValue="Clínica Harmoni Care" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input id="address" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" defaultValue="01310-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicPhone">Telefone da Clínica</Label>
                  <Input id="clinicPhone" defaultValue="(11) 3456-7890" />
                </div>
              </div>
              <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Horários de Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day) => (
                <div key={day} className="flex items-center gap-4 p-4 rounded-lg bg-[#F6F8FA]">
                  <div className="w-24">
                    <p className="font-medium text-[#1F4E5F]">{day}</p>
                  </div>
                  <Switch defaultChecked={day !== 'Sábado'} />
                  <Input type="time" defaultValue="08:00" className="w-32" />
                  <span className="text-[#6B7280]">às</span>
                  <Input type="time" defaultValue="18:00" className="w-32" />
                </div>
              ))}
              <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
                <Save className="w-4 h-4 mr-2" />
                Salvar Horários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Novas consultas agendadas', desc: 'Receba notificação quando um paciente agendar' },
                { title: 'Lembretes de consulta', desc: 'Notificação 1 hora antes de cada consulta' },
                { title: 'Mensagens de pacientes', desc: 'Quando um paciente enviar uma mensagem' },
                { title: 'Pagamentos recebidos', desc: 'Confirmação de pagamentos realizados' },
                { title: 'Atualizações do sistema', desc: 'Novidades e melhorias da plataforma' },
              ].map((item) => (
                <div key={item.title} className="flex items-start justify-between p-4 rounded-lg bg-[#F6F8FA]">
                  <div className="flex-1">
                    <p className="font-medium text-[#1F4E5F]">{item.title}</p>
                    <p className="text-sm text-[#6B7280] mt-1">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Segurança da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input id="currentPassword" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input id="newPassword" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" className="mt-2" />
                </div>
              </div>
              <Button className="bg-[#1F4E5F] hover:bg-[#6FB7A7]">
                Atualizar Senha
              </Button>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-start justify-between p-4 rounded-lg bg-[#F6F8FA]">
                  <div>
                    <p className="font-medium text-[#1F4E5F]">Autenticação em Dois Fatores</p>
                    <p className="text-sm text-[#6B7280] mt-1">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E5F]">Plano e Cobrança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-[#1F4E5F] to-[#6FB7A7] text-white">
                <p className="text-sm opacity-90">Plano Atual</p>
                <p className="text-2xl font-bold mt-1">Profissional</p>
                <p className="text-sm mt-4">R$ 199/mês</p>
                <Button variant="outline" className="mt-4 bg-white text-[#1F4E5F] hover:bg-gray-100">
                  Alterar Plano
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-[#1F4E5F] mb-4">Histórico de Pagamentos</h4>
                <div className="space-y-2">
                  {[
                    { date: '01/03/2024', value: 'R$ 199,00', status: 'Pago' },
                    { date: '01/02/2024', value: 'R$ 199,00', status: 'Pago' },
                    { date: '01/01/2024', value: 'R$ 199,00', status: 'Pago' },
                  ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#F6F8FA]">
                      <div>
                        <p className="font-medium text-[#1F4E5F]">{payment.date}</p>
                        <p className="text-sm text-[#6B7280]">Assinatura Mensal</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1F4E5F]">{payment.value}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
