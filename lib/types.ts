export type TopicStatus = 'Não Iniciado' | 'Em Estudo' | 'Revisando' | 'Concluído' | 'Dominado';

export interface TopicProgress {
  topicId: string;
  topicCode: string;
  topicTitle: string;
  disciplineId: string;
  disciplineName: string;
  status: TopicStatus;
  hoursStudiedMinutes: number; // in minutes
  questionsTotal: number;
  questionsCorrect: number;
  lastStudiedDate: string | null; // ISO string or YYYY-MM-DD
  notesCount: number;
  confidenceRating: number; // 1 to 5 stars
}

export type StudyMode = 'Teoria' | 'Questões' | 'Revisão' | 'Leitura de Lei/Resumo' | 'Flashcards';

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  disciplineId: string;
  disciplineName: string;
  topicId: string;
  topicCode: string;
  topicTitle: string;
  themeDetail?: string; // Subtema específico
  durationMinutes: number; // Duration in minutes
  studyMode: StudyMode;
  questionsTotal: number;
  questionsCorrect: number;
  confidenceRating: number; // 1 to 5
  notes?: string;
  syncedToSheets?: boolean;
}

export interface ScheduledRevision {
  id: string;
  sessionId: string;
  topicId: string;
  topicCode: string;
  topicTitle: string;
  disciplineName: string;
  scheduledForDate: string; // YYYY-MM-DD
  intervalType: '24h' | '7d' | '30d';
  completed: boolean;
  completedAt?: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  lastSyncedAt: string | null;
  autoSync: boolean;
}

export interface StudySummaryStats {
  totalMinutesStudied: number;
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  accuracyRate: number; // percentage 0-100
  topicsMastered: number;
  topicsInProgress: number;
  topicsNotStarted: number;
  currentStreakDays: number;
}

export interface QuestionOption {
  id: string; // e.g. 'A', 'B', 'C', 'D', 'E' or 'CERTO', 'ERRADO'
  text: string;
}

export interface ExamQuestion {
  id: string;
  banca: string; // e.g. CEBRASPE, FGV, IBFC, FCC, VUNESP
  year?: number; // e.g. 2024
  examName?: string; // e.g. "DATAPREV 2023 - Analista de TI"
  disciplineId: string;
  disciplineName: string;
  topicId?: string;
  topicTitle?: string;
  statement: string; // Enunciado
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string; // Gabarito Comentado
  userAnswer?: string;
  isCorrect?: boolean;
  answeredAt?: string;
}

export interface PastExam {
  id: string;
  title: string;
  banca: string;
  year: number;
  disciplineName: string;
  questionsCount: number;
  createdAt: string;
  questions: ExamQuestion[];
}

export interface CustomEdital {
  id: string;
  title: string;
  banca: string;
  cargo: string;
  rawText?: string;
  updatedAt: string;
}

