export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ExportPreset {
  id: 'low' | 'medium' | 'high';
  label: string;
  description: string;
  format: 'jpeg' | 'png';
  quality?: number;
  maxWidth: number;
  estimatedSize: string;
}

export interface ExportModalState {
  selectedPreset: ExportPreset['id'];
  isGenerating: boolean;
  preview: {
    dataUrl: string;
    dimensions: { width: number; height: number };
    fileSize: number;
  } | null;
  error: string | null;
}

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'low',
    label: 'Baixa Qualidade',
    description: 'Arquivo pequeno, ideal para compartilhamento rápido',
    format: 'jpeg',
    quality: 0.7,
    maxWidth: 375, // iPhone SE/8 width
    estimatedSize: '~100KB',
  },
  {
    id: 'medium',
    label: 'Média Qualidade',
    description: 'Boa qualidade para maioria dos usos',
    format: 'jpeg',
    quality: 0.85,
    maxWidth: 414, // iPhone Plus/Pro Max width
    estimatedSize: '~300KB',
  },
  {
    id: 'high',
    label: 'Alta Qualidade',
    description: 'Máxima qualidade, como screenshot real',
    format: 'png',
    maxWidth: 428, // iPhone 14 Pro Max width
    estimatedSize: '~1MB',
  },
];
