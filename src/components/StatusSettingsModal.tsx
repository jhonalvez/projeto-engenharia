import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectStatus } from '../types';
import { getStatusColorClasses } from '../utils/formatters';
import { Sliders, Plus, Trash2, Edit3, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const StatusSettingsModal: React.FC = () => {
  const { statusList, salvarStatus, excluirStatus, projetos } = useApp();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState<ProjectStatus['cor']>('amber');
  const [isTerminal, setIsTerminal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const coresDisponiveis: { id: ProjectStatus['cor']; label: string }[] = [
    { id: 'amber', label: 'Âmbar (Atenção/Validação)' },
    { id: 'cyan', label: 'Ciano (Segurança/PT)' },
    { id: 'blue', label: 'Azul (Execução/Andamento)' },
    { id: 'emerald', label: 'Verde (Conclusão/Liberado)' },
    { id: 'purple', label: 'Roxo (Comissionamento)' },
    { id: 'rose', label: 'Vermelho (Bloqueado/Crítico)' },
    { id: 'slate', label: 'Cinza (Pausado/Espera)' },
  ];

  const handleEdit = (st: ProjectStatus) => {
    setEditingId(st.id);
    setNome(st.nome);
    setDescricao(st.descricao || '');
    setCor(st.cor);
    setIsTerminal(st.isTerminal);
    setErrorMsg('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setCor('amber');
    setIsTerminal(false);
    setErrorMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nome.trim()) {
      setErrorMsg('Informe o nome do status.');
      return;
    }

    const payload: ProjectStatus = {
      id: editingId || `status_${Date.now()}`,
      nome: nome.trim(),
      descricao: descricao.trim(),
      cor,
      isTerminal,
      ordem: editingId ? (statusList.find((s) => s.id === editingId)?.ordem || 1) : statusList.length + 1,
    };

    await salvarStatus(payload);
    handleCancelEdit();
  };

  const handleDelete = async (id: string) => {
    setErrorMsg('');
    const res = await excluirStatus(id);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao excluir status.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <span>Configuração e CRUD de Status do Sistema</span>
        </h2>
        <p className="text-xs text-slate-400">
          Personalize as etapas operacionais das obras de elétrica e infraestrutura da Tesla.
          Projetos marcados como <strong>Status de Conclusão</strong> liberam automaticamente os eletricistas para novas obras.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Formulário de Adicionar / Editar */}
      <form onSubmit={handleSave} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">
          {editingId ? 'Editar Status Operacional' : 'Cadastrar Novo Status'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              NOME DO STATUS *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Aguardando Medição da Concessionária..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              COR TÁTICA DO BADGE *
            </label>
            <select
              value={cor}
              onChange={(e) => setCor(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            >
              {coresDisponiveis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            DESCRIÇÃO OPERACIONAL
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Bloqueio físico por espera de documentação ou ART..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Flag Terminal (Conclusão) */}
        <label className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={isTerminal}
            onChange={(e) => setIsTerminal(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-900 border-slate-700"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-200">
              Marcar como Status de Conclusão / Terminal (Ex: "Concluído", "Obra Entregue")
            </span>
            <span className="block text-[11px] text-slate-400">
              Quando um projeto atinge este status, todos os técnicos da equipe são liberados e ficam disponíveis para novas obras.
            </span>
          </div>
        </label>

        <div className="flex items-center justify-end gap-2 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? 'Atualizar Status' : 'Salvar Status'}</span>
          </button>
        </div>
      </form>

      {/* Lista de Status Cadastrados */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-100">
          Status em Atividade no Sistema ({statusList.length})
        </h3>

        <div className="space-y-2">
          {statusList.map((st) => {
            const colorClasses = getStatusColorClasses(st.cor);
            const qtdProjetos = projetos.filter((p) => p.statusId === st.id).length;

            return (
              <div
                key={st.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 shrink-0 ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${colorClasses.dot}`} />
                    <span>{st.nome}</span>
                  </div>

                  <div className="truncate">
                    <span className="text-slate-300 font-medium block truncate">
                      {st.descricao || 'Sem descrição'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {qtdProjetos} obra(s) vinculada(s) {st.isTerminal && '· ✓ Libera Colaboradores'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(st)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                    title="Editar Status"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(st.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Excluir Status"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
