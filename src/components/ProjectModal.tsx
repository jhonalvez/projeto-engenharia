import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Projeto, DiaSemana, EtapaPlanejamento, MaterialProjeto } from '../types';
import { DIAS_SEMANA_MAP } from '../utils/formatters';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  Package, 
  Lock,
  Sparkles,
  Building2
} from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Projeto | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { 
    funcionarios, 
    statusList, 
    solicitantes,
    salvarProjeto, 
    getFuncionarioAlocacao 
  } = useApp();

  const isEditing = !!projectToEdit;

  // Form State
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [solicitanteId, setSolicitanteId] = useState('');
  const [cliente, setCliente] = useState('');
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFimPrevista, setDataFimPrevista] = useState('');
  const [diasSemana, setDiasSemana] = useState<DiaSemana[]>(['seg', 'ter', 'qua', 'qui', 'sex']);
  const [statusId, setStatusId] = useState('');
  const [membrosIds, setMembrosIds] = useState<string[]>([]);
  const [etapas, setEtapas] = useState<EtapaPlanejamento[]>([]);
  const [materiais, setMateriais] = useState<MaterialProjeto[]>([]);

  // Sub-forms para novas etapas/materiais no modal
  const [novaEtapaTitulo, setNovaEtapaTitulo] = useState('');
  const [novoMaterialNome, setNovoMaterialNome] = useState('');
  const [novoMaterialQtd, setNovoMaterialQtd] = useState(1);
  const [novoMaterialUnidade, setNovoMaterialUnidade] = useState('un');

  const [activeTab, setActiveTab] = useState<'geral' | 'equipe' | 'etapas' | 'materiais'>('geral');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa os campos
  useEffect(() => {
    if (projectToEdit) {
      setCodigo(projectToEdit.codigo);
      setNome(projectToEdit.nome);
      setSolicitanteId(projectToEdit.solicitanteId || '');
      setCliente(projectToEdit.cliente);
      setLocal(projectToEdit.local);
      setDescricao(projectToEdit.descricao);
      setDataInicio(projectToEdit.dataInicio);
      setDataFimPrevista(projectToEdit.dataFimPrevista);
      setDiasSemana(projectToEdit.diasSemana || []);
      setStatusId(projectToEdit.statusId);
      setMembrosIds(projectToEdit.membrosIds || []);
      setEtapas(projectToEdit.etapas || []);
      setMateriais(projectToEdit.materiais || []);
    } else {
      // Default para novo projeto
      const randNum = Math.floor(100 + Math.random() * 900);
      setCodigo(`TESLA-2026-${randNum}`);
      setNome('');
      setSolicitanteId('');
      setCliente('');
      setLocal('');
      setDescricao('');
      const hoje = new Date().toISOString().split('T')[0];
      const daquiUmMes = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setDataInicio(hoje);
      setDataFimPrevista(daquiUmMes);
      setDiasSemana(['seg', 'ter', 'qua', 'qui', 'sex']);
      setStatusId(statusList[0]?.id || 'status_aguardando_apr');
      setMembrosIds([]);
      setEtapas([
        { id: `etp_${Date.now()}_1`, titulo: 'Análise Preliminar de Risco (APR) e Emissão da PT', status: 'em_andamento', ordem: 1 },
        { id: `etp_${Date.now()}_2`, titulo: 'Montagem de infraestrutura e leitos', status: 'pendente', ordem: 2 },
        { id: `etp_${Date.now()}_3`, titulo: 'Lançamento e conectorização de cabos', status: 'pendente', ordem: 3 },
      ]);
      setMateriais([]);
    }
    setErrorMsg('');
    setActiveTab('geral');
  }, [projectToEdit, isOpen, statusList]);

  if (!isOpen) return null;

  const handleSelectSolicitante = (id: string) => {
    setSolicitanteId(id);
    if (!id) return;
    const sol = solicitantes.find((s) => s.id === id);
    if (sol) {
      setCliente(sol.razaoSocial || sol.nome);
      if (sol.endereco) {
        setLocal(sol.endereco);
      }
    }
  };

  // Toggle de dia da semana
  const toggleDiaSemana = (dia: DiaSemana) => {
    setDiasSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const aplicarAtalhoDias = (tipo: 'diasUteis' | 'todos' | 'finalSemana') => {
    if (tipo === 'diasUteis') {
      setDiasSemana(['seg', 'ter', 'qua', 'qui', 'sex']);
    } else if (tipo === 'todos') {
      setDiasSemana(['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']);
    } else if (tipo === 'finalSemana') {
      setDiasSemana(['sab', 'dom']);
    }
  };

  // Toggle de membro da equipe com validação da trava anti-conflito
  const toggleMembro = (funcionarioId: string) => {
    const alocacao = getFuncionarioAlocacao(funcionarioId, projectToEdit?.id);

    // Se já está selecionado neste projeto, pode desmarcar livremente
    if (membrosIds.includes(funcionarioId)) {
      setMembrosIds((prev) => prev.filter((id) => id !== funcionarioId));
      setErrorMsg('');
      return;
    }

    // Se o funcionário estiver alocado em OUTRO projeto ativo (não concluído), BLOQUEIA!
    if (alocacao.isAlocado) {
      setErrorMsg(
        `Ação Bloqueada: Este colaborador já está em campo no projeto "${alocacao.projetoNome}". O sistema Tesla Engenharia não permite alocação simultânea até a conclusão da obra anterior.`
      );
      return;
    }

    // Caso contrário, adiciona à equipe
    setMembrosIds((prev) => [...prev, funcionarioId]);
    setErrorMsg('');
  };

  // Adicionar etapa no formulário
  const handleAddEtapa = () => {
    if (!novaEtapaTitulo.trim()) return;
    const nova: EtapaPlanejamento = {
      id: `etp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      titulo: novaEtapaTitulo.trim(),
      status: 'pendente',
      ordem: etapas.length + 1,
    };
    setEtapas((prev) => [...prev, nova]);
    setNovaEtapaTitulo('');
  };

  // Remover etapa no formulário
  const handleRemoveEtapa = (id: string) => {
    setEtapas((prev) => prev.filter((e) => e.id !== id));
  };

  // Adicionar material no formulário
  const handleAddMaterial = () => {
    if (!novoMaterialNome.trim()) return;
    const randCod = Math.floor(100 + Math.random() * 900);
    const novo: MaterialProjeto = {
      id: `mat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      codigo: `MAT-${randCod}`,
      nome: novoMaterialNome.trim(),
      qtdPrevista: Number(novoMaterialQtd) || 1,
      qtdInstalada: 0,
      unidade: novoMaterialUnidade,
      status: 'solicitado',
    };
    setMateriais((prev) => [...prev, novo]);
    setNovoMaterialNome('');
    setNovoMaterialQtd(1);
  };

  const handleRemoveMaterial = (id: string) => {
    setMateriais((prev) => prev.filter((m) => m.id !== id));
  };

  // Submissão do Formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nome.trim()) {
      setErrorMsg('Por favor, informe o nome do projeto.');
      setActiveTab('geral');
      return;
    }
    if (!cliente.trim()) {
      setErrorMsg('Por favor, informe o cliente da obra.');
      setActiveTab('geral');
      return;
    }
    if (diasSemana.length === 0) {
      setErrorMsg('Selecione ao menos um dia da semana para a atuação da equipe.');
      setActiveTab('geral');
      return;
    }

    setIsSubmitting(true);

    const payload: Projeto = {
      id: projectToEdit ? projectToEdit.id : `prj_${Date.now()}`,
      codigo: codigo.trim() || `TESLA-${Date.now()}`,
      nome: nome.trim(),
      solicitanteId: solicitanteId || undefined,
      cliente: cliente.trim(),
      local: local.trim() || 'Canteiro Industrial',
      descricao: descricao.trim(),
      dataInicio,
      dataFimPrevista,
      diasSemana,
      statusId,
      membrosIds,
      etapas,
      materiais,
      criadoEm: projectToEdit ? projectToEdit.criadoEm : new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    const res = await salvarProjeto(payload);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Erro ao salvar projeto.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="font-mono text-blue-400">{codigo}</span>
              <span>·</span>
              <span>{isEditing ? 'Editar Projeto & Equipe' : 'Cadastrar Nova Obra Elétrica'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Planejamento de cronograma, trava estrita de alocação de equipe e materiais
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas Internas do Modal */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('geral')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'geral'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Dados da Obra & Dias</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('equipe')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'equipe'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Montar Equipe ({membrosIds.length})</span>
            {membrosIds.length > 0 && (
              <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                OK
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('etapas')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'etapas'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Etapas ({etapas.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('materiais')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'materiais'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Materiais ({materiais.length})</span>
          </button>
        </div>

        {/* Mensagem de Erro / Alerta de Conflito de Alocação */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Conteúdo do Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'geral' && (
            <div className="space-y-4">
              {/* Linha 1: Código e Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                    CÓDIGO DO PROJETO *
                  </label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                    placeholder="Ex: TESLA-2026-042"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    STATUS OPERACIONAL *
                  </label>
                  <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {statusList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.nome} {st.isTerminal ? '(Conclusão - Libera Equipe)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Linha 2: Nome da Obra */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  NOME DO PROJETO / OBRA *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Ex: Retrofit de Painéis CCM e Barramentos 13.8kV"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Linha 2.5: Solicitante Cadastrado (Cliente) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    SOLICITANTE CADASTRADO (CLIENTE)
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Preenche cliente e local automaticamente</span>
                </label>
                <select
                  value={solicitanteId}
                  onChange={(e) => handleSelectSolicitante(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Selecione um Solicitante da base (ou preencha avulso abaixo) --</option>
                  {solicitantes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.razaoSocial || s.nome} · {s.documento ? `CNPJ/CPF: ${s.documento}` : s.contatoPrincipal}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linha 3: Cliente e Local */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    CLIENTE / CONTRATANTE *
                  </label>
                  <input
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    required
                    placeholder="Ex: Indústrias Metalúrgicas Votoran"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    CANTEIRO / LOCALIZAÇÃO *
                  </label>
                  <input
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    required
                    placeholder="Ex: Canteiro Betim / MG - Prédio da Subestação 02"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Linha 4: Date Pickers (Início e Fim Previsto) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    DATA DE INÍCIO *
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    DATA PREVISTA DE TÉRMINO *
                  </label>
                  <input
                    type="date"
                    value={dataFimPrevista}
                    onChange={(e) => setDataFimPrevista(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Linha 5: SELETOR DE DIAS DA SEMANA QUE A EQUIPE ESTARÁ NO PROJETO */}
              <div className="pt-2 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      DIAS DA SEMANA DE ATUAÇÃO DA EQUIPE *
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Defina em quais dias da semana a equipe técnica estará no canteiro da obra
                    </p>
                  </div>

                  {/* Atalhos Rápidos */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => aplicarAtalhoDias('diasUteis')}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      Seg a Sex
                    </button>
                    <button
                      type="button"
                      onClick={() => aplicarAtalhoDias('todos')}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => aplicarAtalhoDias('finalSemana')}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      Finais de Semana
                    </button>
                  </div>
                </div>

                {/* Botões dos 7 dias da semana */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {DIAS_SEMANA_MAP.map((dia) => {
                    const isSelected = diasSemana.includes(dia.id);
                    return (
                      <button
                        type="button"
                        key={dia.id}
                        onClick={() => toggleDiaSemana(dia.id)}
                        className={`py-2 px-1 rounded-lg text-xs font-mono font-semibold transition-all border text-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span className="block text-[11px] sm:text-xs">{dia.abrev}</span>
                        <span className="text-[9px] opacity-75 hidden sm:block">
                          {isSelected ? '✓ ATIVO' : 'FOLGA'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descrição e Escopo */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  DESCRIÇÃO & ESCOPO TÉCNICO
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={2}
                  placeholder="Detalhes dos requisitos de segurança, potência, barramentos e infraestrutura..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* ABA DE MONTAGEM DE EQUIPE COM TRAVA ANTI-CONFLITO */}
          {activeTab === 'equipe' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-blue-950/30 border border-blue-900/40">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-200">
                      Regra de Alocação Exclusiva Tesla Engenharia
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Funcionários em obras ativas não podem ser escalados até que o projeto atual seja marcado como Concluído.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono text-blue-300 whitespace-nowrap bg-blue-900/40 px-2.5 py-1 rounded">
                  {membrosIds.length} selecionado(s)
                </div>
              </div>

              {/* Lista de Funcionários com Indicador de Conflito */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {funcionarios.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Nenhum colaborador cadastrado no sistema.
                  </p>
                ) : (
                  funcionarios.map((f) => {
                    const isSelected = membrosIds.includes(f.id);
                    const alocacao = getFuncionarioAlocacao(f.id, projectToEdit?.id);
                    const isBloqueado = !isSelected && alocacao.isAlocado;

                    return (
                      <div
                        key={f.id}
                        onClick={() => {
                          if (!isBloqueado) toggleMembro(f.id);
                        }}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isBloqueado
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-950/40 border-blue-600/60 cursor-pointer shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${
                              isBloqueado
                                ? 'bg-slate-900 border-slate-800 text-slate-600'
                                : isSelected
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-slate-900 border-slate-700 text-transparent'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            {isBloqueado && <Lock className="w-3 h-3 text-slate-600" />}
                          </div>

                          {/* Dados do Funcionário */}
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs md:text-sm text-slate-100 truncate">
                                {f.nome}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {f.idade} anos
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{f.funcao}</span>
                              <span>·</span>
                              <span className="font-mono text-slate-500">{f.cpf}</span>
                            </div>
                          </div>
                        </div>

                        {/* Especialidade (Tag Perk) & Status de Alocação */}
                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-950/60 border border-blue-900/50 text-blue-300">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            <span>{f.especialidade}</span>
                          </div>

                          <div className="mt-1">
                            {isBloqueado ? (
                              <span className="text-[10px] font-mono text-amber-400 block max-w-[200px] truncate">
                                ⚠ Alocado em {alocacao.projetoCodigo}
                              </span>
                            ) : isSelected ? (
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                                ✓ Escalado nesta obra
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-emerald-400/80">
                                ● Disponível
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ABA DE ETAPAS DO PLANEJAMENTO */}
          {activeTab === 'etapas' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  value={novaEtapaTitulo}
                  onChange={(e) => setNovaEtapaTitulo(e.target.value)}
                  placeholder="Nova etapa do planejamento (ex: Teste de Hipot nos Cabos)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEtapa();
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddEtapa}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  + Etapa
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {etapas.map((etp, idx) => (
                  <div
                    key={etp.id}
                    className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-mono text-slate-500 w-5 text-right">{idx + 1}.</span>
                      <span className="text-slate-200 font-medium truncate">{etp.titulo}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={etp.status}
                        onChange={(e) => {
                          const val = e.target.value as EtapaPlanejamento['status'];
                          setEtapas((prev) =>
                            prev.map((item) => (item.id === etp.id ? { ...item, status: val } : item))
                          );
                        }}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                        <option value="bloqueada">Bloqueada</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveEtapa(etp.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA DE MATERIAIS */}
          {activeTab === 'materiais' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  value={novoMaterialNome}
                  onChange={(e) => setNovoMaterialNome(e.target.value)}
                  placeholder="Nome do material elétrico (ex: Disjuntor 250A)..."
                  className="sm:col-span-6 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  min="1"
                  value={novoMaterialQtd}
                  onChange={(e) => setNovoMaterialQtd(Number(e.target.value))}
                  placeholder="Qtd"
                  className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
                <select
                  value={novoMaterialUnidade}
                  onChange={(e) => setNovoMaterialUnidade(e.target.value)}
                  className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="un">un (peça)</option>
                  <option value="m">m (metros)</option>
                  <option value="barra">barras</option>
                  <option value="rolo">rolos</option>
                  <option value="cx">caixas</option>
                  <option value="kg">kg</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="sm:col-span-2 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  + Material
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {materiais.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Nenhum material cadastrado nesta obra ainda.
                  </p>
                ) : (
                  materiais.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-mono text-blue-400 mr-2">{mat.codigo}</span>
                        <span className="text-slate-200 font-medium">{mat.nome}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-slate-400">
                          {mat.qtdPrevista} {mat.unidade}
                        </span>

                        <select
                          value={mat.status}
                          onChange={(e) => {
                            const val = e.target.value as MaterialProjeto['status'];
                            setMateriais((prev) =>
                              prev.map((item) => (item.id === mat.id ? { ...item, status: val } : item))
                            );
                          }}
                          className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                        >
                          <option value="solicitado">Solicitado</option>
                          <option value="em_transito">Em Trânsito</option>
                          <option value="no_canteiro">No Canteiro</option>
                          <option value="instalado">Instalado</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(mat.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Rodapé do Modal */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Projeto' : 'Concluir Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
