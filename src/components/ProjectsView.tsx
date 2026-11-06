import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Projeto } from '../types';
import { DIAS_SEMANA_MAP, getStatusColorClasses, formatDateBr } from '../utils/formatters';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  Package, 
  Printer, 
  Trash2, 
  Edit3, 
  Eye, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { SolicitantesModal } from './SolicitantesModal';

interface ProjectsViewProps {
  onOpenNewProject: () => void;
  onEditProject: (project: Projeto) => void;
  onSelectProject: (id: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onOpenNewProject,
  onEditProject,
  onSelectProject,
}) => {
  const { 
    projetos, 
    statusList, 
    getStatusById, 
    getFuncionariosByProjeto, 
    excluirProjeto, 
    setProjetoParaImpressao 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [projetoParaExcluir, setProjetoParaExcluir] = useState<Projeto | null>(null);
  const [isSolicitantesModalOpen, setIsSolicitantesModalOpen] = useState(false);

  // Filtragem dos projetos
  const filteredProjects = useMemo(() => {
    return projetos.filter((prj) => {
      const matchSearch =
        searchTerm === '' ||
        prj.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prj.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prj.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prj.local.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'all' || prj.statusId === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [projetos, searchTerm, selectedStatus]);

  const handleConfirmDelete = async () => {
    if (projetoParaExcluir) {
      await excluirProjeto(projetoParaExcluir.id);
      setProjetoParaExcluir(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de Controles e Filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        {/* Campo de Busca */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, projeto, cliente ou canteiro..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filtro de Status Customizáveis */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">Todos os Status ({projetos.length})</option>
            {statusList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.nome}
              </option>
            ))}
          </select>

          {/* Alternador Grid / Tabela */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Tabela"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Botão de Solicitantes / Clientes */}
          <button
            onClick={() => setIsSolicitantesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
            title="Gerenciar Solicitantes e Clientes"
          >
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Solicitantes</span>
          </button>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/40 transition-colors whitespace-nowrap shrink-0 ml-1"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Lista Vazia */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Nenhum projeto encontrado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || selectedStatus !== 'all'
              ? 'Tente ajustar os filtros ou o termo de busca para visualizar as obras.'
              : 'Cadastre sua primeira obra de elétrica ou infraestrutura para iniciar o gerenciamento.'}
          </p>
          <button
            onClick={onOpenNewProject}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Projeto Agora</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Visualização em Grade */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((prj) => {
            const status = getStatusById(prj.statusId);
            const colorClasses = getStatusColorClasses(status?.cor || 'slate');
            const equipe = getFuncionariosByProjeto(prj.id);
            const totalEtapas = prj.etapas.length;
            const etapasConcluidas = prj.etapas.filter((e) => e.status === 'concluida').length;
            const pct = totalEtapas > 0 ? Math.round((etapasConcluidas / totalEtapas) * 100) : 0;

            return (
              <div
                key={prj.id}
                className="rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  {/* Linha de Código e Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-900/50 px-2 py-0.5 rounded">
                      {prj.codigo}
                    </span>
                    <div
                      className={`px-2.5 py-0.5 rounded text-xs font-medium border flex items-center gap-1.5 ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot}`} />
                      <span>{status?.nome || 'Em Andamento'}</span>
                    </div>
                  </div>

                  {/* Nome e Cliente */}
                  <h3
                    onClick={() => onSelectProject(prj.id)}
                    className="text-base font-bold text-slate-100 hover:text-blue-400 cursor-pointer transition-colors mt-3 line-clamp-1"
                  >
                    {prj.nome}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{prj.cliente} · {prj.local}</span>
                  </div>

                  {/* Período & Dias da Semana de Atuação */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {formatDateBr(prj.dataInicio)} até {formatDateBr(prj.dataFimPrevista)}
                      </span>
                    </div>

                    {/* Seletor visual dos dias da semana em que a equipe atua */}
                    <div className="flex items-center gap-1 pt-1">
                      {DIAS_SEMANA_MAP.map((d) => {
                        const ativo = prj.diasSemana.includes(d.id);
                        return (
                          <span
                            key={d.id}
                            className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                              ativo
                                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                                : 'text-slate-600 bg-slate-950/40'
                            }`}
                            title={`${d.label}: ${ativo ? 'Equipe no canteiro' : 'Sem atividade'}`}
                          >
                            {d.abrev}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Barra de Etapas */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Etapas ({etapasConcluidas}/{totalEtapas})</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Membros da Equipe Alocados */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Equipe ({equipe.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {equipe.slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 truncate max-w-[150px]"
                          title={`${m.nome} (${m.funcao}) - Especialidade: ${m.especialidade}`}
                        >
                          {m.nome.split(' ')[0]} · <span className="text-blue-400">{m.especialidade}</span>
                        </span>
                      ))}
                      {equipe.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                          +{equipe.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rodapé de Ações */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setProjetoParaImpressao(prj)}
                      className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Imprimir Ordem de Serviço da Obra"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditProject(prj)}
                      className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                      title="Editar Informações e Equipe"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProjetoParaExcluir(prj)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Excluir Projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectProject(prj.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detalhes & Materiais</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização em Tabela Tática */
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs font-mono">
                  <th className="py-3 px-4">CÓDIGO</th>
                  <th className="py-3 px-4">PROJETO / CLIENTE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DIAS ESCALADOS</th>
                  <th className="py-3 px-4">EQUIPE</th>
                  <th className="py-3 px-4">ETAPAS</th>
                  <th className="py-3 px-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs md:text-sm">
                {filteredProjects.map((prj) => {
                  const status = getStatusById(prj.statusId);
                  const colorClasses = getStatusColorClasses(status?.cor || 'slate');
                  const equipe = getFuncionariosByProjeto(prj.id);
                  const totalEtapas = prj.etapas.length;
                  const concluidas = prj.etapas.filter((e) => e.status === 'concluida').length;

                  return (
                    <tr key={prj.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                        {prj.codigo}
                      </td>
                      <td className="py-3 px-4">
                        <div
                          onClick={() => onSelectProject(prj.id)}
                          className="font-semibold text-slate-100 hover:text-blue-400 cursor-pointer"
                        >
                          {prj.nome}
                        </div>
                        <div className="text-xs text-slate-400">
                          {prj.cliente} · {prj.local}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border inline-flex items-center gap-1.5 ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${colorClasses.dot}`} />
                          <span>{status?.nome || 'Em Andamento'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          {DIAS_SEMANA_MAP.map((d) => (
                            <span
                              key={d.id}
                              className={`px-1 py-0.5 rounded ${
                                prj.diasSemana.includes(d.id)
                                  ? 'bg-blue-600/30 text-blue-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              {d.abrev}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-200">
                          {equipe.length} colaborador(es)
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {equipe.map((e) => e.nome.split(' ')[0]).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-300">
                        {concluidas}/{totalEtapas}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setProjetoParaImpressao(prj)}
                            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            title="Imprimir Ordem de Serviço"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectProject(prj.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                            title="Ver Detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditProject(prj)}
                            className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                            title="Editar Projeto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProjetoParaExcluir(prj)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Excluir"
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
      )}

      {/* Modal de Confirmação de Exclusão */}
      {projetoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Confirmar Exclusão de Obra</h3>
            <p className="text-xs md:text-sm text-slate-400">
              Tem certeza que deseja excluir o projeto{' '}
              <strong className="text-slate-200">{projetoParaExcluir.nome}</strong> ({projetoParaExcluir.codigo})? Todos os materiais e etapas vinculados serão removidos, e a equipe será desvinculada.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProjetoParaExcluir(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Excluir Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Solicitantes / Clientes */}
      <SolicitantesModal
        isOpen={isSolicitantesModalOpen}
        onClose={() => setIsSolicitantesModalOpen(false)}
      />
    </div>
  );
};
