import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  Activity,
  Calendar,
  Users,
  FileText,
  UsersRound,
  DollarSign,
  FileCheck,
  Video,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Activity },
  { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar },
  { name: 'Pacientes', href: '/dashboard/pacientes', icon: Users },
  { name: 'Prontuários', href: '/dashboard/prontuarios', icon: FileText },
  { name: 'Equipes', href: '/dashboard/equipes', icon: UsersRound },
  { name: 'Financeiro', href: '/dashboard/financeiro', icon: DollarSign },
  { name: 'Notas Fiscais', href: '/dashboard/notas-fiscais', icon: FileCheck },
  { name: 'Teleconsulta', href: '/dashboard/teleconsulta', icon: Video },
  { name: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2 text-[#1F4E5F]">
            <Activity className="w-7 h-7" />
            <span className="font-semibold text-lg">Harmoni Care</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#6B7280] hover:text-[#1F4E5F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#6FB7A7]/10 text-[#1F4E5F] font-medium'
                      : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1F4E5F]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarFallback className="bg-[#6FB7A7] text-white">DC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1F4E5F] truncate">Dr. Carlos Silva</p>
              <p className="text-xs text-[#6B7280] truncate">Medicina - CRM 12345</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-[#6B7280] hover:text-[#1F4E5F]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#6B7280] hover:text-[#1F4E5F]"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <Input
                  type="search"
                  placeholder="Buscar pacientes, prontuários..."
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#6B7280] hover:text-[#1F4E5F]"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6FB7A7] rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
