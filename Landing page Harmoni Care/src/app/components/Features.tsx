import { Calendar, FileText, DollarSign, Users, Bell, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Gestão completa de horários com lembretes automáticos por WhatsApp, e-mail e SMS. Reduza faltas e otimize sua agenda.',
    color: 'from-[#1F4E5F] to-[#6FB7A7]',
  },
  {
    icon: FileText,
    title: 'Prontuário Eletrônico',
    description: 'Registros médicos completos, seguros e acessíveis de qualquer lugar. Compartilhe com sua equipe de forma controlada.',
    color: 'from-[#6FB7A7] to-[#DCEFF3]',
  },
  {
    icon: DollarSign,
    title: 'Gestão Financeira',
    description: 'Controle de pagamentos, inadimplência e fluxo de caixa. Emita recibos e notas fiscais automaticamente.',
    color: 'from-[#1F4E5F] to-[#6FB7A7]',
  },
  {
    icon: Users,
    title: 'Equipes Multidisciplinares',
    description: 'Conecte médicos, psicólogos, nutricionistas e fisioterapeutas em torno do mesmo paciente com segurança total.',
    color: 'from-[#6FB7A7] to-[#1F4E5F]',
  },
  {
    icon: Bell,
    title: 'Lembretes Automáticos',
    description: 'Confirme consultas automaticamente e reduza o no-show. Envie lembretes de retorno e acompanhamento.',
    color: 'from-[#DCEFF3] to-[#6FB7A7]',
  },
  {
    icon: BarChart3,
    title: 'Relatórios e Análises',
    description: 'Dashboards completos sobre faturamento, atendimentos, pacientes ativos e muito mais. Tome decisões baseadas em dados.',
    color: 'from-[#1F4E5F] to-[#6FB7A7]',
  },
];

export function Features() {
  return (
    <section id="funcionalidades" className="py-20 px-6 bg-gradient-to-b from-[#F6F8FA] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FB7A7] font-semibold mb-2 block">FUNCIONALIDADES</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Ferramentas poderosas e integradas para transformar sua gestão
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#1F4E5F]/5 hover:border-[#6FB7A7]/30"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F4E5F] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
