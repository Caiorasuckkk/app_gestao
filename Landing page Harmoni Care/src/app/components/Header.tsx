import { Menu } from 'lucide-react';
import { Link } from 'react-router';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#1F4E5F]/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1F4E5F] to-[#6FB7A7] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-semibold text-[#1F4E5F]">Harmoni Care</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#beneficios" className="text-[#6B7280] hover:text-[#1F4E5F] transition-colors">Benefícios</a>
            <a href="#funcionalidades" className="text-[#6B7280] hover:text-[#1F4E5F] transition-colors">Funcionalidades</a>
            <a href="#seguranca" className="text-[#6B7280] hover:text-[#1F4E5F] transition-colors">Segurança</a>
            <a href="#planos" className="text-[#6B7280] hover:text-[#1F4E5F] transition-colors">Planos</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-[#1F4E5F] hover:text-[#6FB7A7] transition-colors">
              Entrar
            </Link>
            <Link to="/register" className="bg-[#1F4E5F] text-white px-6 py-2.5 rounded-lg hover:bg-[#6FB7A7] transition-colors">
              Começar grátis
            </Link>
            <button className="md:hidden text-[#1F4E5F]">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}