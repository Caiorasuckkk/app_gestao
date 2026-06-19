import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-[#DCEFF3]/30 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-[#DCEFF3] rounded-full">
              <span className="text-[#1F4E5F] text-sm font-medium">
                ✨ Gestão profissional para sua clínica
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1F4E5F] leading-tight">
              Gestão inteligente para profissionais da saúde
            </h1>
            
            <p className="text-xl text-[#6B7280] leading-relaxed">
              Organize pacientes, consultas, equipes multidisciplinares, documentos, financeiro e notas fiscais em um só lugar.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#6FB7A7] w-5 h-5 flex-shrink-0" />
                <span className="text-[#6B7280]">Integração com equipes multidisciplinares</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#6FB7A7] w-5 h-5 flex-shrink-0" />
                <span className="text-[#6B7280]">Prontuário eletrônico completo e seguro</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-[#6FB7A7] w-5 h-5 flex-shrink-0" />
                <span className="text-[#6B7280]">Emissão automática de notas fiscais</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="bg-[#1F4E5F] text-white px-8 py-4 rounded-lg hover:bg-[#6FB7A7] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#1F4E5F]/20">
                Começar teste grátis de 14 dias
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border-2 border-[#1F4E5F] text-[#1F4E5F] px-8 py-4 rounded-lg hover:bg-[#DCEFF3]/50 transition-colors">
                Agendar demonstração
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-[#6B7280]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#6FB7A7] w-4 h-4" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-[#6FB7A7] w-4 h-4" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6FB7A7]/20 to-[#1F4E5F]/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#1F4E5F]/10">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758411898021-ef0dadaaa295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzczNzU5MjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dashboard Harmoni Care"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}