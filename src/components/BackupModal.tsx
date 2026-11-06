import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HardDrive, 
  ShieldCheck, 
  Smartphone, 
  Monitor,
  X 
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const {
    funcionarios,
    projetos,
    anexos,
    statusList,
    exportarArquivoBackup,
    importarArquivoBackup,
    resetarDemonstracao,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      await exportarArquivoBackup();
      setFeedbackMsg({ text: 'Arquivo de backup exportado com sucesso!', type: 'success' });
    } catch {
      setFeedbackMsg({ text: 'Falha ao exportar backup.', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = reader.result as string;
        const ok = await importarArquivoBackup(text);
        if (ok) {
          setFeedbackMsg({ text: 'Backup restaurado com sucesso no banco local!', type: 'success' });
        } else {
          setFeedbackMsg({ text: 'Formato do arquivo de backup inválido.', type: 'error' });
        }
      } catch {
        setFeedbackMsg({ text: 'Erro ao ler arquivo de backup.', type: 'error' });
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (window.confirm('Deseja restaurar os dados de demonstração da Tesla Engenharia? Todos os dados atuais serão substituídos pelos de fábrica.')) {
      setIsProcessing(true);
      await resetarDemonstracao();
      setFeedbackMsg({ text: 'Banco restaurado para o padrão inicial da Tesla!', type: 'success' });
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full my-auto shadow-2xl overflow-hidden space-y-4 p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/80 border border-blue-900/60 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Banco de Dados Local & Gestão de Arquivos
              </h2>
              <p className="text-xs text-slate-400">
                Tesla Engenharia · Persistência Segura em IndexedDB e Exportação JSON
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedbackMsg && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-900/50 text-rose-300'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Resumo do Banco Local */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-400" />
              STATUS DO STORAGE LOCAL
            </span>
            <span className="text-emerald-400 font-semibold">100% OPERACIONAL</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">PROJETOS</span>
              <strong className="text-sm font-mono text-slate-100">{projetos.length}</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">EQUIPE</span>
              <strong className="text-sm font-mono text-slate-100">{funcionarios.length}</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">DOCUMENTOS</span>
              <strong className="text-sm font-mono text-slate-100">{anexos.length}</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">STATUS</span>
              <strong className="text-sm font-mono text-slate-100">{statusList.length}</strong>
            </div>
          </div>
        </div>

        {/* Ações de Backup e Restauração em Arquivo */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Exportar & Importar Arquivos de Dados
          </h4>

          {/* Exportar */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Exportar Backup Completo (.JSON)
              </span>
              <span className="text-[11px] text-slate-400">
                Baixa um arquivo JSON com todas as obras, equipes, PTs, fotos e materiais para seu dispositivo.
              </span>
            </div>
            <button
              onClick={handleExport}
              disabled={isProcessing}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Backup</span>
            </button>
          </div>

          {/* Importar */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Restaurar Backup de Arquivo (.JSON)
              </span>
              <span className="text-[11px] text-slate-400">
                Substitui os dados locais pelos dados contidos em um arquivo de backup previamente exportado.
              </span>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                id="backup-file-upload"
              />
              <label
                htmlFor="backup-file-upload"
                className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Subir Arquivo</span>
              </label>
            </div>
          </div>

          {/* Reset Demonstração */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Restaurar Dados Iniciais da Tesla
              </span>
              <span className="text-[11px] text-slate-400">
                Recarrega as obras de subestações, equipes de eletricistas e PTs de demonstração.
              </span>
            </div>
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="px-3.5 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-900/60 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>

        {/* Informações Multiplataforma */}
        <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] text-slate-300 space-y-1">
          <div className="font-semibold text-blue-300 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5" />
            <Smartphone className="w-3.5 h-3.5" />
            Compatibilidade Multiplataforma (Windows, Linux & Android)
          </div>
          <p className="text-slate-400 leading-relaxed">
            Este aplicativo funciona tanto em desktops de salas de controle (Windows/Linux) quanto em smartphones e tablets de canteiro de obras (Android) com armazenamento local off-line através de Progressive Web App (PWA) e IndexedDB.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
