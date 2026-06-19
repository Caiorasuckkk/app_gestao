import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Activity } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 text-[#1F4E5F]">
              <Activity className="w-8 h-8" />
              <span className="font-semibold text-2xl">Harmoni Care</span>
            </Link>
            <h1 className="text-3xl font-bold text-[#1F4E5F] mb-2">Bem-vindo de volta</h1>
            <p className="text-[#6B7280]">Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-[#6FB7A7] hover:text-[#1F4E5F]">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              className="w-full h-11 bg-[#1F4E5F] hover:bg-[#6FB7A7] text-white"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B7280]">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-[#6FB7A7] hover:text-[#1F4E5F] font-medium">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Gradient */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1F4E5F] via-[#6FB7A7] to-[#DCEFF3] items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">
            Gestão completa da sua prática profissional
          </h2>
          <p className="text-lg opacity-90">
            Agenda, prontuários eletrônicos, teleconsulta, gestão financeira e muito mais em uma única plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
