import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Usuario, NivelUsuario, PermissoesUsuario } from '../types';
import { formatDateBr } from '../utils/formatters';
import { 
  X, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Search, 
  Shield, 
  Lock,
  UserCheck,
  UserX
} from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PERMISSOES_POR_NIVEL: Record<NivelUsuario, PermissoesUsuario> = {
  admin: {
    criarProjetos: true,
    editarProjetos: true,
    excluirProjetos: true,
    gerenciarEquipes: true,
    gerenciarSegurancaDDS: true,
    aprovarPT: true,
    gerenciarUsuarios: true,
    acessarBackup: true,
  },
  engenheiro: {
    criarProjetos: true,
    editarProjetos: true,
    excluirProjetos: false,
    gerenciarEquipes: true,
    gerenciarSegurancaDDS: true,
    aprovarPT: true,
    gerenciarUsuarios: false,
    acessarBackup: false,
  },
  tecnico: {
    criarProjetos: false,
    editarProjetos: false,
    excluirProjetos: false,
    gerenciarEquipes: false,
    gerenciarSegurancaDDS: true,
    aprovarPT: true,
    gerenciarUsuarios: false,
    acessarBackup: false,
  },
  visualizador: {
    criarProjetos: false,
    editarProjetos: false,
    excluirProjetos: false,
    gerenciarEquipes: false,
    gerenciarSegurancaDDS: false,
    aprovarPT: false,
    gerenciarUsuarios: false,
    acessarBackup: false,
  },
};

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    usuarios, 
    currentUser, 
    salvarUsuario, 
    excluirUsuario, 
    alternarStatusUsuario 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<Usuario | null>(null);
  const [isEditingFormOpen, setIsEditingFormOpen] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('admin');
  const [nivel, setNivel] = useState<NivelUsuario>('engenheiro');
  const [ativo, setAtivo] = useState(true);
  const [permissoes, setPermissoes] = useState<PermissoesUsuario>(DEFAULT_PERMISSOES_POR_NIVEL.engenheiro);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const filteredUsuarios = usuarios.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.nome.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.cargo.toLowerCase().includes(q)
    );
  });

  const handleOpenNewUser = () => {
    setSelectedUserToEdit(null);
    setNome('');
    setUsername('');
    setEmail('');
    setCargo('');
    setSenha('admin');
    setNivel('engenheiro');
    setAtivo(true);
    setPermissoes(DEFAULT_PERMISSOES_POR_NIVEL.engenheiro);
    setFormError('');
    setIsEditingFormOpen(true);
  };

  const handleEditUser = (user: Usuario) => {
    setSelectedUserToEdit(user);
    setNome(user.nome);
    setUsername(user.username);
    setEmail(user.email);
    setCargo(user.cargo);
    setSenha(user.senha || 'admin');
    setNivel(user.nivel);
    setAtivo(user.ativo);
    setPermissoes(user.permissoes || DEFAULT_PERMISSOES_POR_NIVEL[user.nivel]);
    setFormError('');
    setIsEditingFormOpen(true);
  };

  const handleNivelChange = (novoNivel: NivelUsuario) => {
    setNivel(novoNivel);
    setPermissoes(DEFAULT_PERMISSOES_POR_NIVEL[novoNivel]);
  };

  const togglePermissao = (key: keyof PermissoesUsuario) => {
    setPermissoes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!nome.trim() || !username.trim() || !email.trim()) {
      setFormError('Preencha os campos obrigatórios (Nome, Usuário e E-mail).');
      return;
    }

    const payload: Usuario = {
      id: selectedUserToEdit ? selectedUserToEdit.id : `usr_${Date.now()}`,
      nome: nome.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      cargo: cargo.trim() || 'Colaborador Tesla',
      senha: senha.trim() || 'admin',
      nivel,
      permissoes,
      ativo,
      criadoEm: selectedUserToEdit ? selectedUserToEdit.criadoEm : new Date().toISOString(),
      ultimoAcesso: selectedUserToEdit?.ultimoAcesso,
    };

    const res = await salvarUsuario(payload);
    if (res.success) {
      setIsEditingFormOpen(false);
      setSelectedUserToEdit(null);
    } else {
      setFormError(res.error || 'Erro ao salvar usuário.');
    }
  };

  const handleConfirmDelete = async () => {
    if (usuarioParaExcluir) {
      const res = await excluirUsuario(usuarioParaExcluir.id);
      if (res.success) {
        setUsuarioParaExcluir(null);
      } else {
        alert(res.error || 'Erro ao excluir usuário');
      }
    }
  };

  const getNivelBadgeClass = (lvl: NivelUsuario) => {
    switch (lvl) {
      case 'admin':
        return 'bg-blue-950/80 border-blue-800 text-blue-300';
      case 'engenheiro':
        return 'bg-emerald-950/80 border-emerald-800 text-emerald-300';
      case 'tecnico':
        return 'bg-amber-950/80 border-amber-800 text-amber-300';
      case 'visualizador':
        return 'bg-slate-900 border-slate-700 text-slate-300';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-900/60 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Gerenciamento de Usuários & Permissões</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-900 text-blue-400">
                  RBAC
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Cadastro de usuários corporativos, atribuição de cargos, níveis de acesso e travas de segurança.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Barra de Ações: Busca e Botão Novo Usuário */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, usuário, e-mail ou cargo..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleOpenNewUser}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/30 transition-colors shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>

          {/* Tabela de Usuários */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 text-xs font-mono">
                    <th className="py-3 px-4">COLABORADOR / USUÁRIO</th>
                    <th className="py-3 px-4">NÍVEL DE ACESSO</th>
                    <th className="py-3 px-4">CARGO</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">ÚLTIMO ACESSO</th>
                    <th className="py-3 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm">
                  {filteredUsuarios.map((u) => {
                    const isSelf = currentUser?.id === u.id;
                    const isMasterAdmin = u.username === 'admin';
                    const badgeClass = getNivelBadgeClass(u.nivel);

                    return (
                      <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-100 flex items-center gap-2">
                            <span>{u.nome}</span>
                            {isSelf && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300">
                                Você
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            @{u.username} · {u.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-medium border uppercase font-mono ${badgeClass}`}
                          >
                            {u.nivel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {u.cargo}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() => alternarStatusUsuario(u.id)}
                            disabled={isMasterAdmin}
                            title={isMasterAdmin ? 'O administrador padrão não pode ser desativado' : 'Clique para alterar status'}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border transition-colors ${
                              u.ativo
                                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/40'
                                : 'bg-rose-950/60 border-rose-800/60 text-rose-300 hover:bg-rose-900/40'
                            } ${isMasterAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.ativo ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            <span>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-400">
                          {u.ultimoAcesso ? formatDateBr(u.ultimoAcesso) : 'Nunca'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditUser(u)}
                              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                              title="Editar usuário e permissões"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setUsuarioParaExcluir(u)}
                              disabled={isMasterAdmin || isSelf}
                              className={`p-1.5 rounded transition-colors ${
                                isMasterAdmin || isSelf
                                  ? 'text-slate-600 cursor-not-allowed'
                                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer'
                              }`}
                              title={
                                isMasterAdmin
                                  ? 'Administrador padrão protegido contra exclusão'
                                  : isSelf
                                  ? 'Não é possível excluir seu próprio usuário logado'
                                  : 'Excluir usuário'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Formulário: Novo / Editar Usuário */}
      {isEditingFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <span>{selectedUserToEdit ? 'Editar Usuário & Permissões' : 'Cadastrar Novo Usuário'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure dados cadastrais, cargo, credenciais e permissões granulares no sistema.
                </p>
              </div>
              <button
                onClick={() => setIsEditingFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUser} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Linha 1: Nome e Usuário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    NOME COMPLETO *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Ex: Eng. Rafael Silveira"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                    NOME DE USUÁRIO (LOGIN) *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Ex: rafael.silveira"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Linha 2: E-mail e Cargo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    E-MAIL CORPORATIVO *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Ex: rafael@tesla-engenharia.com.br"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    CARGO / FUNÇÃO *
                  </label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    required
                    placeholder="Ex: Supervisor de Manutenção Elétrica"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Linha 3: Senha e Nível de Acesso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>SENHA (ACESSO DEV) *</span>
                    <span className="text-[10px] text-slate-500 font-mono">Padrão: admin</span>
                  </label>
                  <input
                    type="text"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    placeholder="admin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    NÍVEL DE ACESSO (PERFIL) *
                  </label>
                  <select
                    value={nivel}
                    onChange={(e) => handleNivelChange(e.target.value as NivelUsuario)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="admin">Administrador (Controle Total & Usuários)</option>
                    <option value="engenheiro">Engenheiro (Projetos, Equipes & PTs)</option>
                    <option value="tecnico">Técnico (Segurança, DDS & Validação)</option>
                    <option value="visualizador">Visualizador (Somente Leitura)</option>
                  </select>
                </div>
              </div>

              {/* Linha 4: Permissões Granulares */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    PERMISSÕES GRANULARES ESPECÍFICAS
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ajuste fino individual
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.criarProjetos}
                      onChange={() => togglePermissao('criarProjetos')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Cadastrar Novos Projetos / Obras</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.editarProjetos}
                      onChange={() => togglePermissao('editarProjetos')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Editar Obras e Cronogramas</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.excluirProjetos}
                      onChange={() => togglePermissao('excluirProjetos')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Excluir Projetos</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.gerenciarEquipes}
                      onChange={() => togglePermissao('gerenciarEquipes')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Gerenciar Colaboradores e Escalas</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.gerenciarSegurancaDDS}
                      onChange={() => togglePermissao('gerenciarSegurancaDDS')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Gerenciar DDS e Pendências</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.aprovarPT}
                      onChange={() => togglePermissao('aprovarPT')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Aprovar PTs e APRs de Segurança</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.gerenciarUsuarios}
                      onChange={() => togglePermissao('gerenciarUsuarios')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Administrar Usuários e Níveis</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={permissoes.acessarBackup}
                      onChange={() => togglePermissao('acessarBackup')}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Exportar/Importar Backup JSON</span>
                  </label>
                </div>
              </div>

              {/* Status Ativo Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="user-ativo-checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="user-ativo-checkbox" className="text-xs text-slate-300 cursor-pointer">
                  Usuário Ativo (habilitado para login no sistema)
                </label>
              </div>

              {/* Botões do Rodapé */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {usuarioParaExcluir && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Confirmar Exclusão de Usuário</h3>
            <p className="text-xs md:text-sm text-slate-400">
              Tem certeza que deseja remover o usuário{' '}
              <strong className="text-slate-200">{usuarioParaExcluir.nome}</strong> (@{usuarioParaExcluir.username})? Esta ação revogará imediatamente o acesso desta conta.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUsuarioParaExcluir(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Excluir Usuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
