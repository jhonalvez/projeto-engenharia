import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Funcionario } from '../types';
import { formatCpf } from '../utils/formatters';
import { X, User, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Funcionario | null;
}

const SUGESTOES_FUNCOES = [
  'Eletricista Força e Controle',
  'Encarregado Geral de Elétrica',
  'Eletricista Montador',
  'Técnico de Automação & CLP',
  'Ajudante de Elétrica',
  'Técnico em Segurança (TST)',
  'Instrumentista Industrial',
  'Eletricista Bobinador',
  'Engenheiro Residente',
];

const SUGESTOES_ESPECIALIDADES = [
  'Subestações',
  'Painéis CCM',
  'Leitos & Eletrocalhas',
  'CLP & SCADA',
  'Alta Tensão',
  'Fibra Óptica',
  'NR-10 & NR-35',
  'Termografia',
  'Lançamento de Cabos',
  'Transformadores',
  'Aterramento & SPDA',
  'Inversores de Frequência',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { salvarFuncionario } = useApp();

  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('Eletricista Força e Controle');
  const [cpf, setCpf] = useState('');
  const [idade, setIdade] = useState(30);
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [certificacoesStr, setCertificacoesStr] = useState('NR-10, NR-35');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (employeeToEdit) {
      setNome(employeeToEdit.nome);
      setFuncao(employeeToEdit.funcao);
      setCpf(employeeToEdit.cpf);
      setIdade(employeeToEdit.idade);
      setEspecialidade(employeeToEdit.especialidade);
      setTelefone(employeeToEdit.telefone || '');
      setCertificacoesStr((employeeToEdit.certificacoes || []).join(', '));
    } else {
      setNome('');
      setFuncao('Eletricista Força e Controle');
      setCpf('');
      setIdade(32);
      setEspecialidade('Subestações');
      setTelefone('(11) 9');
      setCertificacoesStr('NR-10, NR-35');
    }
    setErrorMsg('');
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nome.trim()) {
      setErrorMsg('Informe o nome completo do colaborador.');
      return;
    }
    if (!funcao.trim()) {
      setErrorMsg('Informe a função.');
      return;
    }
    if (!cpf.trim() || cpf.length < 14) {
      setErrorMsg('Informe um CPF válido no formato 000.000.000-00.');
      return;
    }
    if (!especialidade.trim()) {
      setErrorMsg('Informe a Especialidade (Habilidade Principal / Ponto Forte).');
      return;
    }

    const certs = certificacoesStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: Funcionario = {
      id: employeeToEdit ? employeeToEdit.id : `func_${Date.now()}`,
      nome: nome.trim(),
      funcao: funcao.trim(),
      cpf: cpf.trim(),
      idade: Number(idade) || 18,
      especialidade: especialidade.trim(),
      telefone: telefone.trim(),
      certificacoes: certs,
      ativo: true,
      dataCadastro: employeeToEdit ? employeeToEdit.dataCadastro : new Date().toISOString().split('T')[0],
    };

    await salvarFuncionario(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full my-auto shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>{employeeToEdit ? 'Editar Colaborador' : 'Cadastrar Membro da Equipe'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              Quadro de profissionais elétricos e infraestrutura Tesla
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              NOME COMPLETO *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Ex: Carlos Eduardo Silva"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Função */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              FUNÇÃO OPERACIONAL *
            </label>
            <input
              type="text"
              list="funcoes-list"
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              required
              placeholder="Ex: Eletricista Força e Controle"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <datalist id="funcoes-list">
              {SUGESTOES_FUNCOES.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          {/* Linha CPF e Idade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                CPF *
              </label>
              <input
                type="text"
                value={cpf}
                maxLength={14}
                onChange={handleCpfChange}
                required
                placeholder="000.000.000-00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                IDADE (ANOS) *
              </label>
              <input
                type="number"
                min="18"
                max="80"
                value={idade}
                onChange={(e) => setIdade(Number(e.target.value))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* CAMPO DE TAG PERK TRADUZIDO: ESPECIALIDADE / PONTO FORTE */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                ESPECIALIDADE (Habilidade Principal / Ponto Forte) *
              </label>
            </div>
            <p className="text-[11px] text-slate-400">
              Campo de destaque técnico do colaborador para rápida escalação tática
            </p>
            <input
              type="text"
              list="especialidades-list"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              required
              placeholder="Ex: Subestações, Painéis CCM, Alta Tensão..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-blue-300 font-medium focus:outline-none focus:border-blue-500"
            />
            <datalist id="especialidades-list">
              {SUGESTOES_ESPECIALIDADES.map((esp) => (
                <option key={esp} value={esp} />
              ))}
            </datalist>

            {/* Sugestões em chips clicáveis */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGESTOES_ESPECIALIDADES.slice(0, 6).map((esp) => (
                <button
                  type="button"
                  key={esp}
                  onClick={() => setEspecialidade(esp)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono transition-colors border ${
                    especialidade === esp
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {esp}
                </button>
              ))}
            </div>
          </div>

          {/* Telefone e Certificações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                TELEFONE / WHATSAPP
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                CERTIFICAÇÕES (separadas por vírgula)
              </label>
              <input
                type="text"
                value={certificacoesStr}
                onChange={(e) => setCertificacoesStr(e.target.value)}
                placeholder="NR-10, NR-35, SEP"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow transition-colors"
            >
              {employeeToEdit ? 'Salvar Alterações' : 'Cadastrar Colaborador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
