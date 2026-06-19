import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router';

const plans = [
  {
    name: 'Individual',
    price: 'R$ 97',
    period: '/mês',
    description: 'Perfeito para profissionais autônomos',
    features: [
      'Até 100 pacientes ativos',
      'Agenda e prontuário ilimitados',
      'Confirmação automática por WhatsApp',
      'Emissão de recibos',
      'Suporte por e-mail',
      '1 usuário',
    ],
    cta: 'Começar teste grátis',
    highlighted: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 197',
    period: '/mês',
    description: 'Ideal para clínicas e consultórios',
    features: [
      'Pacientes ilimitados',
      'Agenda e prontuário ilimitados',
      'Confirmação por WhatsApp, e-mail e SMS',
      'Emissão automática de NFS-e',
      'Equipes multidisciplinares',
      'Até 5 usuários',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
    cta: 'Começar teste grátis',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    description: 'Para grandes clínicas e hospitais',
    features: [
      'Tudo do plano Profissional',
      'Usuários ilimitados',
      'API personalizada',
      'Integração com sistemas próprios',
      'Gerente de conta dedicado',
      'Treinamento personalizado',
      'SLA garantido',
      'Suporte 24/7',
    ],
    cta: 'Falar com especialista',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="planos" className="py-20 px-6 bg-gradient-to-b from-[#F6F8FA] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FB7A7] font-semibold mb-2 block">PLANOS E PREÇOS</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
            Escolha o plano ideal para você
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            14 dias de teste grátis, sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-3xl p-8 border-2 ${
                plan.highlighted 
                  ? 'border-[#6FB7A7] shadow-2xl scale-105 bg-white' 
                  : 'border-[#1F4E5F]/10 bg-white hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#1F4E5F] to-[#6FB7A7] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-semibold">Mais Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#1F4E5F] mb-2">
                  {plan.name}
                </h3>
                <p className="text-[#6B7280] mb-6">
                  {plan.description}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold text-[#1F4E5F]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[#6B7280] mb-2">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#6FB7A7] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                to={plan.cta === 'Falar com especialista' ? '#' : '/register'}
                className={`block w-full py-4 rounded-lg font-semibold transition-all text-center ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-[#1F4E5F] to-[#6FB7A7] text-white hover:shadow-lg hover:scale-105'
                    : 'bg-[#F6F8FA] text-[#1F4E5F] hover:bg-[#DCEFF3] border-2 border-[#1F4E5F]/10'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#6B7280]">
            Todos os planos incluem: suporte técnico, atualizações gratuitas e segurança LGPD
          </p>
        </div>
      </div>
    </section>
  );
}