import { Users, Shield, Share2, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function MultidisciplinarySection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6FB7A7]/20 to-[#1F4E5F]/20 rounded-2xl blur-3xl"></div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#DCEFF3] to-[#F6F8FA] rounded-2xl p-8 border border-[#1F4E5F]/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-[#6FB7A7]/20">
                    <div className="w-12 h-12 bg-[#1F4E5F] rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#1F4E5F] mb-2">Médico</h4>
                    <p className="text-sm text-[#6B7280]">Dr. João Silva</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-[#6FB7A7]/20 mt-6">
                    <div className="w-12 h-12 bg-[#6FB7A7] rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#1F4E5F] mb-2">Psicóloga</h4>
                    <p className="text-sm text-[#6B7280]">Dra. Maria Costa</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-[#6FB7A7]/20 -mt-2">
                    <div className="w-12 h-12 bg-[#6FB7A7] rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#1F4E5F] mb-2">Nutricionista</h4>
                    <p className="text-sm text-[#6B7280]">Dra. Ana Santos</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-[#6FB7A7]/20 mt-4">
                    <div className="w-12 h-12 bg-[#1F4E5F] rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#1F4E5F] mb-2">Fisioterapeuta</h4>
                    <p className="text-sm text-[#6B7280]">Dr. Pedro Lima</p>
                  </div>
                </div>
                <div className="mt-6 bg-white p-4 rounded-xl shadow-lg border-2 border-[#6FB7A7]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#DCEFF3] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#1F4E5F]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1F4E5F]">Paciente: Marina Oliveira</p>
                      <p className="text-sm text-[#6B7280]">4 profissionais trabalhando em conjunto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-[#6FB7A7] font-semibold mb-2 block">COLABORAÇÃO</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1F4E5F] mb-4">
                Equipes multidisciplinares unidas pelo paciente
              </h2>
              <p className="text-xl text-[#6B7280] leading-relaxed">
                Médicos, psicólogos, nutricionistas e fisioterapeutas trabalhando juntos de forma integrada e segura.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#DCEFF3] rounded-lg flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-[#1F4E5F]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F4E5F] mb-2">
                    Compartilhamento controlado
                  </h3>
                  <p className="text-[#6B7280]">
                    Defina exatamente o que cada profissional pode ver e editar no prontuário compartilhado.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#DCEFF3] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#1F4E5F]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F4E5F] mb-2">
                    Segurança e privacidade
                  </h3>
                  <p className="text-[#6B7280]">
                    Logs de auditoria completos e criptografia de ponta a ponta em todas as comunicações.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#DCEFF3] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1F4E5F]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F4E5F] mb-2">
                    Visão 360º do paciente
                  </h3>
                  <p className="text-[#6B7280]">
                    Histórico completo de todos os atendimentos e profissionais envolvidos no tratamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
