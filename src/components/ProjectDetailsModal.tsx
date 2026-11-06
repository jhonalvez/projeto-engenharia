import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Projeto, EtapaPlanejamento, MaterialProjeto, AnexoDocumento } from '../types';
import { DIAS_SEMANA_MAP, getStatusColorClasses, formatDateBr, formatFileSize } from '../utils/formatters';
import { 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Layers, 
  Package, 
  FileCheck2, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
  Building2,
  Phone,
  Mail,
  Camera,
  ZoomIn
} from 'lucide-react';

interface ProjectDetailsModalProps {
  projectId: string | null;
  onClose: () => void;
  onEdit: (projeto: Projeto) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  projectId,
  onClose,
  onEdit,
}) => {
  const {
    projetos,
    statusList,
    solicitantes,
    getStatusById,
    getFuncionariosByProjeto,
    getAnexosByProjeto,
    atualizarStatusProjeto,
    atualizarEtapaStatus,
    adicionarEtapa,
    removerEtapa,
    atualizarMaterial,
    adicionarMaterial,
    removerMaterial,
    salvarAnexo,
    excluirAnexo,
    baixarAnexo,
    setProjetoParaImpressao,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'etapas' | 'materiais' | 'equipe' | 'documentos' | 'fotos'>('etapas');
  const [novaEtapaTitulo, setNovaEtapaTitulo] = useState('');
  const [novoMatNome, setNovoMatNome] = useState('');
  const [novoMatQtd, setNovoMatQtd] = useState(1);
  const [novoMatUnidade, setNovoMatUnidade] = useState('un');

  // Preview de Anexo
  const [anexoVisualizando, setAnexoVisualizando] = useState<AnexoDocumento | null>(null);

  // Upload de arquivo geral
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategoria, setUploadCategoria] = useState<'pt' | 'apr' | 'foto' | 'documento'>('pt');
  const [uploadTitulo, setUploadTitulo] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Upload específico de fotos
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const [fotoTitulo, setFotoTitulo] = useState('');
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);

  if (!projectId) return null;
  const projeto = projetos.find((p) => p.id === projectId);
  if (!projeto) return null;

  const status = getStatusById(projeto.statusId);
  const colorClasses = getStatusColorClasses(status?.cor || 'slate');
  const equipe = getFuncionariosByProjeto(projeto.id);
  const anexos = getAnexosByProjeto(projeto.id);
  const solicitante = solicitantes.find((s) => s.id === projeto.solicitanteId);
  const fotos = anexos.filter((a) => a.categoria === 'foto' || a.tipoMime.startsWith('image/'));

  // Contadores
  const totalEtapas = projeto.etapas.length;
  const concluidas = projeto.etapas.filter((e) => e.status === 'concluida').length;
  const pctEtapas = totalEtapas > 0 ? Math.round((concluidas / totalEtapas) * 100) : 0;

  const handleStatusChange = async (newStatusId: string) => {
    await atualizarStatusProjeto(projeto.id, newStatusId);
  };

  const handleAddEtapa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaEtapaTitulo.trim()) return;
    await adicionarEtapa(projeto.id, {
      titulo: novaEtapaTitulo.trim(),
      status: 'pendente',
      ordem: projeto.etapas.length + 1,
    });
    setNovaEtapaTitulo('');
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMatNome.trim()) return;
    const rand = Math.floor(100 + Math.random() * 900);
    await adicionarMaterial(projeto.id, {
      codigo: `MAT-${rand}`,
      nome: novoMatNome.trim(),
      qtdPrevista: Number(novoMatQtd) || 1,
      qtdInstalada: 0,
      unidade: novoMatUnidade,
      status: 'solicitado',
    });
    setNovoMatNome('');
    setNovoMatQtd(1);
  };

  // Upload local de arquivo geral (PT, APR, Fotos, Docs)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const novoAnexo: AnexoDocumento = {
        id: `anx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projetoId: projeto.id,
        projetoNome: projeto.nome,
        categoria: uploadCategoria,
        titulo: uploadTitulo.trim() || file.name,
        nomeArquivo: file.name,
        tipoMime: file.type || 'application/octet-stream',
        tamanhoBytes: file.size,
        dataUpload: new Date().toISOString(),
        dadosBase64: base64,
        observacoes: `Anexado no canteiro da obra ${projeto.codigo}`,
      };

      await salvarAnexo(novoAnexo);
      setUploadTitulo('');
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('Erro ao carregar o arquivo local');
    };

    reader.readAsDataURL(file);
  };

  // Upload específico de fotos do canteiro
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFoto(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const novaFoto: AnexoDocumento = {
        id: `foto_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projetoId: projeto.id,
        projetoNome: projeto.nome,
        categoria: 'foto',
        titulo: fotoTitulo.trim() || `Foto de Campo - ${file.name}`,
        nomeArquivo: file.name,
        tipoMime: file.type || 'image/jpeg',
        tamanhoBytes: file.size,
        dataUpload: new Date().toISOString(),
        dadosBase64: base64,
        observacoes: `Foto registrada em canteiro da obra ${projeto.codigo}`,
      };

      await salvarAnexo(novaFoto);
      setFotoTitulo('');
      setIsUploadingFoto(false);
      if (fotoInputRef.current) fotoInputRef.current.value = '';
    };

    reader.onerror = () => {
      setIsUploadingFoto(false);
      alert('Erro ao processar imagem');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Cabeçalho do Projeto */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                  {projeto.codigo}
                </span>

                {/* Seletor rápido de Status Operacional */}
                <select
                  value={projeto.statusId}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded border focus:outline-none cursor-pointer ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`}
                >
                  {statusList.map((st) => (
                    <option key={st.id} value={st.id} className="bg-slate-900 text-slate-100">
                      {st.nome} {st.isTerminal ? '✓ (Concluído - Libera Equipe)' : ''}
                    </option>
                  ))}
                </select>

                {status?.isTerminal && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    ✓ Equipe Liberada p/ outras obras
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-2">
                {projeto.nome}
              </h2>

              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <strong className="text-slate-300">{projeto.cliente}</strong> · {projeto.local}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {formatDateBr(projeto.dataInicio)} até {formatDateBr(projeto.dataFimPrevista)}
                </span>
              </div>

              {/* Informações detalhadas do Solicitante / Cliente */}
              {solicitante ? (
                <div className="mt-3 p-3 rounded-lg bg-blue-950/40 border border-blue-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-blue-900/40 text-blue-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-blue-300 font-semibold block">
                        Solicitante Cadastrado (Cliente)
                      </span>
                      <span className="font-bold text-slate-100">{solicitante.razaoSocial || solicitante.nome}</span>
                      {solicitante.documento && (
                        <span className="text-slate-400 ml-1.5 font-mono">({solicitante.documento})</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 font-mono text-[11px] flex-wrap">
                    {solicitante.contatoPrincipal && (
                      <span>Contato: <strong className="text-slate-200">{solicitante.contatoPrincipal}</strong></span>
                    )}
                    {solicitante.telefone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {solicitante.telefone}
                      </span>
                    )}
                    {solicitante.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {solicitante.email}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Solicitante / Cliente: <strong className="text-slate-200">{projeto.cliente}</strong></span>
                </div>
              )}
            </div>

            {/* Ações do Topo */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setProjetoParaImpressao(projeto)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Imprimir Ordem de Serviço da Obra"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Imprimir OS</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(projeto);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Editar Obra
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dias da Semana Escalados */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Escala da Equipe:
            </span>
            <div className="flex items-center gap-1">
              {DIAS_SEMANA_MAP.map((d) => {
                const ativo = projeto.diasSemana.includes(d.id);
                return (
                  <span
                    key={d.id}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                      ativo
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'text-slate-600 bg-slate-950/40'
                    }`}
                  >
                    {d.abrev}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Abas do Projeto */}
        <div className="flex items-center gap-1 px-6 pt-2 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('etapas')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'etapas'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Etapas do Planejamento ({concluidas}/{totalEtapas})</span>
          </button>
          <button
            onClick={() => setActiveTab('materiais')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'materiais'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Materiais Elétricos ({projeto.materiais.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('equipe')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'equipe'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Equipe Escalada ({equipe.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('fotos')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fotos'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Fotos de Campo ({fotos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'documentos'
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>PTs, APRs & Docs ({anexos.length})</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ABA ETAPAS DO PLANEJAMENTO */}
          {activeTab === 'etapas' && (
            <div className="space-y-4">
              {/* Barra de Progresso Geral */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Progresso Global do Cronograma</span>
                  <span className="font-bold text-blue-400">{pctEtapas}% CONCLUÍDO</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pctEtapas}%` }}
                  />
                </div>
              </div>

              {/* Formulário Rápido de Nova Etapa */}
              <form onSubmit={handleAddEtapa} className="flex gap-2">
                <input
                  type="text"
                  value={novaEtapaTitulo}
                  onChange={(e) => setNovaEtapaTitulo(e.target.value)}
                  placeholder="Descreva a nova etapa (ex: Megagem de barramentos)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Etapa</span>
                </button>
              </form>

              {/* Lista de Etapas */}
              <div className="space-y-2.5">
                {projeto.etapas.map((etp, idx) => {
                  const isDone = etp.status === 'concluida';
                  return (
                    <div
                      key={etp.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-900/40'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <button
                          onClick={() =>
                            atualizarEtapaStatus(
                              projeto.id,
                              etp.id,
                              isDone ? 'pendente' : 'concluida'
                            )
                          }
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 mt-0.5 sm:mt-0 ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-slate-900 border-slate-700 text-transparent hover:border-slate-500'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <div>
                          <span
                            className={`text-xs md:text-sm font-medium ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {idx + 1}. {etp.titulo}
                          </span>
                          {etp.dataLimite && (
                            <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
                              Previsão: {formatDateBr(etp.dataLimite)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <select
                          value={etp.status}
                          onChange={(e) =>
                            atualizarEtapaStatus(
                              projeto.id,
                              etp.id,
                              e.target.value as EtapaPlanejamento['status']
                            )
                          }
                          className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em_andamento">Em Andamento</option>
                          <option value="concluida">Concluída</option>
                          <option value="bloqueada">Bloqueada</option>
                        </select>

                        <button
                          onClick={() => removerEtapa(projeto.id, etp.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                          title="Remover Etapa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA MATERIAIS */}
          {activeTab === 'materiais' && (
            <div className="space-y-4">
              {/* Formulário Novo Material */}
              <form
                onSubmit={handleAddMaterial}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
              >
                <input
                  type="text"
                  value={novoMatNome}
                  onChange={(e) => setNovoMatNome(e.target.value)}
                  placeholder="Nome do material elétrico (ex: Eletroduto Galvanizado 2 pol)..."
                  className="sm:col-span-6 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  min="1"
                  value={novoMatQtd}
                  onChange={(e) => setNovoMatQtd(Number(e.target.value))}
                  placeholder="Qtd"
                  className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs md:text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
                <select
                  value={novoMatUnidade}
                  onChange={(e) => setNovoMatUnidade(e.target.value)}
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
                  type="submit"
                  className="sm:col-span-2 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  + Inserir
                </button>
              </form>

              {/* Tabela de Materiais */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/80">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-xs">
                      <th className="py-2.5 px-3">CÓDIGO</th>
                      <th className="py-2.5 px-3">DESCRIÇÃO DO MATERIAL</th>
                      <th className="py-2.5 px-3">PREVISTO</th>
                      <th className="py-2.5 px-3">INSTALADO</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-right">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {projeto.materiais.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          Nenhum material elétrico cadastrado para este projeto.
                        </td>
                      </tr>
                    ) : (
                      projeto.materiais.map((mat) => (
                        <tr key={mat.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-blue-400 text-xs">{mat.codigo}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-200">{mat.nome}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {mat.qtdPrevista} {mat.unidade}
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            <input
                              type="number"
                              min="0"
                              max={mat.qtdPrevista}
                              value={mat.qtdInstalada}
                              onChange={(e) =>
                                atualizarMaterial(projeto.id, {
                                  ...mat,
                                  qtdInstalada: Number(e.target.value),
                                })
                              }
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-100 font-mono focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={mat.status}
                              onChange={(e) =>
                                atualizarMaterial(projeto.id, {
                                  ...mat,
                                  status: e.target.value as MaterialProjeto['status'],
                                })
                              }
                              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                            >
                              <option value="solicitado">Solicitado</option>
                              <option value="em_transito">Em Trânsito</option>
                              <option value="no_canteiro">No Canteiro</option>
                              <option value="instalado">Instalado</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => removerMaterial(projeto.id, mat.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA EQUIPE ESCALADA */}
          {activeTab === 'equipe' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Colaboradores Alocados Exclusivamente nesta Obra</span>
                <span className="font-mono text-blue-400 font-semibold">{equipe.length} Técnicos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equipe.map((membro) => (
                  <div
                    key={membro.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{membro.nome}</h4>
                        <p className="text-xs text-slate-400">{membro.funcao}</p>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-950/80 border border-blue-900/50 text-blue-300 shrink-0">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span>{membro.especialidade}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>CPF: {membro.cpf}</span>
                      <span>Idade: {membro.idade} anos</span>
                    </div>

                    {membro.certificacoes && membro.certificacoes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {membro.certificacoes.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA FOTOS DE CAMPO COM UPLOAD E VISUALIZAÇÃO */}
          {activeTab === 'fotos' && (
            <div className="space-y-4">
              {/* Box de Upload de Foto do Canteiro */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    Upload de Fotos do Canteiro & Evidências Visuais
                  </h4>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (Visualização e Download direto)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <input
                    type="text"
                    value={fotoTitulo}
                    onChange={(e) => setFotoTitulo(e.target.value)}
                    placeholder="Legenda da foto (ex: Barramento 13.8kV finalizado, Inspeção de aterramento)..."
                    className="sm:col-span-8 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />

                  <div className="sm:col-span-4 flex items-center gap-2">
                    <input
                      type="file"
                      ref={fotoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                      id="upload-foto-input"
                    />
                    <label
                      htmlFor="upload-foto-input"
                      className="w-full py-2 px-3 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{isUploadingFoto ? 'Enviando Foto...' : 'Carregar / Tirar Foto'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Galeria de Fotos */}
              {fotos.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 space-y-3">
                  <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-semibold text-slate-300">Nenhuma foto registrada nesta obra</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Faça o upload de fotos de execução, segurança, leitos, painéis e conformidade para manter o histórico visual do projeto.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {fotos.map((foto) => (
                    <div
                      key={foto.id}
                      className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all shadow-sm"
                    >
                      {/* Thumbnail com Overlay */}
                      <div
                        onClick={() => setAnexoVisualizando(foto)}
                        className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center group-hover:opacity-95 transition-opacity"
                      >
                        <img
                          src={foto.dadosBase64}
                          alt={foto.titulo}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <span className="p-2 rounded-full bg-blue-600 text-white shadow-lg">
                            <ZoomIn className="w-4 h-4" />
                          </span>
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-slate-300 backdrop-blur-sm">
                          {formatFileSize(foto.tamanhoBytes)}
                        </span>
                      </div>

                      {/* Informações da Foto */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h5 className="text-xs font-bold text-slate-200 line-clamp-1" title={foto.titulo}>
                            {foto.titulo}
                          </h5>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {formatDateBr(foto.dataUpload)} · {foto.nomeArquivo}
                          </p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => setAnexoVisualizando(foto)}
                            className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>Visualizar</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => baixarAnexo(foto)}
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                              title="Baixar imagem original"
                            >
                              <Download className="w-3 h-3" />
                              <span>Baixar</span>
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Deseja excluir a foto "${foto.titulo}"?`)) {
                                  await excluirAnexo(foto.id);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors"
                              title="Excluir foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA DOCUMENTOS, PT & APR COM DOWNLOAD */}
          {activeTab === 'documentos' && (
            <div className="space-y-4">
              {/* Box de Upload de Anexo para este Projeto */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-400" />
                    Anexar Nova PT, APR, Foto de Campo ou Documento
                  </h4>
                  <span className="text-[11px] text-slate-400">Download garantido em 1 clique</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <select
                    value={uploadCategoria}
                    onChange={(e) => setUploadCategoria(e.target.value as any)}
                    className="sm:col-span-3 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="pt">Permissão de Trabalho (PT)</option>
                    <option value="apr">Análise Preliminar de Risco (APR)</option>
                    <option value="foto">Foto de Campo</option>
                    <option value="documento">Documento Técnico / Desenho</option>
                  </select>

                  <input
                    type="text"
                    value={uploadTitulo}
                    onChange={(e) => setUploadTitulo(e.target.value)}
                    placeholder="Título do anexo (ex: PT-045 Bloqueio Subestação)..."
                    className="sm:col-span-5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />

                  <div className="sm:col-span-4 flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="upload-anexo-input"
                    />
                    <label
                      htmlFor="upload-anexo-input"
                      className="flex-1 py-2 px-3 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                    >
                      {isUploading ? 'Processando...' : 'Selecionar Arquivo'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Lista dos Anexos do Projeto */}
              {anexos.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-500 text-xs">
                  Nenhuma PT, APR ou foto anexada para esta obra ainda. Faça o upload acima.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {anexos.map((anx) => {
                    const isImage = anx.tipoMime.startsWith('image/');
                    return (
                      <div
                        key={anx.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-blue-400">
                            {anx.categoria === 'pt' ? (
                              <ShieldAlert className="w-5 h-5 text-amber-400" />
                            ) : anx.categoria === 'apr' ? (
                              <FileCheck2 className="w-5 h-5 text-cyan-400" />
                            ) : isImage ? (
                              <ImageIcon className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <FileText className="w-5 h-5 text-purple-400" />
                            )}
                          </div>

                          <div className="truncate flex-1">
                            <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block">
                              {anx.categoria.toUpperCase()}
                            </span>
                            <h4 className="text-xs md:text-sm font-semibold text-slate-100 truncate">
                              {anx.titulo}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {anx.nomeArquivo} · {formatFileSize(anx.tamanhoBytes)}
                            </p>
                          </div>
                        </div>

                        {/* Botões de Ação: Ver Preview e BAIXAR */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setAnexoVisualizando(anx)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Visualizar</span>
                          </button>

                          <button
                            onClick={() => baixarAnexo(anx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                            title="Baixar arquivo original"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Baixar Arquivo</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização de Anexo (Preview de Imagem / SVG / Documento) */}
      {anexoVisualizando && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-4 space-y-3 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{anexoVisualizando.titulo}</h3>
                <p className="text-xs text-slate-400 font-mono">{anexoVisualizando.nomeArquivo}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => baixarAnexo(anexoVisualizando)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
                <button
                  onClick={() => setAnexoVisualizando(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950/60 rounded-lg border border-slate-800">
              {anexoVisualizando.tipoMime.startsWith('image/') ? (
                <img
                  src={anexoVisualizando.dadosBase64}
                  alt={anexoVisualizando.titulo}
                  className="max-h-[70vh] w-auto object-contain rounded"
                />
              ) : (
                <div className="text-center p-8 space-y-2">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-sm text-slate-300">Documento Binário: {anexoVisualizando.nomeArquivo}</p>
                  <p className="text-xs text-slate-500">Clique no botão Baixar acima para abrir no seu leitor padrão.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
