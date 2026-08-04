export interface GeminiModelInfo {
  id: string;
  name: string;
  category: 'text' | 'image' | 'tts';
  categoryLabel: string;
  description: string;
  badge?: string;
  limits: {
    rpm?: string;
    tpm?: string;
    rpd?: string;
  };
}

export const GEMINI_MODELS: GeminiModelInfo[] = [
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    category: 'text',
    categoryLabel: 'Saída de Texto',
    description: 'Modelo topo de linha de alta performance para explicações complexas e análise avançada.',
    badge: 'Recomendado',
    limits: {
      rpm: '5 RPM',
      tpm: '250K TPM',
      rpd: 'Ilimitado'
    }
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    category: 'text',
    categoryLabel: 'Saída de Texto',
    description: 'Modelo versátil de alta velocidade e precisão conceitual.',
    limits: {
      rpm: '5 RPM',
      tpm: '250K TPM',
      rpd: '20 RPD'
    }
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash Lite',
    category: 'text',
    categoryLabel: 'Saída de Texto',
    description: 'Versão rápida e eficiente ideal para revisões dinâmicas.',
    limits: {
      rpm: '15 RPM',
      tpm: '250K TPM',
      rpd: '500 RPD'
    }
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    category: 'text',
    categoryLabel: 'Saída de Texto',
    description: 'Modelo ultra veloz com alto limite de requisições por dia.',
    badge: 'Alta Taxa',
    limits: {
      rpm: '15 RPM',
      tpm: '250K TPM',
      rpd: '500 RPD'
    }
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    category: 'text',
    categoryLabel: 'Saída de Texto',
    description: 'Modelo estável para resoluções de questões e mnemônicos.',
    limits: {
      rpm: '10 RPM',
      tpm: '250K TPM',
      rpd: '20 RPD'
    }
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    category: 'text',
    categoryLabel: 'Saída de Texto',
    description: 'Modelo leve para respostas concisas.',
    limits: {
      rpm: '10 RPM',
      tpm: '250K TPM',
      rpd: '20 RPD'
    }
  },
  {
    id: 'nano-banana-2-lite',
    name: 'Nano Banana 2 Lite (Gemini 3.1 Flash Lite Image)',
    category: 'image',
    categoryLabel: 'Multimodal / Imagem',
    description: 'Modelo generativo especialista para diagramas, visualização e esquemas visuais.',
    badge: 'Visão & Imagem',
    limits: {
      rpm: 'Multimodal',
      tpm: 'Visual',
      rpd: 'Especial'
    }
  },
  {
    id: 'gemini-3.1-flash-tts',
    name: 'Gemini 3.1 Flash TTS',
    category: 'tts',
    categoryLabel: 'Multimodal / Voz',
    description: 'Modelo generativo de síntese de voz (Text-To-Speech) para narração de áudio.',
    badge: 'Áudio & Voz',
    limits: {
      rpm: '3 RPM',
      tpm: '10K TPM',
      rpd: '10 RPD'
    }
  },
  {
    id: 'gemini-2.5-flash-tts',
    name: 'Gemini 2.5 Flash TTS',
    category: 'tts',
    categoryLabel: 'Multimodal / Voz',
    description: 'Modelo multimodal para narração e áudios educativos de revisão.',
    badge: 'Áudio & Voz',
    limits: {
      rpm: '3 RPM',
      tpm: '10K TPM'
    }
  }
];

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash';
