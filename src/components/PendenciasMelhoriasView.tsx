import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PendenciaMelhoria, TipoPendencia, PrioridadePendencia, StatusPendencia } from '../types';
import { formatDateBr } from '../utils/formatters';
import { 
  AlertCircle, 
  ShieldAlert, 
  Wrench, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PendenciasMelhoriasView: React.FC = () => {
  const { 
    pendencias, 
    projetos, 
    salvarPendencia, 
    excluirPendencia, 
    atualizarStatusPendencia 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProjetoId, setFilterProjetoId] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PendenciaMelhoria | null>(null);

  // Form Fields
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoPendencia>('inspecao_seguranca');
  const [projetoId, setProjetoId] = useState<string>(projetos[0]?.id || '');
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [prioridade, setPrioridade] = useState<PrioridadePendencia>('alta');
  const [status, setStatus] = useState<StatusPendencia>('aberta');
  const [dataPrevisao, setDataPrevisao] = useState('');
  const [acaoCorretiva, setAcaoCorretiva] = useState('');

  // Contadores
  const segurancaCount = pendencias.filter((p) => p.tipo === 'inspecao_seguranca' && p.status !== 'resolvida').length;
  const problemasCount = pendencias.filter((p) => p.tipo === 'problema_atual' && p.status !== 'resolvida').length;
  const melhoriasResolvidasCount = pendencias.filter((p) => p.tipo === 'melhoria' && p.status === 'resolvida').length;

  const filteredItems = useMemo(() => {
    return pendencias.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.projetoNome && item.projetoNome.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTipo = filterTipo === 'all' || item.tipo === filterTipo;
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchPrj = filterProjetoId === 'all' || item.projetoId === filterProjetoId;

      return matchSearch && matchTipo && matchStatus && matchPrj;
    });
  }, [pendencias, searchTerm, filterTipo, filterStatus, filterProjetoId]);

  const handleOpenNew = () => {
    setEditingItem(null);
    setTitulo('');
    setTipo('inspecao_seguranca');
    setProjetoId(projetos[0]?.id || '');
    setDescricao('');
    setResponsavel('');
    setPrioridade('alta');
    setStatus('aberta');
    const daquiSeteDias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDataPrevisao(daquiSeteDias);
    setAcaoCorretiva('');
    setIsModalOpen(true);
  };

  const handleEdit = (item: PendenciaMelhoria) => {
    setEditingItem(item);
    setTitulo(item.titulo);
    setTipo(item.tipo);
    setProjetoId(item.projetoId || '');
    setDescricao(item.descricao);
    setResponsavel(item.responsavel);
    setPrioridade(item.prioridade);
    setStatus(item.status);
    setDataPrevisao(item.dataPrevisao || '');
    setAcaoCorretiva(item.acaoCorretiva || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert('Informe o título do item.');
      return;
    }

    const prj = projetos.find((p) => p.id === projetoId);

    const payload: PendenciaMelhoria = {
      id: editingItem ? editingItem.id : `pend_${Date.now()}`,
      titulo: titulo.trim(),
      tipo,
      projetoId: projetoId || undefined,
      projetoNome: prj ? prj.nome : undefined,
      descricao: descricao.trim(),
      responsavel: responsavel.trim() || 'Equipe de Engenharia',
      prioridade,
      status,
      dataCriacao: editingItem ? editingItem.dataCriacao : new Date().toISOString().split('T')[0],
      dataPrevisao: dataPrevisao || undefined,
      acaoCorretiva: acaoCorretiva.trim(),
    };

    await salvarPendencia(payload);
    setIsModalOpen(false);
  };

  const getTipoBadge = (t: TipoPendencia) => {
    switch (t) {
      case 'inspecao_seguranca':
        return {
          label: 'Inspeção de Segurança',
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'problema_atual':
        return {
          label: 'Problema Atual',
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'melhoria':
        return {
          label: 'Melhoria a Implementar',
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
        };
    }
  };

  const getPrioridadeBadge = (p: PrioridadePendencia) => {
    switch (p) {
      case 'critica':
        return 'text-rose-400 font-bold';
      case 'alta':
        return 'text-amber-400 font-semibold';
      case 'media':
        return 'text-blue-400';
      case 'baixa':
        return 'text-slate-400';
    }
  };

  const getStatusBadge = (s: StatusPendencia) => {
    switch (s) {
      case 'aberta':
        return { text: 'Aberta', bg: 'bg-rose-950/60 text-rose-300 border-rose-800/60' };
      case 'em_andamento':
        return { text: 'Em Andamento', bg: 'bg-blue-950/60 text-blue-300 border-blue-800/60' };
      case 'em_validacao':
        return { text: 'Em Validação', bg: 'bg-amber-950/60 text-amber-300 border-amber-800/60' };
      case 'resolvida':
        return { text: '✓ Resolvida', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono block">INSPEÇÃO DE SEGURANÇA</span>
            <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
              {segurancaCount} pendente(s)
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">NR-10, NR-35 e bloqueios</span>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-900/50 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono block">PROBLEMAS ATUAIS</span>
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
              {problemasCount} em tratamento
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Interferências e atrasos</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-900/50 text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-mono block">MELHORIAS IMPLEMENTADAS</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {melhoriasResolvidasCount} concluídas
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Eficiência e padronização</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-900/50 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por apontamento, responsável, obra ou ação..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {/* Filtro Tipo */}
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos os Tipos ({pendencias.length})</option>
            <option value="inspecao_seguranca">Inspeção de Segurança</option>
            <option value="problema_atual">Problemas Atuais</option>
            <option value="melhoria">Melhorias a Implementar</option>
          </select>

          {/* Filtro Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="aberta">Abertas</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="em_validacao">Em Validação</option>
            <option value="resolvida">Resolvidas</option>
          </select>

          {/* Filtro Projeto */}
          <select
            value={filterProjetoId}
            onChange={(e) => setFilterProjetoId(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 max-w-[170px] truncate"
          >
            <option value="all">Todas as Obras</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.nome}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/40 transition-colors whitespace-nowrap shrink-0 ml-1"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Lista de Pendências e Melhorias */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Nenhum registro encontrado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || filterTipo !== 'all' || filterStatus !== 'all'
              ? 'Tente ajustar os filtros ou buscar por outro termo.'
              : 'Registre inspeções de segurança, problemas atuais de campo ou melhorias a implementar.'}
          </p>
          <button
            onClick={handleOpenNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Apontamento</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const badgeTipo = getTipoBadge(item.tipo);
            const badgeStatus = getStatusBadge(item.status);

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded border ${badgeTipo.bg}`}>
                      {badgeTipo.icon}
                      <span>{badgeTipo.label}</span>
                    </span>

                    <span className={`text-[11px] font-mono uppercase ${getPrioridadeBadge(item.prioridade)}`}>
                      Prioridade {item.prioridade}
                    </span>

                    {item.projetoNome && (
                      <span className="text-xs text-slate-400 font-medium">
                        · Obra: <strong className="text-slate-300">{item.projetoNome}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-100">
                    {item.titulo}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.descricao}
                  </p>

                  {item.acaoCorretiva && (
                    <div className="text-xs text-emerald-400/90 bg-slate-950/60 p-2 rounded border border-slate-800/60 flex items-start gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Ação Corretiva:</strong> {item.acaoCorretiva}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                    <span>Responsável: <strong className="text-slate-400">{item.responsavel}</strong></span>
                    <span>Registro: {formatDateBr(item.dataCriacao)}</span>
                    {item.dataPrevisao && (
                      <span>Prazo: {formatDateBr(item.dataPrevisao)}</span>
                    )}
                  </div>
                </div>

                {/* Status Switcher & Ações */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => atualizarStatusPendencia(item.id, e.target.value as StatusPendencia)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${badgeStatus.bg}`}
                  >
                    <option value="aberta" className="bg-slate-900 text-slate-200">Aberta</option>
                    <option value="em_andamento" className="bg-slate-900 text-slate-200">Em Andamento</option>
                    <option value="em_validacao" className="bg-slate-900 text-slate-200">Em Validação</option>
                    <option value="resolvida" className="bg-slate-900 text-slate-200">✓ Resolvida</option>
                  </select>

                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                    title="Editar Apontamento"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Excluir este apontamento?')) {
                        excluirPendencia(item.id);
                      }
                    }}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <span>{editingItem ? 'Editar Apontamento' : 'Novo Apontamento Operacional'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    TIPO DE REGISTRO *
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoPendencia)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="inspecao_seguranca">Inspeção de Segurança (NR-10 / NR-35)</option>
                    <option value="problema_atual">Problema Atual de Campo / Obra</option>
                    <option value="melhoria">Melhoria a Implementar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    OBRA / PROJETO VINCULADO
                  </label>
                  <select
                    value={projetoId}
                    onChange={(e) => setProjetoId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Geral (Sem obra específica)</option>
                    {projetos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} - {p.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  TÍTULO DO APONTAMENTO *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Ex: Adequar fixação do aterramento temporário antes da manobra..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  DESCRIÇÃO DETALHADA
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  placeholder="Descreva a condição observada, local exato, riscos identificados..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  PLANO DE AÇÃO / MEDIDA CORRETIVA
                </label>
                <input
                  type="text"
                  value={acaoCorretiva}
                  onChange={(e) => setAcaoCorretiva(e.target.value)}
                  placeholder="Ex: Instalação de conjunto de aterramento reserva certificado..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    RESPONSÁVEL
                  </label>
                  <input
                    type="text"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    placeholder="Ex: André Luiz (TST)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    PRIORIDADE
                  </label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as PrioridadePendencia)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica (Imediata)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    STATUS
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusPendencia)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="aberta">Aberta</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="em_validacao">Em Validação</option>
                    <option value="resolvida">Resolvida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    PRAZO / PREVISÃO
                  </label>
                  <input
                    type="date"
                    value={dataPrevisao}
                    onChange={(e) => setDataPrevisao(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
