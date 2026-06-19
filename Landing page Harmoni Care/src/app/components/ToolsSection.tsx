import { Calendar, FileText, DollarSign, FileCheck } from 'lucide-react';

const tools = [
  {
    icon: Calendar,
    title: 'Agenda',
    features: [
      'Visualização por dia, semana e mês',
      'Confirmação automática por WhatsApp',
      'Bloqueio de horários e férias',
      'Sincronização com Google Calendar',
    ],
    gradient: 'from-[#1F4E5F] to-[#6FB7A7]',
  },
  {
    icon: FileText,
    title: 'Prontuário',
    features: [
      'Histórico completo do paciente',
      'Anexos e documentos ilimitados',
      'Compartilhamento com equipe',
      'Assinatura digital certificada',
    ],
    gradient: 'from-[#6FB7A7] to-[#DCEFF3]',
  },
  {
    icon: DollarSign,
    title: 'Financeiro',
    features: [
      'Controle de pagamentos e recebimentos',
      'Gestão de inadimplência',
      'Relatórios de faturamento',
      'Múltiplas formas de pagamento',
    ],
    gradient: 'from-[#1F4E5F] to-[#6FB7A7]',
  },
  {
    icon: FileCheck,
    title: 'Nota Fiscal',
    features: [
      'Emissão automática de NFS-e',
      'Integração com prefeituras',
      'Envio automático por e-mail',
      'Histórico completo de emissões',
    ],
    gradient: 'from-[#6FB7A7] to-[#1F4E5F]',
  },
];

export function ToolsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#F6F8FA] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FB7A7] font-semibold mb-2 block">FERRAMENTAS ESSENCIAIS</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
            Gestão completa da sua clínica
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Desde a agenda até a nota fiscal, tudo integrado e automatizado
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#1F4E5F]/5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-br ${tool.gradient} p-6 text-center`}>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {tool.title}
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#6FB7A7] rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-[#6B7280] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
