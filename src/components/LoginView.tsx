import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeslaAnimatedLogo } from './TeslaAnimatedLogo';
import { 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles,
  HardHat,
  Shield,
  Building2
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, usuarios } = useApp();

  const [username, setUsername] = useState('admin');
  const [senha, setSenha] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Informe o usuário ou e-mail de acesso.');
      return;
    }

    setIsLoading(true);
    // Simula ligeiro feedback de processamento de credenciais
    setTimeout(async () => {
      const res = await login(username, senha);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Falha na autenticação.');
      }
    }, 350);
  };

  const handlePreencherUsuario = (user: string, pass: string = 'admin') => {
    setUsername(user);
    setSenha(pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 warroom-grid relative overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Simplificado */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-slate-200 uppercase text-xs">
            Tesla Engenharia
          </span>
          <span>·</span>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-900/50 px-2 py-0.5 rounded">
            Branch Dev
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Controle de Níveis & Permissões</span>
        </div>
      </div>

      {/* Caixa Central de Login com a Logo Animada */}
      <div className="w-full max-w-md my-auto z-10 space-y-6">
        {/* Logo da Tesla com Animação Coreografada de Entrada */}
        <TeslaAnimatedLogo size="large" autoStart={true} />

        {/* Card do Formulário de Acesso */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>Acesso ao Painel Operacional</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Informe suas credenciais corporativas para gerenciar equipes, obras e segurança.
            </p>
          </div>

          {/* Feedback de Erro */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                USUÁRIO OU E-MAIL
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: admin, carlos.eng, marcia.seg..."
                  required
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300 font-mono">
                  SENHA DE ACESSO
                </label>
                <span className="text-[10px] text-blue-400 font-mono">
                  Padrão Dev: admin
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha de acesso..."
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão de Entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validando Acesso...</span>
                </div>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Seletor Rápido de Contas de Teste (Branch Dev) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Acesso Rápido para Avaliação (Dev):
              </span>
              <span className="font-mono text-[10px] text-slate-500">Clique para preencher</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handlePreencherUsuario('admin', 'admin')}
                className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                  username === 'admin'
                    ? 'bg-blue-950/70 border-blue-600 text-blue-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>admin / admin</span>
                  <span className="text-[9px] font-mono uppercase px-1 rounded bg-blue-900/60 text-blue-300">Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">Acesso Geral Total</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreencherUsuario('carlos.eng', 'admin')}
                className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                  username === 'carlos.eng'
                    ? 'bg-blue-950/70 border-blue-600 text-blue-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>carlos.eng</span>
                  <span className="text-[9px] font-mono uppercase px-1 rounded bg-emerald-950 text-emerald-400">Eng</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">Coord. Elétrica</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreencherUsuario('marcia.seg', 'admin')}
                className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                  username === 'marcia.seg'
                    ? 'bg-blue-950/70 border-blue-600 text-blue-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>marcia.seg</span>
                  <span className="text-[9px] font-mono uppercase px-1 rounded bg-amber-950 text-amber-400">Seg</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">Téc. Segurança TST</div>
              </button>

              <button
                type="button"
                onClick={() => handlePreencherUsuario('fiscal', 'admin')}
                className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                  username === 'fiscal'
                    ? 'bg-blue-950/70 border-blue-600 text-blue-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>fiscal</span>
                  <span className="text-[9px] font-mono uppercase px-1 rounded bg-slate-800 text-slate-300">View</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">Fiscal Contratante</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé da Tela de Login */}
      <div className="w-full max-w-5xl text-center py-3 text-xs text-slate-500 font-mono z-10">
        <span>Tesla Engenharia e Automação Ltda · CNPJ 19.824.120/0001-45 · Sistema Multiplataforma</span>
      </div>
    </div>
  );
};
