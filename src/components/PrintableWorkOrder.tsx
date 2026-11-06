import React from 'react';
import { useApp } from '../context/AppContext';
import { DIAS_SEMANA_MAP, formatDateBr } from '../utils/formatters';
import { Printer, X } from 'lucide-react';

export const PrintableWorkOrder: React.FC = () => {
  const { projetoParaImpressao, setProjetoParaImpressao, getFuncionariosByProjeto, getStatusById } = useApp();

  if (!projetoParaImpressao) return null;

  const equipe = getFuncionariosByProjeto(projetoParaImpressao.id);
  const status = getStatusById(projetoParaImpressao.statusId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto p-4 flex flex-col items-center">
      {/* Barra de Ações (Oculta na Impressão) */}
      <div className="no-print max-w-4xl w-full flex items-center justify-between mb-4 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="font-bold text-white">Visualização de Impressão:</span>
          <span>Ordem de Serviço & Ficha de Campo</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
          <button
            onClick={() => setProjetoParaImpressao(null)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Folha Formal de Ordem de Serviço (A4 style) */}
      <div className="bg-white text-slate-900 w-full max-w-4xl p-8 sm:p-12 rounded-xl shadow-2xl print:p-0 print:shadow-none print:w-full space-y-6">
        {/* Cabeçalho Corporativo com Logo Tesla */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
          <div className="flex items-center gap-4">
            <img
              src="/assets/aistudio/logo_tesla_transparent.png"
              alt="Tesla Engenharia e Automação"
              className="h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase font-sans">
                Tesla Engenharia & Automação
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Sistemas Elétricos de Alta & Baixa Tensão · Infraestrutura Industrial
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-slate-500 block">ORDEM DE SERVIÇO Nº</span>
            <span className="text-lg font-bold text-slate-950">{projetoParaImpressao.codigo}</span>
            <span className="text-xs text-slate-600 block mt-0.5">
              Status: <strong>{status?.nome || 'Em Andamento'}</strong>
            </span>
          </div>
        </div>

        {/* Dados da Obra */}
        <div className="border border-slate-300 rounded-lg p-4 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Obra / Projeto</span>
              <strong className="text-sm text-slate-900">{projetoParaImpressao.nome}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Cliente / Contratante</span>
              <strong className="text-sm text-slate-900">{projetoParaImpressao.cliente}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Local do Canteiro</span>
              <span className="text-slate-800 font-medium">{projetoParaImpressao.local}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Período de Execução</span>
              <span className="text-slate-800 font-mono">
                {formatDateBr(projetoParaImpressao.dataInicio)} até {formatDateBr(projetoParaImpressao.dataFimPrevista)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Escala da Semana no Canteiro</span>
            <div className="flex gap-2 pt-1 font-mono text-xs">
              {DIAS_SEMANA_MAP.map((d) => (
                <span
                  key={d.id}
                  className={`px-2 py-0.5 rounded border text-[11px] ${
                    projetoParaImpressao.diasSemana.includes(d.id)
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>

          {projetoParaImpressao.descricao && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Escopo Técnico</span>
              <p className="text-slate-700 leading-relaxed">{projetoParaImpressao.descricao}</p>
            </div>
          )}
        </div>

        {/* Equipe Técnica Escalada (com Nome, Função, CPF, Idade e Especialidade) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 font-mono border-b border-slate-300 pb-1 mb-2">
            1. Equipe Técnica Designada Exclusivamente para a Obra
          </h2>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 font-mono text-[11px]">
                <th className="py-2 px-3">COLABORADOR</th>
                <th className="py-2 px-3">FUNÇÃO</th>
                <th className="py-2 px-3">CPF</th>
                <th className="py-2 px-3">IDADE</th>
                <th className="py-2 px-3">ESPECIALIDADE / PONTO FORTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {equipe.map((m) => (
                <tr key={m.id}>
                  <td className="py-2 px-3 font-semibold text-slate-900">{m.nome}</td>
                  <td className="py-2 px-3 text-slate-700">{m.funcao}</td>
                  <td className="py-2 px-3 font-mono text-slate-600">{m.cpf}</td>
                  <td className="py-2 px-3 font-mono text-slate-600">{m.idade} anos</td>
                  <td className="py-2 px-3 font-semibold text-blue-800 font-mono">★ {m.especialidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Etapas do Cronograma */}
        {projetoParaImpressao.etapas.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 font-mono border-b border-slate-300 pb-1 mb-2">
              2. Etapas do Planejamento & Cronograma Físico
            </h2>
            <div className="space-y-1.5 text-xs">
              {projetoParaImpressao.etapas.map((etp, idx) => (
                <div
                  key={etp.id}
                  className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200"
                >
                  <span className="font-medium text-slate-900">
                    {idx + 1}. {etp.titulo}
                  </span>
                  <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-slate-200 font-bold">
                    {etp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Materiais Necessários */}
        {projetoParaImpressao.materiais.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 font-mono border-b border-slate-300 pb-1 mb-2">
              3. Materiais de Elétrica & Infraestrutura do Projeto
            </h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 font-mono text-[11px]">
                  <th className="py-2 px-3">CÓDIGO</th>
                  <th className="py-2 px-3">MATERIAL</th>
                  <th className="py-2 px-3">QUANTIDADE</th>
                  <th className="py-2 px-3">STATUS DE FORNECIMENTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projetoParaImpressao.materiais.map((mat) => (
                  <tr key={mat.id}>
                    <td className="py-1.5 px-3 font-mono text-slate-600">{mat.codigo}</td>
                    <td className="py-1.5 px-3 font-medium text-slate-800">{mat.nome}</td>
                    <td className="py-1.5 px-3 font-mono text-slate-800">
                      {mat.qtdPrevista} {mat.unidade}
                    </td>
                    <td className="py-1.5 px-3 uppercase text-[11px] font-mono text-slate-700">
                      {mat.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Termo de Liberação & Assinaturas */}
        <div className="pt-6 border-t-2 border-slate-900 space-y-6">
          <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
            A equipe acima qualificada declara estar ciente de todas as normas regulamentadoras de segurança do trabalho aplicáveis (NR-10, NR-35 e SEP). As atividades em circuitos energizados ou em altura somente poderão ser iniciadas após emissão e assinatura da respectiva PT (Permissão de Trabalho) e APR (Análise Preliminar de Risco).
          </p>

          <div className="grid grid-cols-3 gap-6 pt-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <strong className="block text-slate-900">Engenheiro Responsável Técnico</strong>
              <span className="text-[10px] text-slate-500 font-mono">CREA / ART</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <strong className="block text-slate-900">Técnico de Segurança (TST)</strong>
              <span className="text-[10px] text-slate-500 font-mono">MTE / Liberação PT</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <strong className="block text-slate-900">Encarregado Geral de Obra</strong>
              <span className="text-[10px] text-slate-500 font-mono">Tesla Engenharia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
