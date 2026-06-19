import { Clock, Users, TrendingUp, Shield, Heart, Zap } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Economize até 8h por semana',
    description: 'Automação inteligente de tarefas administrativas e repetitivas',
  },
  {
    icon: Users,
    title: 'Gestão colaborativa',
    description: 'Equipes multidisciplinares trabalhando juntas pelo paciente',
  },
  {
    icon: TrendingUp,
    title: 'Aumente seu faturamento',
    description: 'Reduza faltas com lembretes automáticos e gestão financeira eficiente',
  },
  {
    icon: Shield,
    title: '100% seguro e privado',
    description: 'Conformidade total com LGPD e certificações de segurança',
  },
  {
    icon: Heart,
    title: 'Foco no que importa',
    description: 'Mais tempo para cuidar dos seus pacientes, menos burocracia',
  },
  {
    icon: Zap,
    title: 'Rápido e intuitivo',
    description: 'Interface moderna e fácil de usar, sem curva de aprendizado',
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FB7A7] font-semibold mb-2 block">POR QUE ESCOLHER</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
            Benefícios que transformam sua prática
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Simplifique sua rotina e ofereça uma experiência excepcional aos seus pacientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-[#F6F8FA] p-8 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 border border-transparent hover:border-[#6FB7A7]/30"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#1F4E5F] to-[#6FB7A7] rounded-xl flex items-center justify-center mb-6">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F4E5F] mb-3">
                {benefit.title}
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
