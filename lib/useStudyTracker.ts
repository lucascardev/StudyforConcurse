'use client';

import { useState, useEffect, useCallback } from 'react';
import { parseJsonResponse } from './utils';
import { getStoredGoogleAccessToken } from './google-oauth';
import { DATAPREV_SYLLABUS, getAllTopics, Discipline } from './dataprev-syllabus';
import {
  TopicProgress,
  StudySession,
  ScheduledRevision,
  GoogleSheetsConfig,
  StudySummaryStats,
  TopicStatus,
  ExamQuestion,
  PastExam
} from './types';

const LOCAL_STORAGE_KEY_PROGRESS = 'dataprev_2026_progress_v2';
const LOCAL_STORAGE_KEY_SESSIONS = 'dataprev_2026_sessions_v2';
const LOCAL_STORAGE_KEY_REVISIONS = 'dataprev_2026_revisions_v2';
const LOCAL_STORAGE_KEY_CONFIG = 'dataprev_2026_sheets_config_v2';

function getErrorMessage(err: unknown, fallback: string = 'Ocorreu um erro na integração do Google Sheets'): string {
  if (!err) return fallback;
  if (typeof err === 'string' && err.trim()) return err;
  if (typeof err === 'object') {
    const e = err as Record<string, any>;
    if (typeof e.message === 'string' && e.message.trim()) return e.message;
    if (typeof e.error === 'string' && e.error.trim()) return e.error;
  }
  return fallback;
}

export function useStudyTracker() {
  const [topicProgressMap, setTopicProgressMap] = useState<Record<string, TopicProgress>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY_PROGRESS);
      if (savedProgress) return JSON.parse(savedProgress);
    } catch (e) {
      console.error(e);
    }
    const initialMap: Record<string, TopicProgress> = {};
    for (const disc of DATAPREV_SYLLABUS) {
      for (const topic of disc.topics) {
        initialMap[topic.id] = {
          topicId: topic.id,
          topicCode: topic.code,
          topicTitle: topic.title,
          disciplineId: disc.id,
          disciplineName: disc.name,
          status: 'Não Iniciado',
          hoursStudiedMinutes: 0,
          questionsTotal: 0,
          questionsCorrect: 0,
          lastStudiedDate: null,
          notesCount: 0,
          confidenceRating: 0
        };
      }
    }
    return initialMap;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedSessions = localStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
      if (savedSessions) return JSON.parse(savedSessions);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [revisions, setRevisions] = useState<ScheduledRevision[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedRevisions = localStorage.getItem(LOCAL_STORAGE_KEY_REVISIONS);
      if (savedRevisions) return JSON.parse(savedRevisions);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [questionBank, setQuestionBank] = useState<ExamQuestion[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedQB = localStorage.getItem('dataprev_question_bank_v2');
      if (savedQB) return JSON.parse(savedQB);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [pastExams, setPastExams] = useState<PastExam[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedExams = localStorage.getItem('dataprev_past_exams_v2');
      if (savedExams) return JSON.parse(savedExams);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeDisciplines, setActiveDisciplines] = useState<Discipline[]>(() => {
    if (typeof window === 'undefined') return DATAPREV_SYLLABUS;
    try {
      const savedSyllabus = localStorage.getItem('dataprev_custom_syllabus_v2');
      if (savedSyllabus) return JSON.parse(savedSyllabus);
    } catch (e) {
      console.error(e);
    }
    return DATAPREV_SYLLABUS;
  });

  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => {
    if (typeof window === 'undefined') {
      return {
        spreadsheetId: null,
        spreadsheetUrl: null,
        lastSyncedAt: null,
        autoSync: true
      };
    }
    try {
      const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (savedConfig) return JSON.parse(savedConfig);
    } catch (e) {
      console.error(e);
    }
    return {
      spreadsheetId: null,
      spreadsheetUrl: null,
      lastSyncedAt: null,
      autoSync: true
    };
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROGRESS, JSON.stringify(topicProgressMap));
      localStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      localStorage.setItem(LOCAL_STORAGE_KEY_REVISIONS, JSON.stringify(revisions));
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(sheetsConfig));
      localStorage.setItem('dataprev_question_bank_v2', JSON.stringify(questionBank));
      localStorage.setItem('dataprev_past_exams_v2', JSON.stringify(pastExams));
      localStorage.setItem('dataprev_custom_syllabus_v2', JSON.stringify(activeDisciplines));
    } catch (e) {
      console.error('Erro ao salvar dados locais:', e);
    }
  }, [topicProgressMap, sessions, revisions, sheetsConfig, questionBank, pastExams, activeDisciplines, isLoaded]);

  // Load / Replace Custom Edital Disciplines
  const loadCustomEditalDisciplines = (newDisciplines: Discipline[]) => {
    setActiveDisciplines(newDisciplines);
    // Initialize topic progress map for new topics
    setTopicProgressMap((prevMap) => {
      const newMap = { ...prevMap };
      for (const disc of newDisciplines) {
        for (const topic of disc.topics) {
          if (!newMap[topic.id]) {
            newMap[topic.id] = {
              topicId: topic.id,
              topicCode: topic.code,
              topicTitle: topic.title,
              disciplineId: disc.id,
              disciplineName: disc.name,
              status: 'Não Iniciado',
              hoursStudiedMinutes: 0,
              questionsTotal: 0,
              questionsCorrect: 0,
              lastStudiedDate: null,
              notesCount: 0,
              confidenceRating: 0
            };
          }
        }
      }
      return newMap;
    });
  };

  const resetToDefaultSyllabus = () => {
    setActiveDisciplines(DATAPREV_SYLLABUS);
    localStorage.removeItem('dataprev_custom_syllabus_v2');
  };

  // Add questions to Question Bank
  const addQuestionsToBank = (questions: ExamQuestion[], pastExamTitle?: string, banca?: string, year?: number) => {
    setQuestionBank((prev) => [...questions, ...prev]);

    if (pastExamTitle) {
      const newExam: PastExam = {
        id: 'exam_' + Date.now(),
        title: pastExamTitle,
        banca: banca || 'Desconhecida',
        year: year || new Date().getFullYear(),
        disciplineName: questions[0]?.disciplineName || 'Geral',
        questionsCount: questions.length,
        createdAt: new Date().toISOString(),
        questions
      };
      setPastExams((prev) => [newExam, ...prev]);
    }
  };

  // Record Answer for a Question
  const answerQuestionInBank = (questionId: string, selectedOptionId: string) => {
    setQuestionBank((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const isCorrect = q.correctOptionId.toUpperCase() === selectedOptionId.toUpperCase();
          return {
            ...q,
            userAnswer: selectedOptionId,
            isCorrect,
            answeredAt: new Date().toISOString()
          };
        }
        return q;
      })
    );
  };

  // Create Google Spreadsheet
  const createGoogleSheet = async (customAccessToken?: string) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const token = customAccessToken || getStoredGoogleAccessToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'CREATE_SHEET' })
      });
      const data = await parseJsonResponse(res);
      if (!data.success) {
        throw new Error(data.error || 'Falha ao criar planilha');
      }

      const newConfig: GoogleSheetsConfig = {
        spreadsheetId: data.spreadsheetId,
        spreadsheetUrl: data.spreadsheetUrl,
        lastSyncedAt: new Date().toISOString(),
        autoSync: true
      };
      setSheetsConfig(newConfig);
      return newConfig;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Falha ao criar planilha no Google Sheets');
      setSyncError(msg);
      throw new Error(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync / Read data from connected Google Sheet
  const fetchFromGoogleSheet = useCallback(async (idToUse?: string, customAccessToken?: string) => {
    const targetId = idToUse || sheetsConfig.spreadsheetId;
    if (!targetId) return;

    setIsSyncing(true);
    setSyncError(null);
    try {
      const token = customAccessToken || getStoredGoogleAccessToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'READ_DATA', spreadsheetId: targetId })
      });
      const data = await parseJsonResponse(res);
      if (!data.success) {
        throw new Error(data.error || 'Erro ao ler dados da planilha');
      }

      if (data.topicProgressList && data.topicProgressList.length > 0) {
        setTopicProgressMap((prev) => {
          const next = { ...prev };
          data.topicProgressList.forEach((tp: TopicProgress) => {
            if (tp.topicId && next[tp.topicId]) {
              next[tp.topicId] = {
                ...next[tp.topicId],
                status: tp.status || next[tp.topicId].status,
                hoursStudiedMinutes: tp.hoursStudiedMinutes || next[tp.topicId].hoursStudiedMinutes,
                questionsTotal: tp.questionsTotal || next[tp.topicId].questionsTotal,
                questionsCorrect: tp.questionsCorrect || next[tp.topicId].questionsCorrect,
                confidenceRating: tp.confidenceRating || next[tp.topicId].confidenceRating,
                lastStudiedDate: tp.lastStudiedDate || next[tp.topicId].lastStudiedDate
              };
            }
          });
          return next;
        });
      }

      if (data.sessions && data.sessions.length > 0) {
        setSessions(data.sessions);
      }

      if (data.revisions && data.revisions.length > 0) {
        setRevisions(data.revisions);
      }

      setSheetsConfig((prev) => ({
        ...prev,
        spreadsheetId: targetId,
        lastSyncedAt: new Date().toISOString()
      }));
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Erro ao sincronizar com Google Sheets');
      setSyncError(msg);
    } finally {
      setIsSyncing(false);
    }
  }, [sheetsConfig.spreadsheetId]);

  // Update Status for a topic directly
  const updateTopicStatus = (topicId: string, newStatus: TopicStatus) => {
    setTopicProgressMap((prev) => {
      const current = prev[topicId];
      if (!current) return prev;
      return {
        ...prev,
        [topicId]: {
          ...current,
          status: newStatus
        }
      };
    });
  };

  // Add a new study session
  const addStudySession = async (sessionData: Omit<StudySession, 'id' | 'timestamp' | 'syncedToSheets'>) => {
    const id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const timestamp = new Date().toISOString();

    const newSession: StudySession = {
      ...sessionData,
      id,
      timestamp,
      syncedToSheets: false
    };

    // Calculate scheduled revisions (24h, 7d, 30d)
    const today = new Date(sessionData.date || new Date());
    const rev24hDate = new Date(today);
    rev24hDate.setDate(rev24hDate.getDate() + 1);

    const rev7dDate = new Date(today);
    rev7dDate.setDate(rev7dDate.getDate() + 7);

    const rev30dDate = new Date(today);
    rev30dDate.setDate(rev30dDate.getDate() + 30);

    const newRevisions: ScheduledRevision[] = [
      {
        id: 'rev_' + Date.now() + '_24h',
        sessionId: id,
        topicId: sessionData.topicId,
        topicCode: sessionData.topicCode,
        topicTitle: sessionData.topicTitle,
        disciplineName: sessionData.disciplineName,
        scheduledForDate: rev24hDate.toISOString().split('T')[0],
        intervalType: '24h',
        completed: false
      },
      {
        id: 'rev_' + Date.now() + '_7d',
        sessionId: id,
        topicId: sessionData.topicId,
        topicCode: sessionData.topicCode,
        topicTitle: sessionData.topicTitle,
        disciplineName: sessionData.disciplineName,
        scheduledForDate: rev7dDate.toISOString().split('T')[0],
        intervalType: '7d',
        completed: false
      },
      {
        id: 'rev_' + Date.now() + '_30d',
        sessionId: id,
        topicId: sessionData.topicId,
        topicCode: sessionData.topicCode,
        topicTitle: sessionData.topicTitle,
        disciplineName: sessionData.disciplineName,
        scheduledForDate: rev30dDate.toISOString().split('T')[0],
        intervalType: '30d',
        completed: false
      }
    ];

    // Calculate updated topic progress
    const currentProgress = topicProgressMap[sessionData.topicId] || {
      topicId: sessionData.topicId,
      topicCode: sessionData.topicCode,
      topicTitle: sessionData.topicTitle,
      disciplineId: sessionData.disciplineId,
      disciplineName: sessionData.disciplineName,
      status: 'Em Estudo',
      hoursStudiedMinutes: 0,
      questionsTotal: 0,
      questionsCorrect: 0,
      lastStudiedDate: null,
      notesCount: 0,
      confidenceRating: 0
    };

    const updatedProgress: TopicProgress = {
      ...currentProgress,
      hoursStudiedMinutes: currentProgress.hoursStudiedMinutes + sessionData.durationMinutes,
      questionsTotal: currentProgress.questionsTotal + sessionData.questionsTotal,
      questionsCorrect: currentProgress.questionsCorrect + sessionData.questionsCorrect,
      lastStudiedDate: sessionData.date,
      confidenceRating: sessionData.confidenceRating || currentProgress.confidenceRating,
      status: currentProgress.status === 'Não Iniciado' ? 'Em Estudo' : currentProgress.status
    };

    // Update Local State
    setSessions((prev) => [newSession, ...prev]);
    setRevisions((prev) => [...newRevisions, ...prev]);
    setTopicProgressMap((prev) => ({
      ...prev,
      [sessionData.topicId]: updatedProgress
    }));

    // If Google Sheets is connected, sync immediately
    if (sheetsConfig.spreadsheetId) {
      try {
        setIsSyncing(true);
        const token = getStoredGoogleAccessToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/sheets', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            action: 'APPEND_SESSION',
            spreadsheetId: sheetsConfig.spreadsheetId,
            session: newSession,
            topicProgress: updatedProgress,
            revisions: newRevisions
          })
        });
        const data = await parseJsonResponse(res);
        if (data.success) {
          setSessions((prev) =>
            prev.map((s) => (s.id === newSession.id ? { ...s, syncedToSheets: true } : s))
          );
          setSheetsConfig((prev) => ({
            ...prev,
            lastSyncedAt: new Date().toISOString()
          }));
        }
      } catch (err) {
        console.error('Erro ao sincronizar sessão com Google Sheets:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    return newSession;
  };

  // Toggle revision status
  const toggleRevisionCompleted = (revisionId: string) => {
    setRevisions((prev) =>
      prev.map((r) =>
        r.id === revisionId
          ? {
              ...r,
              completed: !r.completed,
              completedAt: !r.completed ? new Date().toISOString() : undefined
            }
          : r
      )
    );
  };

  // Calculate Overall Summary Stats
  const allTopics = getAllTopics();
  const summaryStats: StudySummaryStats = {
    totalMinutesStudied: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    totalSessions: sessions.length,
    totalQuestions: sessions.reduce((sum, s) => sum + s.questionsTotal, 0),
    totalCorrect: sessions.reduce((sum, s) => sum + s.questionsCorrect, 0),
    accuracyRate: 0,
    topicsMastered: Object.values(topicProgressMap).filter((t) => t.status === 'Dominado' || t.status === 'Concluído').length,
    topicsInProgress: Object.values(topicProgressMap).filter((t) => t.status === 'Em Estudo' || t.status === 'Revisando').length,
    topicsNotStarted: allTopics.length - Object.values(topicProgressMap).filter((t) => t.status !== 'Não Iniciado').length,
    currentStreakDays: 0
  };

  if (summaryStats.totalQuestions > 0) {
    summaryStats.accuracyRate = Math.round(
      (summaryStats.totalCorrect / summaryStats.totalQuestions) * 100
    );
  }

  // Calculate Streak
  const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort().reverse();
  if (uniqueDates.length > 0) {
    let streak = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    let checkDateStr = uniqueDates.includes(todayStr) ? todayStr : yesterdayStr;
    if (uniqueDates.includes(checkDateStr)) {
      let currentCheck = new Date(checkDateStr);
      while (true) {
        const str = currentCheck.toISOString().split('T')[0];
        if (uniqueDates.includes(str)) {
          streak++;
          currentCheck.setDate(currentCheck.getDate() - 1);
        } else {
          break;
        }
      }
    }
    summaryStats.currentStreakDays = streak;
  }

  return {
    isLoaded,
    topicProgressMap,
    sessions,
    revisions,
    sheetsConfig,
    questionBank,
    pastExams,
    activeDisciplines,
    isSyncing,
    syncError,
    summaryStats,
    updateTopicStatus,
    addStudySession,
    toggleRevisionCompleted,
    createGoogleSheet,
    fetchFromGoogleSheet,
    setSheetsConfig,
    loadCustomEditalDisciplines,
    resetToDefaultSyllabus,
    addQuestionsToBank,
    answerQuestionInBank
  };
}
