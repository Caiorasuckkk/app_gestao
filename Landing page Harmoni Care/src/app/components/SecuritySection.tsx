import { Shield, Lock, Server, FileCheck, Eye, AlertCircle } from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Conformidade LGPD',
    description: 'Total adequação às leis de proteção de dados brasileiras',
  },
  {
    icon: Lock,
    title: 'Criptografia de ponta a ponta',
    description: 'Seus dados protegidos com tecnologia de criptografia AES-256',
  },
  {
    icon: Server,
    title: 'Servidores no Brasil',
    description: 'Dados armazenados em servidores certificados em território nacional',
  },
  {
    icon: FileCheck,
    title: 'Logs de auditoria',
    description: 'Rastreamento completo de todos os acessos e modificações',
  },
  {
    icon: Eye,
    title: 'Controle de acesso',
    description: 'Permissões granulares para cada membro da equipe',
  },
  {
    icon: AlertCircle,
    title: 'Backup automático',
    description: 'Backups diários automáticos com redundância geográfica',
  },
];

export function SecuritySection() {
  return (
    <section id="seguranca" className="py-20 px-6 bg-gradient-to-b from-white to-[#DCEFF3]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#6FB7A7] font-semibold mb-2 block">SEGURANÇA E PRIVACIDADE</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
            Seus dados e de seus pacientes 100% protegidos
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Cumprimos rigorosamente todas as normas de segurança e privacidade da área da saúde
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#1F4E5F]/10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#1F4E5F] to-[#6FB7A7] rounded-xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F4E5F] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#DCEFF3] to-[#F6F8FA] rounded-2xl p-8 border border-[#6FB7A7]/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6FB7A7] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1F4E5F] mb-2">
                  Certificações e Compliance
                </h3>
                <p className="text-[#6B7280] mb-4">
                  A Harmoni Care possui certificação ISO 27001 para segurança da informação, está em conformidade total com a LGPD e segue as melhores práticas de segurança do setor de saúde.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1F4E5F] border border-[#1F4E5F]/10">
                    ISO 27001
                  </span>
                  <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1F4E5F] border border-[#1F4E5F]/10">
                    LGPD Compliant
                  </span>
                  <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1F4E5F] border border-[#1F4E5F]/10">
                    SSL/TLS
                  </span>
                  <span className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1F4E5F] border border-[#1F4E5F]/10">
                    SOC 2 Type II
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
