import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  HardHat, 
  FolderKanban, 
  FileText, 
  Sliders, 
  Database,
  Plus,
  ShieldCheck,
  Users,
  LogOut,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenNewEmployee: () => void;
  onOpenBackup: () => void;
  onOpenUsers: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewProject,
  onOpenNewEmployee,
  onOpenBackup,
  onOpenUsers,
}) => {
  const { activeTab, setActiveTab, currentUser, logout, temPermissao } = useApp();

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Painel Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projetos', label: 'Projetos & Obras', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'equipes', label: 'Equipes & Eletricistas', icon: <HardHat className="w-4 h-4" /> },
    { id: 'seguranca_qualidade', label: 'Segurança & Qualidade', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'documentos', label: 'PTs & Documentos', icon: <FileText className="w-4 h-4" /> },
    { id: 'status_config', label: 'Status do Sistema', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0b101c]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-inner">
            <img
              src="/assets/aistudio/logo_tesla_transparent.png"
              alt="Tesla Engenharia e Automação"
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.35)]"
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-wider text-slate-100 group-hover:text-blue-400 transition-colors uppercase">
                Tesla
              </span>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase bg-blue-950/60 border border-blue-800/50 px-1.5 py-0.5 rounded">
                Engenharia
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Engenharia & Automação</p>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action, User Profile & Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Botão de Usuários (Apenas Administrador ou quem tem permissão) */}
          {(currentUser?.nivel === 'admin' || temPermissao('gerenciarUsuarios')) && (
            <button
              onClick={onOpenUsers}
              title="Gerenciar Usuários, Níveis e Permissões"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-mono font-medium">Usuários</span>
            </button>
          )}

          {/* Botão de Backup Local */}
          <button
            onClick={onOpenBackup}
            title="Banco de Dados Local e Arquivos"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Botão Novo Projeto (Se tiver permissão) */}
          {temPermissao('criarProjetos') && (
            <button
              onClick={onOpenNewProject}
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-md shadow-blue-900/30 border border-blue-500/50 transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Novo Projeto</span>
            </button>
          )}

          {/* Perfil do Usuário Logado & Logout */}
          {currentUser && (
            <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-slate-800">
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs"
                title={`Logado como: ${currentUser.nome} (${currentUser.cargo})`}
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 font-mono">
                  {currentUser.nome.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="font-semibold text-slate-200 truncate max-w-[110px]">
                    {currentUser.nome.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase">
                    {currentUser.nivel}
                  </span>
                </div>
              </div>

              {/* Botão Sair / Logout */}
              <button
                onClick={logout}
                title="Sair do Sistema (Logout)"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation Bar for Mobile and Mid-screens */}
      <div className="xl:hidden flex items-center justify-around gap-1 pt-2.5 mt-2 border-t border-slate-800/60 overflow-x-auto">
        {navLinks.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
