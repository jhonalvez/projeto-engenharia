import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AnexoDocumento } from '../types';
import { formatFileSize, formatDateBr } from '../utils/formatters';
import { 
  FileText, 
  FileCheck2, 
  ShieldAlert, 
  Image as ImageIcon, 
  Download, 
  Eye, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  X,
  Plus
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { anexos, projetos, salvarAnexo, excluirAnexo, baixarAnexo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<'all' | 'pt' | 'apr' | 'foto' | 'documento'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [anexoVisualizando, setAnexoVisualizando] = useState<AnexoDocumento | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategoria, setUploadCategoria] = useState<'pt' | 'apr' | 'foto' | 'documento'>('pt');
  const [uploadTitulo, setUploadTitulo] = useState('');
  const [uploadProjetoId, setUploadProjetoId] = useState<string>(projetos[0]?.id || '');
  const [uploadObservacoes, setUploadObservacoes] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtragem
  const filteredAnexos = useMemo(() => {
    return anexos.filter((a) => {
      const matchSearch =
        searchTerm === '' ||
        a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.nomeArquivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.projetoNome && a.projetoNome.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = selectedCategoria === 'all' || a.categoria === selectedCategoria;
      const matchPrj = selectedProjectId === 'all' || a.projetoId === selectedProjectId;

      return matchSearch && matchCat && matchPrj;
    });
  }, [anexos, searchTerm, selectedCategoria, selectedProjectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadTitulo) {
        setUploadTitulo(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Selecione um arquivo para envio.');
      return;
    }

    setIsSaving(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const prj = projetos.find((p) => p.id === uploadProjetoId);

      const novoAnexo: AnexoDocumento = {
        id: `anx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projetoId: uploadProjetoId || undefined,
        projetoNome: prj ? prj.nome : undefined,
        categoria: uploadCategoria,
        titulo: uploadTitulo.trim() || uploadFile.name,
        nomeArquivo: uploadFile.name,
        tipoMime: uploadFile.type || 'application/octet-stream',
        tamanhoBytes: uploadFile.size,
        dataUpload: new Date().toISOString(),
        dadosBase64: base64,
        observacoes: uploadObservacoes.trim(),
      };

      await salvarAnexo(novoAnexo);
      setIsSaving(false);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitulo('');
      setUploadObservacoes('');
    };

    reader.onerror = () => {
      setIsSaving(false);
      alert('Erro ao processar arquivo.');
    };

    reader.readAsDataURL(uploadFile);
  };

  return (
    <div className="space-y-5">
      {/* Barra de Filtros e Upload */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        {/* Busca */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por PT, título, nome de arquivo ou obra..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filtros de Categoria e Projeto */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value as any)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todas Categorias ({anexos.length})</option>
            <option value="pt">Permissões de Trabalho (PT)</option>
            <option value="apr">Análises de Risco (APR)</option>
            <option value="foto">Fotos de Canteiro</option>
            <option value="documento">Documentos & Projetos</option>
          </select>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 max-w-[180px] truncate"
          >
            <option value="all">Todas as Obras</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} - {p.nome}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm border border-blue-400/40 transition-colors whitespace-nowrap shrink-0 ml-1"
          >
            <Upload className="w-4 h-4" />
            <span>Anexar Arquivo</span>
          </button>
        </div>
      </div>

      {/* Grid de Documentos */}
      {filteredAnexos.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Nenhum anexo encontrado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Faça o upload de PTs assinadas, APRs, fotos do canteiro ou documentos de engenharia para download e histórico seguro.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Anexar Novo Arquivo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnexos.map((anx) => {
            const isImage = anx.tipoMime.startsWith('image/');

            return (
              <div
                key={anx.id}
                className="rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        {anx.categoria === 'pt' ? (
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                        ) : anx.categoria === 'apr' ? (
                          <FileCheck2 className="w-4 h-4 text-cyan-400" />
                        ) : isImage ? (
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-400 bg-blue-950/60 border border-blue-900/40 px-2 py-0.5 rounded">
                        {anx.categoria.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      {formatFileSize(anx.tamanhoBytes)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mt-3 line-clamp-2">
                    {anx.titulo}
                  </h3>

                  {anx.projetoNome && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      Obra: <span className="text-slate-300 font-medium">{anx.projetoNome}</span>
                    </p>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span className="truncate max-w-[160px]">{anx.nomeArquivo}</span>
                    <span>{formatDateBr(anx.dataUpload)}</span>
                  </div>

                  {anx.observacoes && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic bg-slate-950/50 p-2 rounded border border-slate-800/50">
                      "{anx.observacoes}"
                    </p>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setAnexoVisualizando(anx)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                      title="Visualizar Arquivo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => excluirAnexo(anx.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Excluir Arquivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* BOTÃO PROEMINENTE DE DOWNLOAD */}
                  <button
                    onClick={() => baixarAnexo(anx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
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

      {/* Modal de Upload de Arquivo */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full my-auto shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Anexar Arquivo ao Sistema Tesla</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="p-6 space-y-4">
              {/* Categoria */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CATEGORIA DO DOCUMENTO *
                </label>
                <select
                  value={uploadCategoria}
                  onChange={(e) => setUploadCategoria(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="pt">Permissão de Trabalho (PT - Altura / Elétrica / Confinado)</option>
                  <option value="apr">Análise Preliminar de Risco (APR)</option>
                  <option value="foto">Foto de Campo / Canteiro</option>
                  <option value="documento">Documento Técnico / Diagrama Elétrico</option>
                </select>
              </div>

              {/* Obra Vinculada */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  VINCULAR À OBRA / PROJETO
                </label>
                <select
                  value={uploadProjetoId}
                  onChange={(e) => setUploadProjetoId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Documento Geral da Tesla (Sem projeto específico)</option>
                  {projetos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} - {p.nome} ({p.cliente})
                    </option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  TÍTULO DO DOCUMENTO *
                </label>
                <input
                  type="text"
                  value={uploadTitulo}
                  onChange={(e) => setUploadTitulo(e.target.value)}
                  required
                  placeholder="Ex: PT-048 Trabalho em Altura e Bloqueio LOTO"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Seleção de Arquivo */}
              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="modal-file-upload"
                />
                <label
                  htmlFor="modal-file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Escolher Arquivo do Computador/Celular</span>
                </label>
                <p className="text-[11px] text-slate-400 font-mono">
                  {uploadFile ? `Selecionado: ${uploadFile.name} (${formatFileSize(uploadFile.size)})` : 'Suporta PDFs, imagens, SVG, DWG ou documentos'}
                </p>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  OBSERVAÇÕES DE CAMPO
                </label>
                <textarea
                  value={uploadObservacoes}
                  onChange={(e) => setUploadObservacoes(e.target.value)}
                  rows={2}
                  placeholder="Ex: Assinado pelo TST e cliente no canteiro às 07:30..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs md:text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !uploadFile}
                  className="px-5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Anexo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização Preview */}
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
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo</span>
                </button>
                <button
                  onClick={() => setAnexoVisualizando(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-3 bg-slate-950/70 rounded-lg border border-slate-800">
              {anexoVisualizando.tipoMime.startsWith('image/') ? (
                <img
                  src={anexoVisualizando.dadosBase64}
                  alt={anexoVisualizando.titulo}
                  className="max-h-[70vh] w-auto object-contain rounded"
                />
              ) : (
                <div className="text-center p-8 space-y-2">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-sm text-slate-300 font-semibold">{anexoVisualizando.nomeArquivo}</p>
                  <p className="text-xs text-slate-500">
                    Para visualizar o arquivo com formatação completa, clique no botão Baixar acima.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
