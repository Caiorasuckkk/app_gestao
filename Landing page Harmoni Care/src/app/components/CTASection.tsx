import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';

export function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#1F4E5F] via-[#1F4E5F] to-[#6FB7A7] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#6FB7A7] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Pronto para transformar sua gestão?
        </h2>
        <p className="text-xl text-white/90 mb-8 leading-relaxed">
          Junte-se a mais de 5.000 profissionais de saúde que já utilizam o Harmoni Care para economizar tempo e oferecer um atendimento excepcional.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/register" className="bg-white text-[#1F4E5F] px-8 py-4 rounded-lg hover:bg-[#DCEFF3] transition-all flex items-center justify-center gap-2 group shadow-xl">
            Começar teste grátis de 14 dias
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
            Agendar demonstração
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Sem cartão de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Setup em 5 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}