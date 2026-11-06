import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Solicitante } from '../types';
import { 
  Building2, 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Search, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

interface SolicitantesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolicitantesModal: React.FC<SolicitantesModalProps> = ({ isOpen, onClose }) => {
  const { solicitantes, salvarSolicitante, excluirSolicitante, projetos } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [contatoResponsavel, setContatoResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleEdit = (sol: Solicitante) => {
    setEditingId(sol.id);
    setNome(sol.nome);
    setContatoResponsavel(sol.contatoResponsavel);
    setEmail(sol.email);
    setTelefone(sol.telefone);
    setCnpj(sol.cnpj);
    setLocalidade(sol.localidade);
    setErrorMsg('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setNome('');
    setContatoResponsavel('');
    setEmail('');
    setTelefone('');
    setCnpj('');
    setLocalidade('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nome.trim()) {
      setErrorMsg('Informe o nome da empresa ou contratante solicitante.');
      return;
    }

    const payload: Solicitante = {
      id: editingId || `sol_${Date.now()}`,
      nome: nome.trim(),
      contatoResponsavel: contatoResponsavel.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      cnpj: cnpj.trim(),
      localidade: localidade.trim(),
      criadoEm: editingId
        ? (solicitantes.find((s) => s.id === editingId)?.criadoEm || new Date().toISOString())
        : new Date().toISOString().split('T')[0],
    };

    await salvarSolicitante(payload);
    setSuccessMsg(editingId ? 'Solicitante atualizado com sucesso!' : 'Novo solicitante cadastrado!');
    handleCancel();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = async (id: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    const res = await excluirSolicitante(id);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao excluir solicitante.');
    } else {
      setSuccessMsg('Solicitante excluído com sucesso.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const filteredSolicitantes = solicitantes.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contatoResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.localidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cnpj.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-900/60 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Cadastro de Solicitantes & Clientes
              </h2>
              <p className="text-xs text-slate-400">
                Gerencie empresas contratantes, responsáveis técnicos e unidades fabris
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagens de Sucesso ou Erro */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulário de Adição/Edição */}
        <form onSubmit={handleSubmit} className="p-6 border-b border-slate-800 bg-slate-950/40 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            {editingId ? 'Editar Solicitante' : 'Cadastrar Novo Solicitante / Cliente'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                EMPRESA / CONTRATANTE SOLICITANTE *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: Indústrias Metalúrgicas Votoran S/A"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                CONTATO / RESPONSÁVEL TÉCNICO
              </label>
              <input
                type="text"
                value={contatoResponsavel}
                onChange={(e) => setContatoResponsavel(e.target.value)}
                placeholder="Ex: Eng. Marcos Pontes (Gerente)"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engenharia@cliente.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                TELEFONE / WHATSAPP
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                CNPJ / DOCUMENTO
              </label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                CANTEIRO / CIDADE
              </label>
              <input
                type="text"
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
                placeholder="Betim / MG"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingId ? 'Atualizar Solicitante' : 'Salvar Solicitante'}</span>
            </button>
          </div>
        </form>

        {/* Lista de Solicitantes Cadastrados */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Solicitantes Registrados ({solicitantes.length})
            </h4>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar solicitante..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredSolicitantes.map((sol) => {
              const obrasVinculadas = projetos.filter(
                (p) => p.solicitanteId === sol.id || p.cliente === sol.nome
              );

              return (
                <div
                  key={sol.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{sol.nome}</span>
                      {sol.cnpj && (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          CNPJ: {sol.cnpj}
                        </span>
                      )}
                    </div>

                    <div className="text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                      {sol.contatoResponsavel && (
                        <span>Contato: <strong className="text-slate-300">{sol.contatoResponsavel}</strong></span>
                      )}
                      {sol.telefone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {sol.telefone}
                        </span>
                      )}
                      {sol.localidade && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {sol.localidade}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-blue-400 mt-1">
                      {obrasVinculadas.length} obra(s) vinculada(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(sol)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                      title="Editar Solicitante"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sol.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Excluir Solicitante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
