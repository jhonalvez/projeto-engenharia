import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PendenciaMelhoria, 
  TipoPendencia, 
  PrioridadePendencia, 
  StatusPendencia, 
  RegistroDDS, 
  TipoDDS 
} from '../types';
import { formatDateBr } from '../utils/formatters';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Wrench, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  X, 
  MessageSquare, 
  AlertTriangle, 
  Users, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const SegurancaQualidadeView: React.FC = () => {
  const { 
    pendencias, 
    ddsList, 
    projetos, 
    salvarPendencia, 
    excluirPendencia, 
    atualizarStatusPendencia,
    salvarDds,
    excluirDds
  } = useApp();

  // Sub-aba: 'dds' ou 'pendencias'
  const [subTab, setSubTab] = useState<'dds' | 'pendencias'>('dds');

  // Filtros DDS
  const [ddsSearchTerm, setDdsSearchTerm] = useState('');
  const [ddsFilterTipo, setDdsFilterTipo] = useState<string>('all');
  const [ddsFilterProjeto, setDdsFilterProjeto] = useState<string>('all');

  // Filtros Pendências
  const [pendSearchTerm, setPendSearchTerm] = useState('');
  const [pendFilterTipo, setPendFilterTipo] = useState<string>('all');
  const [pendFilterStatus, setPendFilterStatus] = useState<string>('all');
  const [pendFilterProjeto, setPendFilterProjeto] = useState<string>('all');

  // Modal DDS State
  const [isDdsModalOpen, setIsDdsModalOpen] = useState(false);
  const [editingDds, setEditingDds] = useState<RegistroDDS | null>(null);
  const [ddsData, setDdsData] = useState('');
  const [ddsAssunto, setDdsAssunto] = useState('');
  const [ddsTipo, setDdsTipo] = useState<TipoDDS>('diario');
  const [ddsProjetoId, setDdsProjetoId] = useState<string>(projetos[0]?.id || '');
  const [ddsMinistrante, setDdsMinistrante] = useState('');
  const [ddsParticipantesQtd, setDdsParticipantesQtd] = useState(5);
  const [ddsDescricaoOcorrencia, setDdsDescricaoOcorrencia] = useState('');
  const [ddsObservacoes, setDdsObservacoes] = useState('');

  // Modal Pendências State
  const [isPendModalOpen, setIsPendModalOpen] = useState(false);
  const [editingPend, setEditingPend] = useState<PendenciaMelhoria | null>(null);
  const [pendTitulo, setPendTitulo] = useState('');
  const [pendTipo, setPendTipo] = useState<TipoPendencia>('inspecao_seguranca');
  const [pendProjetoId, setPendProjetoId] = useState<string>(projetos[0]?.id || '');
  const [pendDescricao, setPendDescricao] = useState('');
  const [pendResponsavel, setPendResponsavel] = useState('');
  const [pendPrioridade, setPendPrioridade] = useState<PrioridadePendencia>('alta');
  const [pendStatus, setPendStatus] = useState<StatusPendencia>('aberta');
  const [pendDataPrevisao, setPendDataPrevisao] = useState('');
  const [pendAcaoCorretiva, setPendAcaoCorretiva] = useState('');

  // Métricas de DDS
  const totalDds = ddsList.length;
  const ddsDiarios = ddsList.filter((d) => d.tipo === 'diario').length;
  const ddsOcorrencias = ddsList.filter((d) => d.tipo === 'ocorrencia').length;
  const totalParticipantes = ddsList.reduce((acc, cur) => acc + (cur.participantesQtd || 0), 0);

  // Filtragem de DDS
  const filteredDds = useMemo(() => {
    return ddsList.filter((d) => {
      const matchSearch =
        ddsSearchTerm === '' ||
        d.assunto.toLowerCase().includes(ddsSearchTerm.toLowerCase()) ||
        d.ministrante.toLowerCase().includes(ddsSearchTerm.toLowerCase()) ||
        (d.projetoNome && d.projetoNome.toLowerCase().includes(ddsSearchTerm.toLowerCase())) ||
        (d.descricaoOcorrencia && d.descricaoOcorrencia.toLowerCase().includes(ddsSearchTerm.toLowerCase()));

      const matchTipo = ddsFilterTipo === 'all' || d.tipo === ddsFilterTipo;
      const matchPrj = ddsFilterProjeto === 'all' || d.projetoId === ddsFilterProjeto;

      return matchSearch && matchTipo && matchPrj;
    });
  }, [ddsList, ddsSearchTerm, ddsFilterTipo, ddsFilterProjeto]);

  // Filtragem de Pendências
  const filteredPendencias = useMemo(() => {
    return pendencias.filter((item) => {
      const matchSearch =
        pendSearchTerm === '' ||
        item.titulo.toLowerCase().includes(pendSearchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(pendSearchTerm.toLowerCase()) ||
        item.responsavel.toLowerCase().includes(pendSearchTerm.toLowerCase()) ||
        (item.projetoNome && item.projetoNome.toLowerCase().includes(pendSearchTerm.toLowerCase()));

      const matchTipo = pendFilterTipo === 'all' || item.tipo === pendFilterTipo;
      const matchStatus = pendFilterStatus === 'all' || item.status === pendFilterStatus;
      const matchPrj = pendFilterProjeto === 'all' || item.projetoId === pendFilterProjeto;

      return matchSearch && matchTipo && matchStatus && matchPrj;
    });
  }, [pendencias, pendSearchTerm, pendFilterTipo, pendFilterStatus, pendFilterProjeto]);

  // Handlers DDS
  const handleOpenNewDds = () => {
    setEditingDds(null);
    setDdsData(new Date().toISOString().split('T')[0]);
    setDdsAssunto('');
    setDdsTipo('diario');
    setDdsProjetoId(projetos[0]?.id || '');
    setDdsMinistrante('André Luiz Nogueira (TST)');
    setDdsParticipantesQtd(6);
    setDdsDescricaoOcorrencia('');
    setDdsObservacoes('');
    setIsDdsModalOpen(true);
  };

  const handleEditDds = (item: RegistroDDS) => {
    setEditingDds(item);
    setDdsData(item.data);
    setDdsAssunto(item.assunto);
    setDdsTipo(item.tipo);
    setDdsProjetoId(item.projetoId || '');
    setDdsMinistrante(item.ministrante);
    setDdsParticipantesQtd(item.participantesQtd);
    setDdsDescricaoOcorrencia(item.descricaoOcorrencia || '');
    setDdsObservacoes(item.observacoes || '');
    setIsDdsModalOpen(true);
  };

  const handleSaveDds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ddsAssunto.trim()) {
      alert('Informe o assunto do DDS.');
      return;
    }

    const prj = projetos.find((p) => p.id === ddsProjetoId);

    const payload: RegistroDDS = {
      id: editingDds ? editingDds.id : `dds_${Date.now()}`,
      data: ddsData || new Date().toISOString().split('T')[0],
      assunto: ddsAssunto.trim(),
      tipo: ddsTipo,
      projetoId: ddsProjetoId || undefined,
      projetoNome: prj ? prj.nome : undefined,
      ministrante: ddsMinistrante.trim() || 'Técnico de Segurança',
      participantesQtd: Number(ddsParticipantesQtd) || 1,
      descricaoOcorrencia: ddsTipo === 'ocorrencia' ? ddsDescricaoOcorrencia.trim() : undefined,
      observacoes: ddsObservacoes.trim(),
      criadoEm: editingDds ? editingDds.criadoEm : new Date().toISOString(),
    };

    await salvarDds(payload);
    setIsDdsModalOpen(false);
  };

  // Handlers Pendências
  const handleOpenNewPend = () => {
    setEditingPend(null);
    setPendTitulo('');
    setPendTipo('inspecao_seguranca');
    setPendProjetoId(projetos[0]?.id || '');
    setPendDescricao('');
    setPendResponsavel('');
    setPendPrioridade('alta');
    setPendStatus('aberta');
    const daquiSeteDias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setPendDataPrevisao(daquiSeteDias);
    setPendAcaoCorretiva('');
    setIsPendModalOpen(true);
  };

  const handleEditPend = (item: PendenciaMelhoria) => {
    setEditingPend(item);
    setPendTitulo(item.titulo);
    setPendTipo(item.tipo);
    setPendProjetoId(item.projetoId || '');
    setPendDescricao(item.descricao);
    setPendResponsavel(item.responsavel);
    setPendPrioridade(item.prioridade);
    setPendStatus(item.status);
    setPendDataPrevisao(item.dataPrevisao || '');
    setPendAcaoCorretiva(item.acaoCorretiva || '');
    setIsPendModalOpen(true);
  };

  const handleSavePend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendTitulo.trim()) {
      alert('Informe o título do apontamento.');
      return;
    }

    const prj = projetos.find((p) => p.id === pendProjetoId);

    const payload: PendenciaMelhoria = {
      id: editingPend ? editingPend.id : `pend_${Date.now()}`,
      titulo: pendTitulo.trim(),
      tipo: pendTipo,
      projetoId: pendProjetoId || undefined,
      projetoNome: prj ? prj.nome : undefined,
      descricao: pendDescricao.trim(),
      responsavel: pendResponsavel.trim() || 'Equipe de Engenharia',
      prioridade: pendPrioridade,
      status: pendStatus,
      dataCriacao: editingPend ? editingPend.dataCriacao : new Date().toISOString().split('T')[0],
      dataPrevisao: pendDataPrevisao || undefined,
      acaoCorretiva: pendAcaoCorretiva.trim(),
    };

    await salvarPendencia(payload);
    setIsPendModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner de Navegação Interna: Segurança & Qualidade */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SISTEMA DE GESTÃO DE SEGURANÇA E QUALIDADE</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-100">
            Segurança do Trabalho & Qualidade Operacional
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Histórico formal de Diálogos de Segurança (DDS), pendências de inspeção e melhorias de canteiro
          </p>
        </div>

        {/* Switcher de Sub-Abas */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setSubTab('dds')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              subTab === 'dds'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Histórico de DDS ({ddsList.length})</span>
          </button>
          <button
            onClick={() => setSubTab('pendencias')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              subTab === 'pendencias'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Pendências & Melhorias ({pendencias.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-ABA 1: HISTÓRICO DE DDS (DIÁLOGO DE SEGURANÇA) */}
      {subTab === 'dds' && (
        <div className="space-y-5">
          {/* Métricas de DDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">TOTAL DE DDS REALIZADOS</span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                {totalDds}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">Registros assinados</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">DDS DE ROTINA DIÁRIA</span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
                {ddsDiarios}
              </span>
              <span className="text-[11px] text-blue-400/80 mt-1">Alinhamento de turno</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">POR OCORRÊNCIA / QUASE-ACIDENTE</span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
                {ddsOcorrencias}
              </span>
              <span className="text-[11px] text-amber-400/80 mt-1">Ações corretivas imediatas</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-mono">TÉCNICOS CAPACITADOS</span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                {totalParticipantes}
              </span>
              <span className="text-[11px] text-emerald-400/80 mt-1">Presenças computadas</span>
            </div>
          </div>

          {/* Barra de Filtros e Novo DDS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ddsSearchTerm}
                onChange={(e) => setDdsSearchTerm(e.target.value)}
                placeholder="Buscar por assunto, ministrante, ocorrência ou obra..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={ddsFilterTipo}
                onChange={(e) => setDdsFilterTipo(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos os Tipos ({ddsList.length})</option>
                <option value="diario">Rotina Diária</option>
                <option value="ocorrencia">Por Ocorrência de Segurança</option>
              </select>

              <select
                value={ddsFilterProjeto}
                onChange={(e) => setDdsFilterProjeto(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 max-w-[160px] truncate"
              >
                <option value="all">Todas as Obras</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} - {p.nome}
                  </option>
                ))}
              </select>

              <button
                onClick={handleOpenNewDds}
                className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/40 transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar DDS</span>
              </button>
            </div>
          </div>

          {/* TABELA DE HISTÓRICO DE DDS (Conforme Solicitado pelo Usuário) */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-xs">
                    <th className="py-3 px-4 whitespace-nowrap">DATA</th>
                    <th className="py-3 px-4">ASSUNTO ABORDADO</th>
                    <th className="py-3 px-4 whitespace-nowrap">TIPO DO DDS</th>
                    <th className="py-3 px-4">OBRA / CANTEIRO</th>
                    <th className="py-3 px-4">MINISTRANTE</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">PARTICIPANTES</th>
                    <th className="py-3 px-4 text-right">AÇÕES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {filteredDds.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Nenhum registro de DDS encontrado no histórico.
                      </td>
                    </tr>
                  ) : (
                    filteredDds.map((dds) => {
                      const isOcorrencia = dds.tipo === 'ocorrencia';

                      return (
                        <tr key={dds.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono whitespace-nowrap font-semibold text-slate-200">
                            {formatDateBr(dds.data)}
                          </td>
                          <td className="py-3 px-4 max-w-sm">
                            <span className="font-semibold text-slate-100 block">
                              {dds.assunto}
                            </span>
                            {isOcorrencia && dds.descricaoOcorrencia && (
                              <span className="text-[11px] text-amber-400/90 block mt-0.5 line-clamp-1 italic">
                                Ocorrência: {dds.descricaoOcorrencia}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {isOcorrencia ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                <span>Por Ocorrência</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/15 border border-blue-500/30 text-blue-300">
                                <Clock className="w-3 h-3 text-blue-400" />
                                <span>Diário / Rotina</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {dds.projetoNome || 'Treinamento Geral'}
                          </td>
                          <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                            {dds.ministrante}
                          </td>
                          <td className="py-3 px-4 text-center font-mono whitespace-nowrap text-slate-200 font-semibold">
                            {dds.participantesQtd} colaboradores
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditDds(dds)}
                                className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                                title="Editar DDS"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Excluir este registro de DDS?')) {
                                    excluirDds(dds.id);
                                  }
                                }}
                                className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Excluir DDS"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 2: PENDÊNCIAS & MELHORIAS */}
      {subTab === 'pendencias' && (
        <div className="space-y-5">
          {/* Controles de Pendências */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pendSearchTerm}
                onChange={(e) => setPendSearchTerm(e.target.value)}
                placeholder="Buscar por pendência, responsável ou canteiro..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <select
                value={pendFilterTipo}
                onChange={(e) => setPendFilterTipo(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos os Tipos ({pendencias.length})</option>
                <option value="inspecao_seguranca">Inspeção de Segurança</option>
                <option value="problema_atual">Problemas Atuais</option>
                <option value="melhoria">Melhorias a Implementar</option>
              </select>

              <select
                value={pendFilterStatus}
                onChange={(e) => setPendFilterStatus(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="aberta">Abertas</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="em_validacao">Em Validação</option>
                <option value="resolvida">Resolvidas</option>
              </select>

              <select
                value={pendFilterProjeto}
                onChange={(e) => setPendFilterProjeto(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 max-w-[160px] truncate"
              >
                <option value="all">Todas as Obras</option>
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} - {p.nome}
                  </option>
                ))}
              </select>

              <button
                onClick={handleOpenNewPend}
                className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/40 transition-colors whitespace-nowrap shrink-0 ml-1"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Pendência</span>
              </button>
            </div>
          </div>

          {/* Lista de Cards de Pendências */}
          <div className="space-y-3">
            {filteredPendencias.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded border ${
                        item.tipo === 'inspecao_seguranca'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : item.tipo === 'problema_atual'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {item.tipo === 'inspecao_seguranca' ? 'Inspeção de Segurança' : item.tipo === 'problema_atual' ? 'Problema Atual' : 'Melhoria a Implementar'}
                    </span>

                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                      Prioridade: {item.prioridade}
                    </span>

                    {item.projetoNome && (
                      <span className="text-xs text-slate-400">
                        · Obra: <strong className="text-slate-300">{item.projetoNome}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-slate-100">{item.titulo}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.descricao}</p>

                  {item.acaoCorretiva && (
                    <div className="text-xs text-emerald-400/90 bg-slate-950/60 p-2 rounded border border-slate-800/60 flex items-start gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Ação Corretiva:</strong> {item.acaoCorretiva}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                    <span>Responsável: <strong className="text-slate-400">{item.responsavel}</strong></span>
                    <span>Registro: {formatDateBr(item.dataCriacao)}</span>
                    {item.dataPrevisao && <span>Prazo: {formatDateBr(item.dataPrevisao)}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) => atualizarStatusPendencia(item.id, e.target.value as StatusPendencia)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border bg-slate-950 border-slate-800 text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="aberta">Aberta</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="em_validacao">Em Validação</option>
                    <option value="resolvida">✓ Resolvida</option>
                  </select>

                  <button
                    onClick={() => handleEditPend(item)}
                    className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Excluir este apontamento?')) excluirPendencia(item.id);
                    }}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO DE DDS */}
      {isDdsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full my-auto shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>{editingDds ? 'Editar Registro de DDS' : 'Registrar Novo Diálogo de Segurança (DDS)'}</span>
              </h3>
              <button
                onClick={() => setIsDdsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDds} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    DATA DO DDS *
                  </label>
                  <input
                    type="date"
                    value={ddsData}
                    onChange={(e) => setDdsData(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    TIPO DO DIÁLOGO *
                  </label>
                  <select
                    value={ddsTipo}
                    onChange={(e) => setDdsTipo(e.target.value as TipoDDS)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="diario">Rotina Diária (Início de Turno)</option>
                    <option value="ocorrencia">Motivado por Ocorrência de Segurança</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ASSUNTO PRINCIPAL ABORDADO *
                </label>
                <input
                  type="text"
                  value={ddsAssunto}
                  onChange={(e) => setDdsAssunto(e.target.value)}
                  required
                  placeholder="Ex: NR-10: Teste de ausência de tensão e aterramento temporário..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Campo condicional para ocorrência */}
              {ddsTipo === 'ocorrencia' && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <label className="block text-xs font-semibold text-amber-300">
                    DESCRIÇÃO DA OCORRÊNCIA MOTIVADORA *
                  </label>
                  <textarea
                    value={ddsDescricaoOcorrencia}
                    onChange={(e) => setDdsDescricaoOcorrencia(e.target.value)}
                    rows={2}
                    required={ddsTipo === 'ocorrencia'}
                    placeholder="Descreva o quase-acidente, desvio ou situação que gerou o DDS extraordinário..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    OBRA / CANTEIRO
                  </label>
                  <select
                    value={ddsProjetoId}
                    onChange={(e) => setDdsProjetoId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Geral (Treinamento da Empresa)</option>
                    {projetos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} - {p.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nº PARTICIPANTES
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={ddsParticipantesQtd}
                    onChange={(e) => setDdsParticipantesQtd(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  MINISTRANTE (RESPONSÁVEL PELA CONDUÇÃO) *
                </label>
                <input
                  type="text"
                  value={ddsMinistrante}
                  onChange={(e) => setDdsMinistrante(e.target.value)}
                  required
                  placeholder="Ex: André Luiz Nogueira (TST) ou Carlos Eduardo (Encarregado)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  OBSERVAÇÕES ADICIONAIS / REGISTRO
                </label>
                <textarea
                  value={ddsObservacoes}
                  onChange={(e) => setDdsObservacoes(e.target.value)}
                  rows={2}
                  placeholder="Lista de presença arquivada no canteiro, dúvidas levantadas pela equipe..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDdsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  {editingDds ? 'Salvar Alterações' : 'Registrar no Histórico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO DE PENDÊNCIAS */}
      {isPendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full my-auto shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <span>{editingPend ? 'Editar Apontamento' : 'Novo Registro de Segurança / Qualidade'}</span>
              </h3>
              <button
                onClick={() => setIsPendModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePend} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    TIPO DE REGISTRO *
                  </label>
                  <select
                    value={pendTipo}
                    onChange={(e) => setPendTipo(e.target.value as TipoPendencia)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="inspecao_seguranca">Inspeção de Segurança (NR-10 / NR-35)</option>
                    <option value="problema_atual">Problema Atual de Campo / Obra</option>
                    <option value="melhoria">Melhoria a Implementar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    OBRA VINCULADA
                  </label>
                  <select
                    value={pendProjetoId}
                    onChange={(e) => setPendProjetoId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
                  value={pendTitulo}
                  onChange={(e) => setPendTitulo(e.target.value)}
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
                  value={pendDescricao}
                  onChange={(e) => setPendDescricao(e.target.value)}
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
                  value={pendAcaoCorretiva}
                  onChange={(e) => setPendAcaoCorretiva(e.target.value)}
                  placeholder="Ex: Instalação de conjunto de aterramento reserva certificado..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">RESPONSÁVEL</label>
                  <input
                    type="text"
                    value={pendResponsavel}
                    onChange={(e) => setPendResponsavel(e.target.value)}
                    placeholder="Ex: André Luiz (TST)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PRIORIDADE</label>
                  <select
                    value={pendPrioridade}
                    onChange={(e) => setPendPrioridade(e.target.value as PrioridadePendencia)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica (Imediata)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">STATUS</label>
                  <select
                    value={pendStatus}
                    onChange={(e) => setPendStatus(e.target.value as StatusPendencia)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="aberta">Aberta</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="em_validacao">Em Validação</option>
                    <option value="resolvida">Resolvida</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PRAZO</label>
                  <input
                    type="date"
                    value={pendDataPrevisao}
                    onChange={(e) => setPendDataPrevisao(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPendModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  {editingPend ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
