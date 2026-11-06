import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Funcionario } from '../types';
import { 
  HardHat, 
  Search, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Phone, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

interface TeamViewProps {
  onOpenNewEmployee: () => void;
  onEditEmployee: (employee: Funcionario) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  onOpenNewEmployee,
  onEditEmployee,
}) => {
  const { funcionarios, getFuncionarioAlocacao, excluirFuncionario } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisponibilidade, setFilterDisponibilidade] = useState<'all' | 'disponivel' | 'alocado'>('all');
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<Funcionario | null>(null);

  // Filtragem
  const filteredFuncionarios = useMemo(() => {
    return funcionarios.filter((f) => {
      const alocacao = getFuncionarioAlocacao(f.id);

      const matchSearch =
        searchTerm === '' ||
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cpf.includes(searchTerm) ||
        f.especialidade.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDisponibilidade =
        filterDisponibilidade === 'all' ||
        (filterDisponibilidade === 'disponivel' && !alocacao.isAlocado) ||
        (filterDisponibilidade === 'alocado' && alocacao.isAlocado);

      return matchSearch && matchDisponibilidade;
    });
  }, [funcionarios, searchTerm, filterDisponibilidade, getFuncionarioAlocacao]);

  const handleConfirmDelete = async () => {
    if (funcionarioParaExcluir) {
      await excluirFuncionario(funcionarioParaExcluir.id);
      setFuncionarioParaExcluir(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Controles e Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        {/* Campo de Busca */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por colaborador, função, CPF ou especialidade..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filtro de Disponibilidade */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFilterDisponibilidade('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterDisponibilidade === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({funcionarios.length})
            </button>
            <button
              onClick={() => setFilterDisponibilidade('disponivel')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterDisponibilidade === 'disponivel'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Disponíveis
            </button>
            <button
              onClick={() => setFilterDisponibilidade('alocado')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterDisponibilidade === 'alocado'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Em Canteiro
            </button>
          </div>

          <button
            onClick={onOpenNewEmployee}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/40 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Colaborador</span>
          </button>
        </div>
      </div>

      {/* Grid de Membros */}
      {filteredFuncionarios.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <HardHat className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Nenhum colaborador encontrado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm || filterDisponibilidade !== 'all'
              ? 'Tente remover os filtros ou pesquisar com outro termo.'
              : 'Cadastre eletricistas e técnicos para montar suas equipes de canteiro.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFuncionarios.map((f) => {
            const alocacao = getFuncionarioAlocacao(f.id);

            return (
              <div
                key={f.id}
                className="rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{f.nome}</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{f.funcao}</p>
                    </div>

                    {/* Tag Perk traduzida: Especialidade */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-950/80 border border-blue-900/60 text-blue-300 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>{f.especialidade}</span>
                    </div>
                  </div>

                  {/* Informações: CPF, Idade, Contato */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CPF:</span>
                      <span className="text-slate-300">{f.cpf}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">IDADE:</span>
                      <span className="text-slate-300">{f.idade} anos</span>
                    </div>
                    {f.telefone && (
                      <div className="col-span-2 flex items-center gap-1.5 text-slate-400 pt-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{f.telefone}</span>
                      </div>
                    )}
                  </div>

                  {/* Certificações */}
                  {f.certificacoes && f.certificacoes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {f.certificacoes.map((cert) => (
                        <span
                          key={cert}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status de Alocação e Trava */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="truncate">
                    {alocacao.isAlocado ? (
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate" title={`Alocado em ${alocacao.projetoNome}`}>
                          Em canteiro: {alocacao.projetoCodigo}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Livre para alocação</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditEmployee(f)}
                      className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                      title="Editar Colaborador"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFuncionarioParaExcluir(f)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Excluir Colaborador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {funcionarioParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Excluir Colaborador</h3>
            <p className="text-xs md:text-sm text-slate-400">
              Tem certeza que deseja excluir{' '}
              <strong className="text-slate-200">{funcionarioParaExcluir.nome}</strong>? Ele será removido do quadro técnico e de quaisquer equipes atribuídas.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setFuncionarioParaExcluir(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
