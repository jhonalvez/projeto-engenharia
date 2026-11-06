import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Funcionario,
  Projeto,
  ProjectStatus,
  AnexoDocumento,
  ActiveTab,
  AllocationInfo,
  DiaSemana,
  EtapaPlanejamento,
  MaterialProjeto,
  Solicitante,
  PendenciaMelhoria,
  StatusPendencia,
  RegistroDDS,
  Usuario,
  PermissoesUsuario,
  NivelUsuario,
} from '../types';
import { dbService } from '../services/db';

interface AppContextType {
  // Autenticação & Usuários
  currentUser: Usuario | null;
  usuarios: Usuario[];
  login: (username: string, senha?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  salvarUsuario: (usuario: Usuario) => Promise<{ success: boolean; error?: string }>;
  excluirUsuario: (id: string) => Promise<{ success: boolean; error?: string }>;
  alternarStatusUsuario: (id: string) => Promise<void>;
  temPermissao: (permissao: keyof PermissoesUsuario) => boolean;

  // Dados
  funcionarios: Funcionario[];
  projetos: Projeto[];
  statusList: ProjectStatus[];
  anexos: AnexoDocumento[];
  solicitantes: Solicitante[];
  pendencias: PendenciaMelhoria[];
  ddsList: RegistroDDS[];
  isLoaded: boolean;

  // Navegação e filtros
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;

  // Regra de Negócio: Bloqueio de Colaborador em Múltiplos Projetos Ativos
  getFuncionarioAlocacao: (funcionarioId: string, currentEditingProjectId?: string) => AllocationInfo;
  getStatusById: (statusId: string) => ProjectStatus | undefined;
  getFuncionariosByProjeto: (projetoId: string) => Funcionario[];
  getAnexosByProjeto: (projetoId?: string) => AnexoDocumento[];
  getFotosByProjeto: (projetoId?: string) => AnexoDocumento[];
  getProjetosDoDia: (dia: DiaSemana) => Projeto[];

  // CRUD Funcionários
  salvarFuncionario: (funcionario: Funcionario) => Promise<void>;
  excluirFuncionario: (id: string) => Promise<void>;

  // CRUD Projetos
  salvarProjeto: (projeto: Projeto) => Promise<{ success: boolean; error?: string }>;
  excluirProjeto: (id: string) => Promise<void>;
  atualizarStatusProjeto: (projetoId: string, novoStatusId: string) => Promise<void>;

  // CRUD Solicitantes (Clientes)
  salvarSolicitante: (solicitante: Solicitante) => Promise<void>;
  excluirSolicitante: (id: string) => Promise<{ success: boolean; error?: string }>;

  // CRUD Pendências & Melhorias
  salvarPendencia: (pendencia: PendenciaMelhoria) => Promise<void>;
  excluirPendencia: (id: string) => Promise<void>;
  atualizarStatusPendencia: (id: string, novoStatus: StatusPendencia) => Promise<void>;

  // CRUD Diálogo Diário de Segurança (DDS)
  salvarDds: (dds: RegistroDDS) => Promise<void>;
  excluirDds: (id: string) => Promise<void>;

  // Etapas e Materiais do Projeto
  atualizarEtapaStatus: (projetoId: string, etapaId: string, novoStatus: EtapaPlanejamento['status']) => Promise<void>;
  adicionarEtapa: (projetoId: string, etapa: Omit<EtapaPlanejamento, 'id'>) => Promise<void>;
  removerEtapa: (projetoId: string, etapaId: string) => Promise<void>;
  adicionarMaterial: (projetoId: string, material: Omit<MaterialProjeto, 'id'>) => Promise<void>;
  atualizarMaterial: (projetoId: string, material: MaterialProjeto) => Promise<void>;
  removerMaterial: (projetoId: string, materialId: string) => Promise<void>;

  // CRUD Status Customizáveis
  salvarStatus: (status: ProjectStatus) => Promise<void>;
  excluirStatus: (id: string) => Promise<{ success: boolean; error?: string }>;

  // CRUD Anexos (PT, APR, Fotos, Documentos) com Download
  salvarAnexo: (anexo: AnexoDocumento) => Promise<void>;
  excluirAnexo: (id: string) => Promise<void>;
  baixarAnexo: (anexo: AnexoDocumento) => void;

  // Backup e Restauração
  exportarArquivoBackup: () => Promise<void>;
  importarArquivoBackup: (jsonContent: string) => Promise<boolean>;
  resetarDemonstracao: () => Promise<void>;

  // Impressão de OS
  projetoParaImpressao: Projeto | null;
  setProjetoParaImpressao: (projeto: Projeto | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    try {
      const saved = localStorage.getItem('tesla_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [statusList, setStatusList] = useState<ProjectStatus[]>([]);
  const [anexos, setAnexos] = useState<AnexoDocumento[]>([]);
  const [solicitantes, setSolicitantes] = useState<Solicitante[]>([]);
  const [pendencias, setPendencias] = useState<PendenciaMelhoria[]>([]);
  const [ddsList, setDdsList] = useState<RegistroDDS[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Navegação
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projetoParaImpressao, setProjetoParaImpressao] = useState<Projeto | null>(null);

  // Inicialização
  const carregarDados = useCallback(async () => {
    try {
      const data = await dbService.initializeWithSeed();
      setFuncionarios(data.funcionarios);
      setProjetos(data.projetos);
      setStatusList(data.statusList.sort((a, b) => a.ordem - b.ordem));
      setAnexos(data.anexos);
      setSolicitantes(data.solicitantes);
      setPendencias(data.pendencias);
      setDdsList(data.ddsList);
      setUsuarios(data.usuarios);
      setIsLoaded(true);
    } catch (err) {
      console.error('Erro ao carregar dados do banco local:', err);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const statusMap = useMemo(() => {
    const map = new Map<string, ProjectStatus>();
    statusList.forEach((s) => map.set(s.id, s));
    return map;
  }, [statusList]);

  const getStatusById = useCallback((statusId: string) => {
    return statusMap.get(statusId);
  }, [statusMap]);

  /**
   * REGRA DE NEGÓCIO CRUCIAL:
   * "ele nao deixa o mesmo funcionario em outro projeto sem ele ser concluido"
   */
  const getFuncionarioAlocacao = useCallback(
    (funcionarioId: string, currentEditingProjectId?: string): AllocationInfo => {
      for (const prj of projetos) {
        if (currentEditingProjectId && prj.id === currentEditingProjectId) {
          continue;
        }

        if (prj.membrosIds.includes(funcionarioId)) {
          const status = statusMap.get(prj.statusId);
          if (!status || !status.isTerminal) {
            return {
              isAlocado: true,
              projetoId: prj.id,
              projetoNome: prj.nome,
              projetoCodigo: prj.codigo,
              projetoStatusNome: status ? status.nome : 'Em Execução',
              diasSemana: prj.diasSemana,
            };
          }
        }
      }

      return { isAlocado: false };
    },
    [projetos, statusMap]
  );

  const getFuncionariosByProjeto = useCallback(
    (projetoId: string): Funcionario[] => {
      const prj = projetos.find((p) => p.id === projetoId);
      if (!prj) return [];
      return funcionarios.filter((f) => prj.membrosIds.includes(f.id));
    },
    [projetos, funcionarios]
  );

  const getAnexosByProjeto = useCallback(
    (projetoId?: string): AnexoDocumento[] => {
      if (!projetoId) return anexos;
      return anexos.filter((a) => a.projetoId === projetoId);
    },
    [anexos]
  );

  const getFotosByProjeto = useCallback(
    (projetoId?: string): AnexoDocumento[] => {
      const list = projetoId ? anexos.filter((a) => a.projetoId === projetoId) : anexos;
      return list.filter((a) => a.categoria === 'foto' || a.tipoMime.startsWith('image/'));
    },
    [anexos]
  );

  const getProjetosDoDia = useCallback(
    (dia: DiaSemana): Projeto[] => {
      return projetos.filter((p) => {
        const st = statusMap.get(p.statusId);
        return p.diasSemana.includes(dia) && (!st || !st.isTerminal);
      });
    },
    [projetos, statusMap]
  );

  // --- CRUD Funcionários ---
  const salvarFuncionario = async (funcionario: Funcionario) => {
    await dbService.saveFuncionario(funcionario);
    setFuncionarios((prev) => {
      const idx = prev.findIndex((f) => f.id === funcionario.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = funcionario;
        return next;
      }
      return [funcionario, ...prev];
    });
  };

  const excluirFuncionario = async (id: string) => {
    await dbService.deleteFuncionario(id);
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));

    const projetosAtualizados = projetos.map((p) => {
      if (p.membrosIds.includes(id)) {
        const updated = {
          ...p,
          membrosIds: p.membrosIds.filter((mid) => mid !== id),
        };
        dbService.saveProjeto(updated);
        return updated;
      }
      return p;
    });
    setProjetos(projetosAtualizados);
  };

  // --- CRUD Solicitantes (Clientes) ---
  const salvarSolicitante = async (solicitante: Solicitante) => {
    await dbService.saveSolicitante(solicitante);
    setSolicitantes((prev) => {
      const idx = prev.findIndex((s) => s.id === solicitante.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = solicitante;
        return next;
      }
      return [solicitante, ...prev];
    });
  };

  const excluirSolicitante = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const projetosComEsseSolicitante = projetos.filter((p) => p.solicitanteId === id);
    if (projetosComEsseSolicitante.length > 0) {
      return {
        success: false,
        error: `Não é possível excluir este solicitante pois ele está vinculado a ${projetosComEsseSolicitante.length} obra(s).`,
      };
    }
    await dbService.deleteSolicitante(id);
    setSolicitantes((prev) => prev.filter((s) => s.id !== id));
    return { success: true };
  };

  // --- CRUD Pendências & Melhorias ---
  const salvarPendencia = async (pendencia: PendenciaMelhoria) => {
    await dbService.savePendencia(pendencia);
    setPendencias((prev) => {
      const idx = prev.findIndex((p) => p.id === pendencia.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = pendencia;
        return next;
      }
      return [pendencia, ...prev];
    });
  };

  const excluirPendencia = async (id: string) => {
    await dbService.deletePendencia(id);
    setPendencias((prev) => prev.filter((p) => p.id !== id));
  };

  const atualizarStatusPendencia = async (id: string, novoStatus: StatusPendencia) => {
    const pend = pendencias.find((p) => p.id === id);
    if (!pend) return;
    const updated: PendenciaMelhoria = { ...pend, status: novoStatus };
    await dbService.savePendencia(updated);
    setPendencias((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  // --- CRUD Diálogo Diário de Segurança (DDS) ---
  const salvarDds = async (dds: RegistroDDS) => {
    await dbService.saveDds(dds);
    setDdsList((prev) => {
      const idx = prev.findIndex((d) => d.id === dds.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = dds;
        return next;
      }
      return [dds, ...prev];
    });
  };

  const excluirDds = async (id: string) => {
    await dbService.deleteDds(id);
    setDdsList((prev) => prev.filter((d) => d.id !== id));
  };

  // --- CRUD Projetos ---
  const salvarProjeto = async (projeto: Projeto): Promise<{ success: boolean; error?: string }> => {
    for (const membroId of projeto.membrosIds) {
      const alocacao = getFuncionarioAlocacao(membroId, projeto.id);
      if (alocacao.isAlocado) {
        const func = funcionarios.find((f) => f.id === membroId);
        const nomeFunc = func ? func.nome : 'Colaborador';
        return {
          success: false,
          error: `Conflito de alocação: ${nomeFunc} já está alocado no projeto ativo "${alocacao.projetoNome}". Conclua o projeto anterior antes de alocá-lo.`,
        };
      }
    }

    await dbService.saveProjeto(projeto);
    setProjetos((prev) => {
      const idx = prev.findIndex((p) => p.id === projeto.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = projeto;
        return next;
      }
      return [projeto, ...prev];
    });

    return { success: true };
  };

  const excluirProjeto = async (id: string) => {
    await dbService.deleteProjeto(id);
    setProjetos((prev) => prev.filter((p) => p.id !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId(null);
    }
  };

  const atualizarStatusProjeto = async (projetoId: string, novoStatusId: string) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const updated: Projeto = {
      ...prj,
      statusId: novoStatusId,
      atualizadoEm: new Date().toISOString(),
    };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  // --- Etapas e Materiais ---
  const atualizarEtapaStatus = async (
    projetoId: string,
    etapaId: string,
    novoStatus: EtapaPlanejamento['status']
  ) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const novasEtapas = prj.etapas.map((e) => (e.id === etapaId ? { ...e, status: novoStatus } : e));
    const updated: Projeto = { ...prj, etapas: novasEtapas, atualizadoEm: new Date().toISOString() };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  const adicionarEtapa = async (projetoId: string, etapa: Omit<EtapaPlanejamento, 'id'>) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const novaEtapa: EtapaPlanejamento = {
      ...etapa,
      id: `etp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated: Projeto = {
      ...prj,
      etapas: [...prj.etapas, novaEtapa],
      atualizadoEm: new Date().toISOString(),
    };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  const removerEtapa = async (projetoId: string, etapaId: string) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const updated: Projeto = {
      ...prj,
      etapas: prj.etapas.filter((e) => e.id !== etapaId),
      atualizadoEm: new Date().toISOString(),
    };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  const adicionarMaterial = async (projetoId: string, material: Omit<MaterialProjeto, 'id'>) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const novoMaterial: MaterialProjeto = {
      ...material,
      id: `mat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated: Projeto = {
      ...prj,
      materiais: [...prj.materiais, novoMaterial],
      atualizadoEm: new Date().toISOString(),
    };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  const atualizarMaterial = async (projetoId: string, material: MaterialProjeto) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const updated: Projeto = {
      ...prj,
      materiais: prj.materiais.map((m) => (m.id === material.id ? material : m)),
      atualizadoEm: new Date().toISOString(),
    };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  const removerMaterial = async (projetoId: string, materialId: string) => {
    const prj = projetos.find((p) => p.id === projetoId);
    if (!prj) return;
    const updated: Projeto = {
      ...prj,
      materiais: prj.materiais.filter((m) => m.id !== materialId),
      atualizadoEm: new Date().toISOString(),
    };
    await dbService.saveProjeto(updated);
    setProjetos((prev) => prev.map((p) => (p.id === projetoId ? updated : p)));
  };

  // --- CRUD Status Customizáveis ---
  const salvarStatus = async (status: ProjectStatus) => {
    await dbService.saveStatus(status);
    setStatusList((prev) => {
      const idx = prev.findIndex((s) => s.id === status.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = status;
        return next.sort((a, b) => a.ordem - b.ordem);
      }
      return [...prev, status].sort((a, b) => a.ordem - b.ordem);
    });
  };

  const excluirStatus = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const projetosComEsseStatus = projetos.filter((p) => p.statusId === id);
    if (projetosComEsseStatus.length > 0) {
      return {
        success: false,
        error: `Não é possível excluir este status pois ${projetosComEsseStatus.length} projeto(s) estão vinculados a ele. Reatribua-os antes.`,
      };
    }
    await dbService.deleteStatus(id);
    setStatusList((prev) => prev.filter((s) => s.id !== id));
    return { success: true };
  };

  // --- CRUD Anexos & Download ---
  const salvarAnexo = async (anexo: AnexoDocumento) => {
    await dbService.saveAnexo(anexo);
    setAnexos((prev) => {
      const idx = prev.findIndex((a) => a.id === anexo.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = anexo;
        return next;
      }
      return [anexo, ...prev];
    });
  };

  const excluirAnexo = async (id: string) => {
    await dbService.deleteAnexo(id);
    setAnexos((prev) => prev.filter((a) => a.id !== id));
  };

  const baixarAnexo = (anexo: AnexoDocumento) => {
    try {
      const link = document.createElement('a');
      link.href = anexo.dadosBase64;
      link.download = anexo.nomeArquivo || `${anexo.titulo}.dat`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao baixar anexo:', err);
    }
  };

  // --- Backup em Arquivo JSON ---
  const exportarArquivoBackup = async () => {
    const json = await dbService.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dataStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `backup-tesla-engenharia-${dataStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importarArquivoBackup = async (jsonContent: string): Promise<boolean> => {
    const ok = await dbService.importBackup(jsonContent);
    if (ok) {
      await carregarDados();
    }
    return ok;
  };

  const resetarDemonstracao = async () => {
    await dbService.resetDatabase();
    await carregarDados();
  };

  // --- Autenticação e Gestão de Usuários ---
  const login = async (username: string, senha?: string): Promise<{ success: boolean; error?: string }> => {
    const termo = username.trim().toLowerCase();
    const user = usuarios.find(
      (u) => u.username.toLowerCase() === termo || u.email.toLowerCase() === termo
    );

    if (!user) {
      return { success: false, error: 'Usuário não encontrado no sistema.' };
    }

    if (!user.ativo) {
      return { success: false, error: 'Acesso bloqueado: este usuário foi desativado.' };
    }

    // Na branch dev aceita senha cadastrada do usuário ou a senha padrão 'admin'
    const senhaDigitada = senha ? senha.trim() : '';
    const senhaValida = user.senha || 'admin';
    if (senhaDigitada !== senhaValida && senhaDigitada !== 'admin') {
      return { success: false, error: 'Senha incorreta para este usuário.' };
    }

    const userLogado: Usuario = {
      ...user,
      ultimoAcesso: new Date().toISOString(),
    };

    await dbService.saveUsuario(userLogado);
    setUsuarios((prev) => prev.map((u) => (u.id === user.id ? userLogado : u)));
    setCurrentUser(userLogado);

    try {
      localStorage.setItem('tesla_current_user', JSON.stringify(userLogado));
    } catch (e) {
      console.warn('Erro ao salvar sessão local:', e);
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('tesla_current_user');
    } catch (e) {
      console.warn('Erro ao remover sessão:', e);
    }
  };

  const salvarUsuario = async (usuario: Usuario): Promise<{ success: boolean; error?: string }> => {
    // Validar duplicidade de username
    const duplicado = usuarios.find(
      (u) => u.id !== usuario.id && u.username.toLowerCase() === usuario.username.toLowerCase()
    );
    if (duplicado) {
      return { success: false, error: `O nome de usuário "${usuario.username}" já está cadastrado.` };
    }

    await dbService.saveUsuario(usuario);
    setUsuarios((prev) => {
      const idx = prev.findIndex((u) => u.id === usuario.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = usuario;
        return copy;
      }
      return [...prev, usuario];
    });

    if (currentUser && currentUser.id === usuario.id) {
      setCurrentUser(usuario);
      try {
        localStorage.setItem('tesla_current_user', JSON.stringify(usuario));
      } catch (e) {
        console.warn('Erro ao atualizar sessão:', e);
      }
    }

    return { success: true };
  };

  const excluirUsuario = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser && currentUser.id === id) {
      return { success: false, error: 'Não é possível excluir o usuário que está atualmente logado.' };
    }

    const target = usuarios.find((u) => u.id === id);
    if (target?.username === 'admin') {
      return { success: false, error: 'O usuário administrador principal (admin) não pode ser excluído.' };
    }

    await dbService.deleteUsuario(id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    return { success: true };
  };

  const alternarStatusUsuario = async (id: string): Promise<void> => {
    const target = usuarios.find((u) => u.id === id);
    if (!target) return;
    if (target.username === 'admin' && target.ativo) return;

    const updated: Usuario = { ...target, ativo: !target.ativo };
    await dbService.saveUsuario(updated);
    setUsuarios((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const temPermissao = (permissao: keyof PermissoesUsuario): boolean => {
    if (!currentUser) return false;
    if (currentUser.nivel === 'admin') return true;
    return !!currentUser.permissoes?.[permissao];
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        usuarios,
        login,
        logout,
        salvarUsuario,
        excluirUsuario,
        alternarStatusUsuario,
        temPermissao,
        funcionarios,
        projetos,
        statusList,
        anexos,
        solicitantes,
        pendencias,
        ddsList,
        isLoaded,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        getFuncionarioAlocacao,
        getStatusById,
        getFuncionariosByProjeto,
        getAnexosByProjeto,
        getFotosByProjeto,
        getProjetosDoDia,
        salvarFuncionario,
        excluirFuncionario,
        salvarProjeto,
        excluirProjeto,
        salvarSolicitante,
        excluirSolicitante,
        salvarPendencia,
        excluirPendencia,
        atualizarStatusPendencia,
        salvarDds,
        excluirDds,
        atualizarStatusProjeto,
        atualizarEtapaStatus,
        adicionarEtapa,
        removerEtapa,
        adicionarMaterial,
        atualizarMaterial,
        removerMaterial,
        salvarStatus,
        excluirStatus,
        salvarAnexo,
        excluirAnexo,
        baixarAnexo,
        exportarArquivoBackup,
        importarArquivoBackup,
        resetarDemonstracao,
        projetoParaImpressao,
        setProjetoParaImpressao,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
