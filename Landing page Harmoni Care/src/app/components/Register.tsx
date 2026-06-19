import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Activity } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    termsAccepted: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1F4E5F] via-[#6FB7A7] to-[#DCEFF3] items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            Comece sua jornada com Harmoni Care
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Junte-se a milhares de profissionais que já transformaram sua prática com nossa plataforma.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span>14 dias de teste grátis, sem cartão de crédito</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span>Suporte especializado em português</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span>Conformidade total com LGPD e CFM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 text-[#1F4E5F]">
              <Activity className="w-8 h-8" />
              <span className="font-semibold text-2xl">Harmoni Care</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#1F4E5F] mb-2">Criar sua conta</h1>
            <p className="text-[#6B7280]">Comece seu teste grátis de 14 dias</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail profissional</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F4E5F]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, termsAccepted: checked as boolean })
                }
                required
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                Aceito os{' '}
                <a href="#" className="text-[#6FB7A7] hover:text-[#1F4E5F]">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="#" className="text-[#6FB7A7] hover:text-[#1F4E5F]">
                  Política de Privacidade
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#1F4E5F] hover:bg-[#6FB7A7] text-white"
            >
              Criar conta
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280]">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-[#6FB7A7] hover:text-[#1F4E5F] font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
