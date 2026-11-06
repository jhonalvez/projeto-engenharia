/**
 * Tipos e Interfaces do Tesla Engenharia
 * Sistema de Gestão Operacional de Equipes de Elétrica e Infraestrutura
 */

export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export interface ProjectStatus {
  id: string;
  nome: string;
  descricao?: string;
  cor: 'amber' | 'cyan' | 'blue' | 'emerald' | 'purple' | 'rose' | 'slate';
  isTerminal: boolean; // Se true (ex: 'Concluído'), desocupa os funcionários da equipe
  ordem: number;
}

export interface Solicitante {
  id: string;
  nome: string; // Nome da empresa ou cliente solicitante
  razaoSocial?: string;
  contatoResponsavel: string;
  contatoPrincipal?: string; // alias para contatoResponsavel
  email: string;
  telefone: string;
  cnpj: string;
  documento?: string; // alias para cnpj/cpf
  localidade: string;
  endereco?: string; // alias para localidade/endereço
  criadoEm: string;
}

export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  cpf: string;
  idade: number;
  especialidade: string; // Campo "tag perk" traduzido (Habilidade Principal / Ponto Forte)
  telefone?: string;
  certificacoes?: string[];
  ativo: boolean;
  dataCadastro: string;
}

export interface EtapaPlanejamento {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada';
  ordem: number;
  dataLimite?: string;
  responsavelNome?: string;
}

export interface MaterialProjeto {
  id: string;
  codigo: string;
  nome: string;
  qtdPrevista: number;
  qtdInstalada: number;
  unidade: string;
  status: 'solicitado' | 'em_transito' | 'no_canteiro' | 'instalado';
  observacao?: string;
}

export interface AnexoDocumento {
  id: string;
  projetoId?: string;
  projetoNome?: string;
  categoria: 'pt' | 'apr' | 'foto' | 'documento';
  titulo: string;
  nomeArquivo: string;
  tipoMime: string;
  tamanhoBytes: number;
  dataUpload: string;
  dadosBase64: string;
  observacoes?: string;
}

export type TipoPendencia = 'inspecao_seguranca' | 'problema_atual' | 'melhoria';
export type PrioridadePendencia = 'baixa' | 'media' | 'alta' | 'critica';
export type StatusPendencia = 'aberta' | 'em_andamento' | 'em_validacao' | 'resolvida';

export interface PendenciaMelhoria {
  id: string;
  titulo: string;
  tipo: TipoPendencia;
  projetoId?: string;
  projetoNome?: string;
  descricao: string;
  responsavel: string;
  prioridade: PrioridadePendencia;
  status: StatusPendencia;
  dataCriacao: string;
  dataPrevisao?: string;
  acaoCorretiva?: string;
}

export interface Projeto {
  id: string;
  codigo: string;
  nome: string;
  cliente: string; // Nome do Solicitante / Cliente
  solicitanteId?: string; // ID do solicitante vinculado
  local: string;
  descricao: string;
  dataInicio: string;
  dataFimPrevista: string;
  diasSemana: DiaSemana[];
  statusId: string;
  membrosIds: string[];
  etapas: EtapaPlanejamento[];
  materiais: MaterialProjeto[];
  criadoEm: string;
  atualizadoEm: string;
}

export type TipoDDS = 'diario' | 'ocorrencia';

export interface RegistroDDS {
  id: string;
  data: string; // YYYY-MM-DD
  assunto: string;
  tipo: TipoDDS; // 'diario' ou 'ocorrencia'
  projetoId?: string;
  projetoNome?: string;
  ministrante: string;
  participantesQtd: number;
  descricaoOcorrencia?: string;
  observacoes?: string;
  criadoEm: string;
}

export interface AllocationInfo {
  isAlocado: boolean;
  projetoId?: string;
  projetoNome?: string;
  projetoCodigo?: string;
  projetoStatusNome?: string;
  diasSemana?: DiaSemana[];
}

export type ActiveTab = 
  | 'overview' 
  | 'projetos' 
  | 'equipes' 
  | 'seguranca_qualidade' 
  | 'documentos' 
  | 'status_config' 
  | 'backup';

export type NivelUsuario = 'admin' | 'engenheiro' | 'tecnico' | 'visualizador';

export interface PermissoesUsuario {
  criarProjetos: boolean;
  editarProjetos: boolean;
  excluirProjetos: boolean;
  gerenciarEquipes: boolean;
  gerenciarSegurancaDDS: boolean;
  aprovarPT: boolean;
  gerenciarUsuarios: boolean;
  acessarBackup: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  username: string;
  email: string;
  senha?: string;
  cargo: string;
  nivel: NivelUsuario;
  permissoes: PermissoesUsuario;
  ativo: boolean;
  avatar?: string;
  criadoEm: string;
  ultimoAcesso?: string;
}
