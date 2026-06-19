import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1F4E5F] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-[#6FB7A7] rounded-lg flex items-center justify-center">
                <span className="text-[#1F4E5F] font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-semibold">Harmoni Care</span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              A plataforma completa para gestão de profissionais da saúde. Tecnologia, segurança e humanização em um só lugar.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6FB7A7] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6FB7A7] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6FB7A7] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6FB7A7] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Produto</h3>
            <ul className="space-y-3">
              <li><a href="#funcionalidades" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Funcionalidades</a></li>
              <li><a href="#planos" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Planos e Preços</a></li>
              <li><a href="#seguranca" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Segurança</a></li>
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Integrações</a></li>
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Atualizações</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Guias e Tutoriais</a></li>
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Webinars</a></li>
              <li><a href="#" className="text-white/80 hover:text-[#6FB7A7] transition-colors">Status do Sistema</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#6FB7A7] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80">contato@harmonicare.com.br</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#6FB7A7] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80">(11) 3000-0000</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6FB7A7] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white/80">São Paulo, SP<br />Brasil</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2026 Harmoni Care. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#6FB7A7] transition-colors">Termos de Uso</a>
              <a href="#" className="text-white/60 hover:text-[#6FB7A7] transition-colors">Política de Privacidade</a>
              <a href="#" className="text-white/60 hover:text-[#6FB7A7] transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
