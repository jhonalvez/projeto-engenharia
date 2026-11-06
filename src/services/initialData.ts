import { Funcionario, Projeto, ProjectStatus, AnexoDocumento, Solicitante, PendenciaMelhoria, RegistroDDS, Usuario } from '../types';

export const initialStatuses: ProjectStatus[] = [
  {
    id: 'status_aguardando_apr',
    nome: 'Aguardando APR',
    descricao: 'Análise Preliminar de Risco em validação pela Segurança do Trabalho',
    cor: 'amber',
    isTerminal: false,
    ordem: 1,
  },
  {
    id: 'status_aguardando_pt',
    nome: 'Aguardando PT',
    descricao: 'Permissão de Trabalho requerida para atividades em altura ou energizadas',
    cor: 'cyan',
    isTerminal: false,
    ordem: 2,
  },
  {
    id: 'status_em_andamento',
    nome: 'Em Andamento',
    descricao: 'Equipe em campo executando o cronograma de obras/elétrica',
    cor: 'blue',
    isTerminal: false,
    ordem: 3,
  },
  {
    id: 'status_pausado',
    nome: 'Pausado',
    descricao: 'Obra temporariamente retida por interferência física ou falta de material',
    cor: 'slate',
    isTerminal: false,
    ordem: 4,
  },
  {
    id: 'status_comissionamento',
    nome: 'Comissionamento / Testes',
    descricao: 'Testes de isolação (Megômetro), continuidade e parametrização',
    cor: 'purple',
    isTerminal: false,
    ordem: 5,
  },
  {
    id: 'status_concluido',
    nome: 'Concluído',
    descricao: 'Obra entregue e assinada pelo cliente. Equipe liberada.',
    cor: 'emerald',
    isTerminal: true,
    ordem: 6,
  },
];

export const initialSolicitantes: Solicitante[] = [
  {
    id: 'sol_01',
    nome: 'Indústrias Metalúrgicas Votoran S/A',
    contatoResponsavel: 'Eng. Marcos Pontes (Gerente Industrial)',
    email: 'marcos.pontes@votoran.com.br',
    telefone: '(31) 3512-9000',
    cnpj: '18.239.401/0001-44',
    localidade: 'Betim / MG',
    criadoEm: '2026-01-05',
  },
  {
    id: 'sol_02',
    nome: 'Centro de Distribuição Express Global',
    contatoResponsavel: 'Mariana Duarte (Coordenadora de Infra)',
    email: 'm.duarte@expressglobal.com',
    telefone: '(11) 4811-2200',
    cnpj: '24.908.112/0003-89',
    localidade: 'Itupeva / SP',
    criadoEm: '2026-01-15',
  },
  {
    id: 'sol_03',
    nome: 'Cervejaria Artesanal Paulista Ltda',
    contatoResponsavel: 'Ricardo Faria (Supervisor de Manutenção)',
    email: 'faria@cervejariapaulista.ind.br',
    telefone: '(11) 4589-3344',
    cnpj: '09.441.872/0001-15',
    localidade: 'Jundiaí / SP',
    criadoEm: '2026-02-01',
  },
  {
    id: 'sol_04',
    nome: 'Shopping Center Parque Dourado',
    contatoResponsavel: 'Carlos Alberto Bueno (Eng. Predial)',
    email: 'engenharia@parquedourado.com.br',
    telefone: '(19) 3788-5500',
    cnpj: '03.882.190/0001-70',
    localidade: 'Campinas / SP',
    criadoEm: '2026-02-10',
  },
];

export const initialFuncionarios: Funcionario[] = [
  {
    id: 'func_01',
    nome: 'Carlos Eduardo Silva',
    funcao: 'Encarregado Geral de Elétrica',
    cpf: '128.492.301-82',
    idade: 42,
    especialidade: 'Subestações & Alta Tensão',
    telefone: '(11) 98765-4321',
    certificacoes: ['NR-10', 'NR-35', 'SEP', 'Primeiros Socorros'],
    ativo: true,
    dataCadastro: '2026-01-10',
  },
  {
    id: 'func_02',
    nome: 'Marcos Vinicius Ramos',
    funcao: 'Eletricista Força e Controle',
    cpf: '219.832.411-90',
    idade: 34,
    especialidade: 'Painéis CCM & Inversores',
    telefone: '(11) 99123-5544',
    certificacoes: ['NR-10', 'NR-35', 'Manobras em BT'],
    ativo: true,
    dataCadastro: '2026-01-12',
  },
  {
    id: 'func_03',
    nome: 'Rodrigo Santana',
    funcao: 'Eletricista Montador',
    cpf: '382.109.472-15',
    idade: 29,
    especialidade: 'Leitos & Eletrocalhas',
    telefone: '(11) 97654-8899',
    certificacoes: ['NR-10', 'NR-35', 'Trabalho a Quente'],
    ativo: true,
    dataCadastro: '2026-01-15',
  },
  {
    id: 'func_04',
    nome: 'Lucas Almeida Prado',
    funcao: 'Técnico de Automação & CLP',
    cpf: '401.992.118-44',
    idade: 31,
    especialidade: 'CLP Siemens & Redes Profinet',
    telefone: '(11) 98111-2233',
    certificacoes: ['NR-10', 'CFT', 'Redes Industriais'],
    ativo: true,
    dataCadastro: '2026-01-20',
  },
  {
    id: 'func_05',
    nome: 'Fernando Mendes de Oliveira',
    funcao: 'Ajudante de Elétrica',
    cpf: '518.239.001-20',
    idade: 24,
    especialidade: 'Lançamento Pesado de Cabos',
    telefone: '(11) 98444-5566',
    certificacoes: ['NR-10 Básico', 'NR-35'],
    ativo: true,
    dataCadastro: '2026-02-01',
  },
  {
    id: 'func_06',
    nome: 'André Luiz Nogueira',
    funcao: 'Técnico em Segurança (TST)',
    cpf: '640.119.829-33',
    idade: 38,
    especialidade: 'Auditoria de PT & APR',
    telefone: '(11) 97000-1122',
    certificacoes: ['MTE', 'NR-10', 'NR-35', 'NR-33 Espaço Confinado'],
    ativo: true,
    dataCadastro: '2026-02-05',
  },
  {
    id: 'func_07',
    nome: 'Diego Barcellos',
    funcao: 'Eletricista Bobinador & Força',
    cpf: '722.903.481-09',
    idade: 36,
    especialidade: 'Motores & Soft-Starters',
    telefone: '(11) 99888-7744',
    certificacoes: ['NR-10', 'NR-12', 'Termografia Nível 1'],
    ativo: true,
    dataCadastro: '2026-02-10',
  },
  {
    id: 'func_08',
    nome: 'Thiago Ferreira Lima',
    funcao: 'Instrumentista Industrial',
    cpf: '819.340.219-57',
    idade: 33,
    especialidade: 'Calibração de Transmissores 4-20mA',
    telefone: '(11) 98222-3311',
    certificacoes: ['NR-10', 'Áreas Classificadas Ex'],
    ativo: true,
    dataCadastro: '2026-02-14',
  },
  {
    id: 'func_09',
    nome: 'Gabriel Souza Matos',
    funcao: 'Eletricista Força e Controle',
    cpf: '902.183.471-12',
    idade: 28,
    especialidade: 'Fusão de Fibra Óptica & Redes',
    telefone: '(11) 97333-4422',
    certificacoes: ['NR-10', 'NR-35', 'Certificação Furukawa'],
    ativo: true,
    dataCadastro: '2026-02-18',
  },
  {
    id: 'func_10',
    nome: 'Robson Pinheiro',
    funcao: 'Ajudante de Elétrica',
    cpf: '109.837.264-00',
    idade: 22,
    especialidade: 'Conexões & Prensa-Cabos',
    telefone: '(11) 96555-8811',
    certificacoes: ['NR-10 Básico'],
    ativo: true,
    dataCadastro: '2026-02-22',
  },
];

export const initialProjetos: Projeto[] = [
  {
    id: 'prj_01',
    codigo: 'TESLA-2026-001',
    nome: 'Retrofit Geral da Subestação 13.8kV',
    cliente: 'Indústrias Metalúrgicas Votoran S/A',
    solicitanteId: 'sol_01',
    local: 'Canteiro Industrial - Betim / MG',
    descricao: 'Substituição de cubículos de média tensão 13.8kV, troca de barramentos de cobre, instalação de relés digitais de proteção SEL e adequação à NR-10.',
    dataInicio: '2026-11-01',
    dataFimPrevista: '2026-11-28',
    diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
    statusId: 'status_em_andamento',
    membrosIds: ['func_01', 'func_02', 'func_03', 'func_06'],
    etapas: [
      { id: 'etp_1', titulo: 'Desenergização e Bloqueio LOTO com aterramento temporário', status: 'concluida', ordem: 1, dataLimite: '2026-11-02', responsavelNome: 'Carlos Eduardo' },
      { id: 'etp_2', titulo: 'Desmontagem dos disjuntores a PVO antigos', status: 'concluida', ordem: 2, dataLimite: '2026-11-06', responsavelNome: 'Marcos Vinicius' },
      { id: 'etp_3', titulo: 'Içamento e fixação dos novos cubículos compactos SF6', status: 'em_andamento', ordem: 3, dataLimite: '2026-11-14', responsavelNome: 'Rodrigo Santana' },
      { id: 'etp_4', titulo: 'Conexão dos cabos isolados de cobre 15kV EPR 185mm²', status: 'pendente', ordem: 4, dataLimite: '2026-11-20', responsavelNome: 'Carlos Eduardo' },
      { id: 'etp_5', titulo: 'Ensaios de Tensão Aplicada (Hipot) e comissionamento de relés', status: 'pendente', ordem: 5, dataLimite: '2026-11-26', responsavelNome: 'André Luiz' },
    ],
    materiais: [
      { id: 'mat_1', codigo: 'CAB-15KV-185', nome: 'Cabo MT EPR 8.7/15kV 185mm² Cobre', qtdPrevista: 450, qtdInstalada: 320, unidade: 'm', status: 'no_canteiro' },
      { id: 'mat_2', codigo: 'BAR-CU-50X10', nome: 'Barra Chata Cobre Eletrolítico 50x10mm', qtdPrevista: 18, qtdInstalada: 18, unidade: 'barra', status: 'instalado' },
      { id: 'mat_3', codigo: 'TER-CON-185', nome: 'Terminal Desconectável T-Body 630A 15kV', qtdPrevista: 12, qtdInstalada: 6, unidade: 'un', status: 'no_canteiro' },
      { id: 'mat_4', codigo: 'REL-SEL-751', nome: 'Relé de Proteção de Alimentador SEL-751A', qtdPrevista: 3, qtdInstalada: 3, unidade: 'un', status: 'instalado' },
    ],
    criadoEm: '2026-10-25T08:00:00Z',
    atualizadoEm: '2026-11-05T14:30:00Z',
  },
  {
    id: 'prj_02',
    codigo: 'TESLA-2026-002',
    nome: 'Infraestrutura Elétrica & Leitos - Novo Hub Logístico',
    cliente: 'Centro de Distribuição Express Global',
    solicitanteId: 'sol_02',
    local: 'Rodovia dos Bandeirantes, km 72 - Itupeva / SP',
    descricao: 'Lançamento de leitos reforçados em aço galvanizado a fogo para distribuição de força e iluminação LED em 42.000m² de área coberta.',
    dataInicio: '2026-11-08',
    dataFimPrevista: '2026-12-15',
    diasSemana: ['seg', 'qua', 'qui', 'sex', 'sab'],
    statusId: 'status_aguardando_pt',
    membrosIds: ['func_04', 'func_05', 'func_10'],
    etapas: [
      { id: 'etp_201', titulo: 'Inspeção e liberação de plataformas elevatórias (PTA)', status: 'concluida', ordem: 1, dataLimite: '2026-11-08' },
      { id: 'etp_202', titulo: 'Emissão e assinatura da PT de Trabalho em Altura (NR-35)', status: 'em_andamento', ordem: 2, dataLimite: '2026-11-09' },
      { id: 'etp_203', titulo: 'Fixação de tirantes e perfilados na estrutura metálica', status: 'pendente', ordem: 3, dataLimite: '2026-11-18' },
      { id: 'etp_204', titulo: 'Montagem dos leitos tipo escada 400x100mm', status: 'pendente', ordem: 4, dataLimite: '2026-11-28' },
    ],
    materiais: [
      { id: 'mat_201', codigo: 'LEI-ESC-400', nome: 'Leito para Cabos Tipo Escada 400x100x3000mm', qtdPrevista: 320, qtdInstalada: 40, unidade: 'barra', status: 'no_canteiro' },
      { id: 'mat_202', codigo: 'TIR-ROS-3/8', nome: 'Barra Roscada Zincada 3/8 pol x 3m', qtdPrevista: 180, qtdInstalada: 80, unidade: 'barra', status: 'no_canteiro' },
      { id: 'mat_203', codigo: 'CAB-FLEX-70', nome: 'Cabo Flexível 0.6/1kV 70mm² Preto', qtdPrevista: 1200, qtdInstalada: 0, unidade: 'm', status: 'em_transito' },
    ],
    criadoEm: '2026-11-01T10:15:00Z',
    atualizadoEm: '2026-11-05T11:00:00Z',
  },
  {
    id: 'prj_03',
    codigo: 'TESLA-2026-003',
    nome: 'Automação & Painéis da Linha de Envase 04',
    cliente: 'Cervejaria Artesanal Paulista Ltda',
    solicitanteId: 'sol_03',
    local: 'Unidade Industrial 2 - Jundiaí / SP',
    descricao: 'Montagem dos painéis remotos de comando com CLP S7-1500, variadores de velocidade e instrumentação de vazão e pressão higiênica.',
    dataInicio: '2026-11-10',
    dataFimPrevista: '2026-12-05',
    diasSemana: ['ter', 'qui', 'sab'],
    statusId: 'status_aguardando_apr',
    membrosIds: ['func_07', 'func_08'],
    etapas: [
      { id: 'etp_301', titulo: 'Validação da Análise Preliminar de Risco (APR) de Linha Química', status: 'em_andamento', ordem: 1, dataLimite: '2026-11-10' },
      { id: 'etp_302', titulo: 'Instalação mecânica dos quadros em aço inox 304 IP66', status: 'pendente', ordem: 2, dataLimite: '2026-11-15' },
      { id: 'etp_303', titulo: 'Passagem dos cabos de sinal blindados 4x0.75mm²', status: 'pendente', ordem: 3, dataLimite: '2026-11-22' },
      { id: 'etp_304', titulo: 'Calibração dos transmissores de vazão mássica', status: 'pendente', ordem: 4, dataLimite: '2026-11-30' },
    ],
    materiais: [
      { id: 'mat_301', codigo: 'PAI-INOX-66', nome: 'Painel Aço Inox 304 800x600x300mm IP66', qtdPrevista: 4, qtdInstalada: 0, unidade: 'un', status: 'solicitado' },
      { id: 'mat_302', codigo: 'CAB-MAN-075', nome: 'Cabo Manga Blindado 4x0.75mm² AWG18', qtdPrevista: 800, qtdInstalada: 0, unidade: 'm', status: 'em_transito' },
    ],
    criadoEm: '2026-11-03T09:00:00Z',
    atualizadoEm: '2026-11-05T09:30:00Z',
  },
  {
    id: 'prj_04',
    codigo: 'TESLA-2026-000',
    nome: 'Manutenção Preditiva & Termografia Subestação Sul',
    cliente: 'Shopping Center Parque Dourado',
    solicitanteId: 'sol_04',
    local: 'Subestação Principal - Campinas / SP',
    descricao: 'Inspeção termográfica completa em barramentos, reaperto com torquímetro calibrado e limpeza técnica com aspirador antiestático.',
    dataInicio: '2026-10-15',
    dataFimPrevista: '2026-10-22',
    diasSemana: ['sab', 'dom'],
    statusId: 'status_concluido',
    membrosIds: ['func_09'],
    etapas: [
      { id: 'etp_401', titulo: 'Inspeção termográfica inicial sob carga plena', status: 'concluida', ordem: 1 },
      { id: 'etp_402', titulo: 'Reaperto de todas as conexões com torquímetro', status: 'concluida', ordem: 2 },
      { id: 'etp_403', titulo: 'Emissão do Laudo Técnico Conclusivo com ART', status: 'concluida', ordem: 3 },
    ],
    materiais: [
      { id: 'mat_401', codigo: 'LIM-SOL-DIE', nome: 'Solvente Dielétrico Desengraxante 5L', qtdPrevista: 2, qtdInstalada: 2, unidade: 'un', status: 'instalado' },
    ],
    criadoEm: '2026-10-10T14:00:00Z',
    atualizadoEm: '2026-10-23T18:00:00Z',
  },
];

export const initialPendenciasMelhorias: PendenciaMelhoria[] = [
  {
    id: 'pend_01',
    titulo: 'Adequar fixação e aterramento temporário do cubículo 03 de 13.8kV',
    tipo: 'inspecao_seguranca',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    descricao: 'Durante a inspeção de liberação da PT, foi constatada a necessidade de reforçar a garra do aterramento temporário trifásico antes de qualquer manobra de barramento.',
    responsavel: 'André Luiz Nogueira (TST)',
    prioridade: 'critica',
    status: 'em_andamento',
    dataCriacao: '2026-11-04',
    dataPrevisao: '2026-11-06',
    acaoCorretiva: 'Instalação de conjunto de aterramento temporário certificado com laudo de teste dielétrico atualizado.',
  },
  {
    id: 'pend_02',
    titulo: 'Substituir trava-quedas retrátil danificado da equipe no galpão logístico',
    tipo: 'inspecao_seguranca',
    projetoId: 'prj_02',
    projetoNome: 'Infraestrutura Elétrica & Leitos - Novo Hub Logístico',
    descricao: 'Equipamento apresentou travamento irregular no ensaio pré-operacional de NR-35. Retirado de operação imediatamente.',
    responsavel: 'Lucas Almeida Prado',
    prioridade: 'alta',
    status: 'resolvida',
    dataCriacao: '2026-11-02',
    dataPrevisao: '2026-11-03',
    acaoCorretiva: 'Substituição por equipamento reserva lacrado e envio do item danificado para calibração.',
  },
  {
    id: 'pend_03',
    titulo: 'Interferência física entre leito elétrico 400mm e duto de ventilação no Eixo 14',
    tipo: 'problema_atual',
    projetoId: 'prj_02',
    projetoNome: 'Infraestrutura Elétrica & Leitos - Novo Hub Logístico',
    descricao: 'Duto de ar condicionado instalado fora do projeto civil impede a passagem em linha reta da esteira de cabos principal.',
    responsavel: 'Carlos Eduardo Silva',
    prioridade: 'alta',
    status: 'em_andamento',
    dataCriacao: '2026-11-03',
    dataPrevisao: '2026-11-08',
    acaoCorretiva: 'Execução de desvio em curva vertical 90º com suporte intermediário adicional.',
  },
  {
    id: 'pend_04',
    titulo: 'Atraso de entrega das conexões flangeadas dos painéis de aço inox',
    tipo: 'problema_atual',
    projetoId: 'prj_03',
    projetoNome: 'Automação & Painéis da Linha de Envase 04',
    descricao: 'Fornecedor de corte laser atrasou a entrega das flanges de vedação IP66 para a entrada de cabos.',
    responsavel: 'Thiago Ferreira Lima',
    prioridade: 'media',
    status: 'aberta',
    dataCriacao: '2026-11-05',
    dataPrevisao: '2026-11-12',
    acaoCorretiva: 'Cobrança formal e acionamento de usinagem emergencial local parceira.',
  },
  {
    id: 'pend_05',
    titulo: 'Instalar iluminação LED provisória de alta eficiência no túnel de cabos',
    tipo: 'melhoria',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    descricao: 'Melhorar a visibilidade da equipe de lançamento de cabos no subterrâneo para aumentar a produtividade e prevenir quedas.',
    responsavel: 'Marcos Vinicius Ramos',
    prioridade: 'media',
    status: 'resolvida',
    dataCriacao: '2026-11-01',
    dataPrevisao: '2026-11-03',
    acaoCorretiva: 'Instaladas 6 luminárias LED 50W IP65 com alimentação protegida por DR 30mA.',
  },
  {
    id: 'pend_06',
    titulo: 'Padronizar identificação anilhada com termo-retrátil nos bornes de controle',
    tipo: 'melhoria',
    projetoId: 'prj_03',
    projetoNome: 'Automação & Painéis da Linha de Envase 04',
    descricao: 'Adotar impressora de termo-retrátil para as anilhas de comando, facilitando a rastreabilidade do comissionamento.',
    responsavel: 'Diego Barcellos',
    prioridade: 'baixa',
    status: 'em_validacao',
    dataCriacao: '2026-11-04',
    dataPrevisao: '2026-11-15',
    acaoCorretiva: 'Aquisição de cartuchos de fita termoencolhível branca 4.8mm.',
  },
];

// Helper para gerar um SVG codificado como Data URL
const createDocumentDataUrl = (title: string, subtitle: string, accentColor: string, bodyText: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1130" viewBox="0 0 800 1130">
    <rect width="100%" height="100%" fill="#0d1424"/>
    <rect x="20" y="20" width="760" height="1090" rx="8" fill="#131b2e" stroke="${accentColor}" stroke-width="2"/>
    <rect x="40" y="40" width="720" height="90" rx="6" fill="#0b101c"/>
    <text x="60" y="80" fill="${accentColor}" font-family="monospace" font-size="20" font-weight="bold">TESLA ENGENHARIA E AUTOMAÇÃO</text>
    <text x="60" y="105" fill="#94a3b8" font-family="sans-serif" font-size="13">SISTEMA DE GESTÃO OPERACIONAL DE SEGURANÇA E INFRAESTRUTURA</text>
    <rect x="40" y="150" width="720" height="40" rx="4" fill="${accentColor}22"/>
    <text x="60" y="176" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold">${title.toUpperCase()}</text>
    <text x="60" y="220" fill="#cbd5e1" font-family="sans-serif" font-size="14">${subtitle}</text>
    <line x1="40" y1="240" x2="760" y2="240" stroke="#334155" stroke-width="1"/>
    <rect x="40" y="260" width="720" height="320" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="60" y="295" fill="${accentColor}" font-family="monospace" font-size="14">/// PARÂMETROS E REQUISITOS OBRIGATÓRIOS</text>
    <text x="60" y="335" fill="#e2e8f0" font-family="sans-serif" font-size="14">1. Desenergização comprovada e teste de ausência de tensão.</text>
    <text x="60" y="370" fill="#e2e8f0" font-family="sans-serif" font-size="14">2. Bloqueio e Etiquetagem (LOTO) com cadeado mestre e individual.</text>
    <text x="60" y="405" fill="#e2e8f0" font-family="sans-serif" font-size="14">3. Aterramento temporário trifásico instalado em ambos os lados.</text>
    <text x="60" y="440" fill="#e2e8f0" font-family="sans-serif" font-size="14">4. EPIs Obrigatórios: Capacete Classe B, Luvas 20kV, Vestimenta Risco 4.</text>
    <text x="60" y="475" fill="#e2e8f0" font-family="sans-serif" font-size="14">5. Equipe autorizada: Eletricistas qualificados e TST residente.</text>
    <text x="60" y="530" fill="#94a3b8" font-family="sans-serif" font-size="13">Observações de Campo: ${bodyText}</text>
    <rect x="40" y="600" width="345" height="150" rx="6" fill="#0b101c" stroke="#334155"/>
    <text x="60" y="635" fill="#64748b" font-family="sans-serif" font-size="12">EMISSÃO & APROVAÇÃO TÉCNICA</text>
    <text x="60" y="665" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">Eng. André Luiz Nogueira</text>
    <text x="60" y="690" fill="#94a3b8" font-family="monospace" font-size="12">CREA/SP: 506.912-D | TST: 004812/SP</text>
    <text x="60" y="725" fill="#10b981" font-family="sans-serif" font-size="12">✓ ASSINADO DIGITALMENTE</text>
    <rect x="415" y="600" width="345" height="150" rx="6" fill="#0b101c" stroke="#334155"/>
    <text x="435" y="635" fill="#64748b" font-family="sans-serif" font-size="12">RESPONSÁVEL PELA EXECUÇÃO</text>
    <text x="435" y="665" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold">Carlos Eduardo Silva</text>
    <text x="435" y="690" fill="#94a3b8" font-family="monospace" font-size="12">Encarregado Geral - Tesla Engenharia</text>
    <text x="435" y="725" fill="#38bdf8" font-family="sans-serif" font-size="12">✓ CIENTE DOS RISCOS & BLOQUEIOS</text>
    <rect x="40" y="780" width="720" height="280" rx="6" fill="#090d16" stroke="#1e293b"/>
    <text x="60" y="815" fill="${accentColor}" font-family="monospace" font-size="13">/// REGISTRO OPERACIONAL</text>
    <text x="60" y="850" fill="#64748b" font-family="monospace" font-size="12">DOC ID: DOC-TESLA-2026-VAL-991</text>
    <text x="60" y="875" fill="#64748b" font-family="monospace" font-size="12">VALIDADE OPERACIONAL: 24 HORAS OU ATÉ ALTERAÇÃO DE TURNO</text>
    <text x="60" y="900" fill="#64748b" font-family="monospace" font-size="12">SISTEMA: TESLA ENGENHARIA & AUTOMAÇÃO</text>
    <rect x="60" y="940" width="680" height="80" rx="4" fill="#0f172a" stroke="#334155"/>
    <text x="80" y="975" fill="#f59e0b" font-family="sans-serif" font-size="13" font-weight="bold">ATENÇÃO: Em caso de chuva ou trovoada em trabalhos externos, interrompa de imediato.</text>
    <text x="80" y="1000" fill="#94a3b8" font-family="sans-serif" font-size="12">Qualquer alteração na equipe requer revalidação formal desta PT/APR.</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createFieldPhotoDataUrl = (title: string, tag: string, color: string, subtitle?: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="100%" height="100%" fill="#0a0f1d"/>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="760" height="560" rx="8" fill="url(#grad1)" stroke="#334155" stroke-width="2"/>
    <circle cx="400" cy="250" r="130" fill="#1e293b" stroke="${color}" stroke-width="3" stroke-dasharray="8 6"/>
    <path d="M 330 230 L 400 300 L 470 200" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="40" y="440" width="720" height="110" rx="6" fill="#090d16ee"/>
    <text x="60" y="480" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">${title}</text>
    <text x="60" y="510" fill="${color}" font-family="monospace" font-size="13">${tag.toUpperCase()} // REGISTRO FOTOGRÁFICO DE CANTEIRO</text>
    <text x="60" y="535" fill="#94a3b8" font-family="sans-serif" font-size="11">${subtitle || 'Tesla Engenharia & Automação · Inspeção Técnica'}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const initialAnexos: AnexoDocumento[] = [
  {
    id: 'anx_01',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    categoria: 'pt',
    titulo: 'PT-042/2026 - Permissão de Trabalho em Média Tensão 13.8kV',
    nomeArquivo: 'PT-042-2026-Subestacao-Votoran.svg',
    tipoMime: 'image/svg+xml',
    tamanhoBytes: 48200,
    dataUpload: '2026-11-01T08:30:00Z',
    dadosBase64: createDocumentDataUrl('Permissão de Trabalho nº 042/2026', 'Intervenção no Cubículo de Entrada da Subestação 13.8kV', '#38bdf8', 'Desenergização efetuada às 07h00. Teste de ausência de tensão realizado com detector por aproximação.'),
    observacoes: 'PT assinada pelo cliente e pelo TST André Luiz. Válida para todo o turno diurno.',
  },
  {
    id: 'anx_02',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    categoria: 'apr',
    titulo: 'APR-118/2026 - Análise Preliminar de Risco de Arco Elétrico e Choque',
    nomeArquivo: 'APR-118-2026-Risco-Arco-Eletrico.svg',
    tipoMime: 'image/svg+xml',
    tamanhoBytes: 52100,
    dataUpload: '2026-11-01T08:45:00Z',
    dadosBase64: createDocumentDataUrl('Análise Preliminar de Risco nº 118/2026', 'Operações em Painéis CCM e Cubículos SF6', '#f59e0b', 'Identificação de perigos: indução eletrostática, queda de barramentos pesados e arco voltaico.'),
    observacoes: 'Matriz de risco aprovada com medidas de mitigação e bloqueio coletivo LOTO.',
  },
  {
    id: 'anx_03',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    categoria: 'foto',
    titulo: 'Montagem dos Novos Barramentos de Cobre 50x10mm',
    nomeArquivo: 'Foto-Barramentos-Subestacao.svg',
    tipoMime: 'image/svg+xml',
    tamanhoBytes: 31200,
    dataUpload: '2026-11-04T16:15:00Z',
    dadosBase64: createFieldPhotoDataUrl('MONTAGEM DOS BARRAMENTOS 13.8kV', 'Subestação Betim - Cubículo 02', '#38bdf8', 'Aperto calibrado com torquímetro e aplicação de pasta de contato condutiva.'),
    observacoes: 'Verificação de torque nos parafusos bimetálicos com torquímetro certificado.',
  },
  {
    id: 'anx_04',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    categoria: 'foto',
    titulo: 'Inspeção Final dos Cubículos Compactos SF6',
    nomeArquivo: 'Foto-Cubiculo-SF6-Instalado.svg',
    tipoMime: 'image/svg+xml',
    tamanhoBytes: 34100,
    dataUpload: '2026-11-05T10:00:00Z',
    dadosBase64: createFieldPhotoDataUrl('INSTALAÇÃO DOS CUBÍCULOS SF6', 'Painel MT 17.5kV', '#10b981', 'Alinhamento mecânico concluído e intertravamentos de segurança testados.'),
    observacoes: 'Equipamento pronto para conexão dos terminais desconectáveis 15kV.',
  },
  {
    id: 'anx_05',
    projetoId: 'prj_02',
    projetoNome: 'Infraestrutura Elétrica & Leitos - Novo Hub Logístico',
    categoria: 'foto',
    titulo: 'Fixação de Suportes e Leitos Tipo Escada 400x100mm',
    nomeArquivo: 'Foto-Leitos-Galpao-Logistico.svg',
    tipoMime: 'image/svg+xml',
    tamanhoBytes: 32500,
    dataUpload: '2026-11-03T14:30:00Z',
    dadosBase64: createFieldPhotoDataUrl('LANÇAMENTO DE LEITOS METÁLICOS', 'Eixo 12 ao 18 - Galpão Principal', '#f59e0b', 'Montagem em altura utilizando plataformas elevatórias elétricas tipo tesoura.'),
    observacoes: 'Vistoriado pelo TST André Luiz com 100% de conformidade de ancoragem.',
  },
  {
    id: 'anx_06',
    projetoId: 'prj_02',
    projetoNome: 'Infraestrutura Elétrica & Leitos - Novo Hub Logístico',
    categoria: 'documento',
    titulo: 'Diagrama Unifilar & Rota dos Leitos de Cabos - Revisão 04',
    nomeArquivo: 'Unifilar-Rota-Leitos-Rev04.svg',
    tipoMime: 'image/svg+xml',
    tamanhoBytes: 44300,
    dataUpload: '2026-11-02T11:20:00Z',
    dadosBase64: createDocumentDataUrl('Diagrama Unifilar e Rota de Eletrocalhas', 'Projeto Executivo de Infraestrutura Elétrica', '#10b981', 'Detalhamento dos circuitos alimentadores de força dos quadros QDL-01 até QDL-08.'),
    observacoes: 'Aprovado pela engenharia do cliente para instalação dos suportes metálicos.',
  },
];

export const initialDdsList: RegistroDDS[] = [
  {
    id: 'dds_01',
    data: '2026-11-05',
    assunto: 'Regras de Ouro da NR-10: Desenergização, Bloqueio LOTO e Teste de Ausência de Tensão',
    tipo: 'diario',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    ministrante: 'André Luiz Nogueira (TST)',
    participantesQtd: 6,
    observacoes: 'DDS matinal obrigatório antes da intervenção nos cubículos de média tensão. Todos os colaboradores assinaram a lista de presença física.',
    criadoEm: '2026-11-05T07:15:00Z',
  },
  {
    id: 'dds_02',
    data: '2026-11-04',
    assunto: 'Inspeção Pré-Uso de Cinto Paraquedista e Trava-Quedas em Plataformas Elevatórias (PTA)',
    tipo: 'ocorrencia',
    projetoId: 'prj_02',
    projetoNome: 'Infraestrutura Elétrica & Leitos - Novo Hub Logístico',
    ministrante: 'André Luiz Nogueira (TST)',
    participantesQtd: 8,
    descricaoOcorrencia: 'Identificado trava-quedas com recolhimento lento durante a inspeção matinal. Equipamento foi segregado e o DDS abordou a checagem detalhada das costuras e mosquetões.',
    observacoes: 'Reciclagem prática realizada na base da plataforma antes de subir para o telhado.',
    criadoEm: '2026-11-04T07:30:00Z',
  },
  {
    id: 'dds_03',
    data: '2026-11-03',
    assunto: 'Ergonomia e Coordenação no Lançamento de Cabos Pesados 185mm²',
    tipo: 'diario',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    ministrante: 'Carlos Eduardo Silva (Encarregado Geral)',
    participantesQtd: 7,
    observacoes: 'Orientação sobre rotação de postos de trabalho e comando sonoro único durante a puxada na esteira de roletes.',
    criadoEm: '2026-11-03T07:20:00Z',
  },
  {
    id: 'dds_04',
    data: '2026-11-02',
    assunto: 'Uso Estrito de Ferramentas Isoladas 1000V (VDE) em Painéis CCM',
    tipo: 'ocorrencia',
    projetoId: 'prj_03',
    projetoNome: 'Automação & Painéis da Linha de Envase 04',
    ministrante: 'André Luiz Nogueira (TST)',
    participantesQtd: 5,
    descricaoOcorrencia: 'Quase-acidente registrado ao identificar ferramenta sem isolamento dielétrico dentro da caixa de ferramentas de auxiliar.',
    observacoes: 'Vistoriadas 100% das maletas e recolhidas duas chaves com isolação desgastada para descarte.',
    criadoEm: '2026-11-02T07:45:00Z',
  },
  {
    id: 'dds_05',
    data: '2026-11-01',
    assunto: 'Comunicação e Rádio em Manobras Elétricas Coordenadas',
    tipo: 'diario',
    projetoId: 'prj_01',
    projetoNome: 'Retrofit Geral da Subestação 13.8kV',
    ministrante: 'Marcos Vinicius Ramos',
    participantesQtd: 5,
    observacoes: 'Padronização da fraseologia: comando, repetição e confirmação antes de qualquer manobra de seccionadora.',
    criadoEm: '2026-11-01T07:10:00Z',
  },
];

export const initialUsuarios: Usuario[] = [
  {
    id: 'usr_admin',
    nome: 'Administrador Geral',
    username: 'admin',
    email: 'admin@tesla-engenharia.com.br',
    senha: 'admin',
    cargo: 'Gestor de TI & Operações',
    nivel: 'admin',
    permissoes: {
      criarProjetos: true,
      editarProjetos: true,
      excluirProjetos: true,
      gerenciarEquipes: true,
      gerenciarSegurancaDDS: true,
      aprovarPT: true,
      gerenciarUsuarios: true,
      acessarBackup: true,
    },
    ativo: true,
    criadoEm: '2026-01-10T08:00:00Z',
    ultimoAcesso: new Date().toISOString(),
  },
  {
    id: 'usr_carlos',
    nome: 'Eng. Carlos Eduardo Rocha',
    username: 'carlos.eng',
    email: 'carlos.rocha@tesla-engenharia.com.br',
    senha: 'admin',
    cargo: 'Engenheiro Eletricista Coordenador',
    nivel: 'engenheiro',
    permissoes: {
      criarProjetos: true,
      editarProjetos: true,
      excluirProjetos: false,
      gerenciarEquipes: true,
      gerenciarSegurancaDDS: true,
      aprovarPT: true,
      gerenciarUsuarios: false,
      acessarBackup: false,
    },
    ativo: true,
    criadoEm: '2026-01-15T09:30:00Z',
    ultimoAcesso: '2026-11-04T14:20:00Z',
  },
  {
    id: 'usr_marcia',
    nome: 'Márcia Valente',
    username: 'marcia.seg',
    email: 'marcia.seguranca@tesla-engenharia.com.br',
    senha: 'admin',
    cargo: 'Técnica de Segurança do Trabalho (TST)',
    nivel: 'tecnico',
    permissoes: {
      criarProjetos: false,
      editarProjetos: false,
      excluirProjetos: false,
      gerenciarEquipes: false,
      gerenciarSegurancaDDS: true,
      aprovarPT: true,
      gerenciarUsuarios: false,
      acessarBackup: false,
    },
    ativo: true,
    criadoEm: '2026-02-01T10:00:00Z',
    ultimoAcesso: '2026-11-05T10:15:00Z',
  },
  {
    id: 'usr_fiscal',
    nome: 'Roberto Mendes',
    username: 'fiscal',
    email: 'fiscal.contrato@votoran.com.br',
    senha: 'admin',
    cargo: 'Fiscal de Contrato (Contratante)',
    nivel: 'visualizador',
    permissoes: {
      criarProjetos: false,
      editarProjetos: false,
      excluirProjetos: false,
      gerenciarEquipes: false,
      gerenciarSegurancaDDS: false,
      aprovarPT: false,
      gerenciarUsuarios: false,
      acessarBackup: false,
    },
    ativo: true,
    criadoEm: '2026-03-01T11:00:00Z',
    ultimoAcesso: '2026-11-03T16:45:00Z',
  },
];

