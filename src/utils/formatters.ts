import { DiaSemana } from '../types';

export const DIAS_SEMANA_MAP: { id: DiaSemana; label: string; abrev: string; dayIndex: number }[] = [
  { id: 'seg', label: 'Segunda-feira', abrev: 'Seg', dayIndex: 1 },
  { id: 'ter', label: 'Terça-feira', abrev: 'Ter', dayIndex: 2 },
  { id: 'qua', label: 'Quarta-feira', abrev: 'Qua', dayIndex: 3 },
  { id: 'qui', label: 'Quinta-feira', abrev: 'Qui', dayIndex: 4 },
  { id: 'sex', label: 'Sexta-feira', abrev: 'Sex', dayIndex: 5 },
  { id: 'sab', label: 'Sábado', abrev: 'Sáb', dayIndex: 6 },
  { id: 'dom', label: 'Domingo', abrev: 'Dom', dayIndex: 0 },
];

export const formatCpf = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length <= 11) {
    return clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return cpf;
};

export const formatDateBr = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const getStatusColorClasses = (color: string) => {
  switch (color) {
    case 'amber':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        dot: 'bg-cyan-400',
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        dot: 'bg-blue-400',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
      };
    case 'purple':
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        dot: 'bg-purple-400',
      };
    case 'rose':
      return {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        dot: 'bg-rose-400',
      };
    case 'slate':
    default:
      return {
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
        dot: 'bg-slate-400',
      };
  }
};

export const getDiaSemanaHoje = (): DiaSemana => {
  const day = new Date().getDay();
  const match = DIAS_SEMANA_MAP.find((d) => d.dayIndex === day);
  return match ? match.id : 'seg';
};
