'use client';

import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  FileText,
  Award,
  Star,
  BookOpen,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DATAPREV_SYLLABUS, getAllTopics } from '@/lib/dataprev-syllabus';
import { StudyMode, StudySession } from '@/lib/types';

interface StudySessionViewProps {
  initialTopicId?: string;
  onSaveSession: (sessionData: Omit<StudySession, 'id' | 'timestamp' | 'syncedToSheets'>) => Promise<unknown>;
  onFinish: () => void;
}

export function StudySessionView({
  initialTopicId,
  onSaveSession,
  onFinish
}: StudySessionViewProps) {
  const allTopics = getAllTopics();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || (allTopics.length > 0 ? allTopics[0].id : '')
  );

  const [studyMode, setStudyMode] = useState<StudyMode>('Teoria');
  const [timerType, setTimerType] = useState<'STOPWATCH' | 'POMODORO' | 'MANUAL'>('STOPWATCH');

  // Stopwatch state
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Form fields for logging completion
  const [showLogForm, setShowLogForm] = useState<boolean>(false);
  const [manualDurationMinutes, setManualDurationMinutes] = useState<number>(30);
  const [questionsTotal, setQuestionsTotal] = useState<number>(0);
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(0);
  const [confidenceRating, setConfidenceRating] = useState<number>(4);
  const [notes, setNotes] = useState<string>('');
  const [themeDetail, setThemeDetail] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const selectedTopic = allTopics.find((t) => t.id === selectedTopicId) || allTopics[0];

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const addTime = (mins: number) => {
    setSeconds((prev) => prev + mins * 60);
  };

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleFinishTimer = () => {
    setIsActive(false);
    const finalMins = Math.max(1, Math.round(seconds / 60));
    setManualDurationMinutes(finalMins);
    setShowLogForm(true);
  };

  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic) return;

    setIsSaving(true);
    try {
      const durationMins = timerType === 'MANUAL' ? Number(manualDurationMinutes) : Math.max(1, Math.round(seconds / 60));

      await onSaveSession({
        date: new Date().toISOString().split('T')[0],
        disciplineId: selectedTopic.disciplineId,
        disciplineName: selectedTopic.disciplineName,
        topicId: selectedTopic.id,
        topicCode: selectedTopic.code,
        topicTitle: selectedTopic.title,
        themeDetail,
        durationMinutes: durationMins,
        studyMode,
        questionsTotal: Number(questionsTotal),
        questionsCorrect: Number(questionsCorrect),
        confidenceRating: Number(confidenceRating),
        notes
      });

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onFinish();
    } catch (e) {
      console.error('Erro ao salvar sessão:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Timer className="w-5 h-5 text-emerald-400" />
              Sessão de Estudo & Registro no Google Sheets
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Escolha o tema do edital DATAPREV 2026, marque o tempo e registre seus rendimentos
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setTimerType('STOPWATCH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timerType === 'STOPWATCH'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cronômetro
            </button>
            <button
              onClick={() => {
                setTimerType('POMODORO');
                setSeconds(25 * 60);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timerType === 'POMODORO'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => {
                setTimerType('MANUAL');
                setShowLogForm(true);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timerType === 'MANUAL'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registro Manual
            </button>
          </div>
        </div>

        {/* Topic Selector Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Selecione o Tópico do Edital
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {DATAPREV_SYLLABUS.map((disc) => (
                <optgroup key={disc.id} label={disc.name}>
                  {disc.topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Modo de Estudo
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['Teoria', 'Questões', 'Revisão', 'Leitura de Lei/Resumo', 'Flashcards'] as StudyMode[]).map(
                (m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setStudyMode(m)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold truncate transition-colors ${
                      studyMode === m
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Selected Topic Summary Card */}
        {selectedTopic && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {selectedTopic.code}
              </span>
              <span className="text-slate-400 font-medium">{selectedTopic.disciplineName}</span>
            </div>
            <h4 className="font-bold text-slate-200 text-sm">{selectedTopic.title}</h4>
            <p className="text-slate-400 line-clamp-2">{selectedTopic.description}</p>
          </div>
        )}

        {/* Timer Display (If not purely manual) */}
        {timerType !== 'MANUAL' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6 bg-slate-950/80 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="text-5xl sm:text-7xl font-mono font-extrabold text-white tracking-widest drop-shadow-md">
              {formatTimer(seconds)}
            </div>

            {/* Quick Time Add Buttons */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => addTime(5)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                +5 min
              </button>
              <button
                onClick={() => addTime(15)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                +15 min
              </button>
              <button
                onClick={() => addTime(25)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
              >
                +25 min
              </button>
            </div>

            {/* Main Action Controls */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleStartPause}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-all ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-slate-950" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-slate-950" />
                    Iniciar
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Reiniciar Tempo"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {seconds > 0 && (
                <button
                  onClick={handleFinishTimer}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/30 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Concluir Sessão
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completion Log Form */}
        {(showLogForm || timerType === 'MANUAL') && (
          <form onSubmit={handleSubmitSession} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-emerald-400" />
              Detalhes do Registro de Estudo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tempo Estudado (Minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  value={manualDurationMinutes}
                  onChange={(e) => setManualDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Questões Resolvidas
                </label>
                <input
                  type="number"
                  min="0"
                  value={questionsTotal}
                  onChange={(e) => setQuestionsTotal(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Acertos
                </label>
                <input
                  type="number"
                  min="0"
                  max={questionsTotal}
                  value={questionsCorrect}
                  onChange={(e) => setQuestionsCorrect(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Subtheme detail */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subtema / Tópico Específico (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Spring Security, Normas ISO 27002, TDD e Mocking..."
                value={themeDetail}
                onChange={(e) => setThemeDetail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Confidence Rating Stars */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Nível de Confiança / Domínio (1 a 5 estrelas)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setConfidenceRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= confidenceRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 font-medium ml-2">
                  {confidenceRating === 5
                    ? 'Dominado!'
                    : confidenceRating === 4
                    ? 'Bom entendimento'
                    : confidenceRating === 3
                    ? 'Compreensão média'
                    : 'Necessita revisão'}
                </span>
              </div>
            </div>

            {/* Notes / Key takeaways */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Anotações e Mnemônicos
              </label>
              <textarea
                rows={3}
                placeholder="Escreva pontos chaves, fórmulas, pegadinhas da banca Cebraspe/FGV observadas durante o estudo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando e Sincronizando com Google Sheets...' : 'Salvar e Agendar Revisões Automaticamente'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
