import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DiaSemana } from '../types';
import { DIAS_SEMANA_MAP, getDiaSemanaHoje, getStatusColorClasses, formatDateBr } from '../utils/formatters';
import { 
  Activity, 
  Users, 
  FileCheck2, 
  AlertTriangle, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Plus, 
  FolderKanban,
  FileText,
  Printer,
  ChevronRight,
  HardHat
} from 'lucide-react';

interface WarroomOverviewProps {
  onOpenNewProject: () => void;
  onOpenNewEmployee: () => void;
  onSelectProject: (id: string) => void;
}

export const WarroomOverview: React.FC<WarroomOverviewProps> = ({
  onOpenNewProject,
  onOpenNewEmployee,
  onSelectProject,
}) => {
  const { 
    projetos, 
    funcionarios, 
    anexos, 
    statusList, 
    getStatusById, 
    getFuncionarioAlocacao, 
    getFuncionariosByProjeto,
    setProjetoParaImpressao
  } = useApp();

  const [diaSelecionado, setDiaSelecionado] = useState<DiaSemana>(getDiaSemanaHoje());

  // Cálculos do Warroom
  const projetosAtivos = projetos.filter((p) => {
    const st = getStatusById(p.statusId);
    return !st || !st.isTerminal;
  });

  const projetosConcluidos = projetos.filter((p) => {
    const st = getStatusById(p.statusId);
    return st && st.isTerminal;
  });

  const funcionariosAlocadosCount = funcionarios.filter((f) => {
    return getFuncionarioAlocacao(f.id).isAlocado;
  }).length;

  const funcionariosDisponiveisCount = funcionarios.length - funcionariosAlocadosCount;

  // Projetos do dia selecionado
  const projetosDoDia = projetosAtivos.filter((p) => p.diasSemana.includes(diaSelecionado));

  // Todos os funcionários atuando no dia selecionado
  const membrosNoDiaIds = new Set<string>();
  projetosDoDia.forEach((p) => {
    p.membrosIds.forEach((id) => membrosNoDiaIds.add(id));
  });

  // PTs e APRs
  const totalPts = anexos.filter((a) => a.categoria === 'pt').length;
  const totalAprs = anexos.filter((a) => a.categoria === 'apr').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Tático Warroom */}
      <div className="relative rounded-xl bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 border border-slate-800 p-5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full warroom-radar pointer-events-none opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-blue-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>PAINEL GERAL DE ENGENHARIA & OPERAÇÕES</span>
              <span>·</span>
              <span>BASE: LOCAL & ARQUIVOS</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Monitoramento de Canteiros & Equipes Elétricas
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Alocação restrita de colaboradores com trava anti-conflito, validação de PTs e controle de etapas de infraestrutura industrial.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewEmployee}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              + Colaborador
            </button>
            <button
              onClick={onOpenNewProject}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/40 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              + Abrir Nova Obra
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip (Tabular Numerals & High Density) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Ativos */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Obras em Andamento</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-slate-100 font-mono tabular-nums">
              {projetosAtivos.length}
            </span>
            <span className="text-xs text-slate-500">
              de {projetos.length} cadastradas
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>✓ {projetosConcluidos.length} concluídas</span>
          </div>
        </div>

        {/* Em Campo Hoje */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Eletricistas no Dia</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-cyan-300 font-mono tabular-nums">
              {membrosNoDiaIds.size}
            </span>
            <span className="text-xs text-slate-500">
              em {projetosDoDia.length} canteiros
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Escala ativa para o dia
          </div>
        </div>

        {/* Disponibilidade para Novas Equipes */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Disponíveis p/ Alocação</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono tabular-nums">
              {funcionariosDisponiveisCount}
            </span>
            <span className="text-xs text-slate-500">
              livres para novas obras
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            {funcionariosAlocadosCount} alocados (bloqueados)
          </div>
        </div>

        {/* PT & APR */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>PTs & APRs Emitidas</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-amber-300 font-mono tabular-nums">
              {totalPts + totalAprs}
            </span>
            <span className="text-xs text-slate-500">
              anexadas
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>{totalPts} PTs</span>
            <span>·</span>
            <span>{totalAprs} APRs</span>
          </div>
        </div>

        {/* Total Anexos */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Documentos & Fotos</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-purple-300 font-mono tabular-nums">
              {anexos.length}
            </span>
            <span className="text-xs text-slate-500">
              disponíveis p/ download
            </span>
          </div>
          <div className="mt-2 text-[11px] text-purple-400 font-mono">
            100% IndexedDB local
          </div>
        </div>
      </div>

      {/* Radar de Escala Semanal de Equipes (Date picker / Seletor de Dias) */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Escala de Operação da Semana
            </h2>
            <p className="text-xs text-slate-400">
              Selecione o dia da semana para auditar os canteiros ativos e a distribuição de eletricistas
            </p>
          </div>

          {/* Seletor Segmentado de Dias da Semana */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg overflow-x-auto max-w-full">
            {DIAS_SEMANA_MAP.map((dia) => {
              const isSelected = diaSelecionado === dia.id;
              const countNoDia = projetosAtivos.filter((p) => p.diasSemana.includes(dia.id)).length;
              return (
                <button
                  key={dia.id}
                  onClick={() => setDiaSelecionado(dia.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{dia.abrev}</span>
                  {countNoDia > 0 && (
                    <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {countNoDia}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projetos em atividade no dia selecionado */}
        {projetosDoDia.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-slate-800 bg-slate-950/40">
            <p className="text-sm text-slate-400">
              Nenhuma equipe escalada para atuar em {DIAS_SEMANA_MAP.find((d) => d.id === diaSelecionado)?.label.toLowerCase()}.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Ao cadastrar ou editar um projeto, marque os dias da semana para preencher esta escala.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projetosDoDia.map((prj) => {
              const status = getStatusById(prj.statusId);
              const colorClasses = getStatusColorClasses(status?.cor || 'slate');
              const equipe = getFuncionariosByProjeto(prj.id);
              const totalEtapas = prj.etapas.length;
              const etapasConcluidas = prj.etapas.filter((e) => e.status === 'concluida').length;
              const pctEtapas = totalEtapas > 0 ? Math.round((etapasConcluidas / totalEtapas) * 100) : 0;

              return (
                <div
                  key={prj.id}
                  className="rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    {/* Cabeçalho do Card */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-400">{prj.codigo}</span>
                      <div className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1.5 ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot}`} />
                        <span>{status?.nome || 'Em Andamento'}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 mt-2 line-clamp-1">
                      {prj.nome}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{prj.cliente} · {prj.local}</span>
                    </p>

                    {/* Barra de Progresso das Etapas */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                        <span>Planejamento ({etapasConcluidas}/{totalEtapas} etapas)</span>
                        <span>{pctEtapas}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${pctEtapas}%` }}
                        />
                      </div>
                    </div>

                    {/* Equipe Escalada (com Especialidade em Destaque) */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Equipe Alocada ({equipe.length})</span>
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {equipe.map((membro) => (
                          <div
                            key={membro.id}
                            className="flex items-center justify-between text-xs py-1 px-1.5 rounded bg-slate-900/80 border border-slate-800/50"
                          >
                            <div className="truncate mr-2">
                              <span className="font-medium text-slate-200 block truncate">{membro.nome}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{membro.funcao}</span>
                            </div>
                            <div className="text-[10px] font-mono text-blue-300 bg-blue-950/60 border border-blue-900/40 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
                              ★ {membro.especialidade}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas do Card */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setProjetoParaImpressao(prj)}
                      className="p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      title="Imprimir Ordem de Serviço / Ficha de Campo"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectProject(prj.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 text-xs font-medium text-blue-400 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/40 rounded transition-colors"
                    >
                      <span>Gerenciar Obra</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Inferior: Alertas de Segurança & Status do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Painel de Conformidade de Segurança (PT & APR) */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Auditoria de Segurança Operacional (NR-10 & NR-35)
            </h2>
            <span className="text-xs font-mono text-slate-400">Status em Tempo Real</span>
          </div>
          <p className="text-xs text-slate-400">
            Regra tática: Nenhuma atividade energizada ou em altura é iniciada sem emissão e anexação de PT/APR assinada.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300">Aguardando Validação de PT</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {projetos.filter((p) => p.statusId === 'status_aguardando_pt').length} projeto(s)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Requer emissão de Permissão de Trabalho formal pelo Técnico de Segurança (TST) antes do envio da equipe.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300">Aguardando APR de Campo</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {projetos.filter((p) => p.statusId === 'status_aguardando_apr').length} projeto(s)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Análise Preliminar de Risco para identificação de arco elétrico, trabalho a quente ou espaço confinado.
              </p>
            </div>
          </div>
        </div>

        {/* Resumo de Especialidades do Quadro Técnico */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-blue-400" />
              Matriz de Especialidades
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ponto forte / Perícia dos técnicos cadastrados na Tesla
            </p>

            <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {funcionarios.slice(0, 5).map((f) => {
                const aloc = getFuncionarioAlocacao(f.id);
                return (
                  <div
                    key={f.id}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-slate-950/60 border border-slate-800/60"
                  >
                    <div className="truncate mr-2">
                      <span className="text-slate-200 font-medium">{f.nome}</span>
                      <span className="text-[10px] text-slate-400 block">{f.funcao}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-blue-300 font-mono font-medium block">
                        {f.especialidade}
                      </span>
                      <span className={`text-[9px] font-mono ${aloc.isAlocado ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {aloc.isAlocado ? 'Em Canteiro' : 'Livre'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              // Navegar para a aba de equipes
              const btn = document.querySelector('button[data-tab="equipes"]');
              if (btn) (btn as HTMLButtonElement).click();
            }}
            className="w-full mt-2 py-1.5 text-xs text-center text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800 rounded transition-colors"
          >
            Ver Quadro Completo ({funcionarios.length} colaboradores)
          </button>
        </div>
      </div>
    </div>
  );
};
