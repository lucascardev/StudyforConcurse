'use client';

import React, { useState } from 'react';
import { parseJsonResponse } from '@/lib/utils';
import {
  Bot,
  Sparkles,
  BookOpen,
  FileQuestion,
  Layers,
  Send,
  Loader2,
  Copy,
  Check,
  Brain,
  HelpCircle
} from 'lucide-react';
import { DATAPREV_SYLLABUS, getAllTopics } from '@/lib/dataprev-syllabus';

interface AiAssistantViewProps {
  initialTopicTitle?: string;
  initialDisciplineName?: string;
  initialMode?: string;
}

export function AiAssistantView({
  initialTopicTitle,
  initialDisciplineName,
  initialMode
}: AiAssistantViewProps) {
  const allTopics = getAllTopics();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicTitle
      ? allTopics.find((t) => t.title.toLowerCase().includes(initialTopicTitle.toLowerCase()))?.id || allTopics[0].id
      : allTopics[0].id
  );

  const [mode, setMode] = useState<string>(initialMode || 'EXPLAIN');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedTopic = allTopics.find((t) => t.id === selectedTopicId) || allTopics[0];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          topicTitle: selectedTopic.title,
          disciplineName: selectedTopic.disciplineName,
          subtopics: selectedTopic.subtopics,
          userPrompt
        })
      });

      const data = await parseJsonResponse(res);
      if (!data.success) {
        throw new Error(data.error || 'Erro na resposta do modelo');
      }

      setAiResponse(data.text);
    } catch (err: unknown) {
      const error = err as Error;
      setAiResponse(`⚠️ Erro ao consultar Tutor IA: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Tutor de Inteligência Artificial • DATAPREV 2026
            </h2>
            <p className="text-xs text-slate-400">
              Gere resumos, questões inéditas comentadas, mnemônicos e tire dúvidas específicas sobre o edital
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
          {[
            { id: 'EXPLAIN', label: 'Resumo para Concurso', icon: BookOpen },
            { id: 'QUIZ', label: 'Questões Inéditas', icon: FileQuestion },
            { id: 'FLASHCARDS', label: 'Flashcards', icon: Layers },
            { id: 'ASK', label: 'Tirar Dúvida Direta', icon: HelpCircle }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
        {/* Topic Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Selecione o Tópico do Edital
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
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

        {/* Freeform Prompt if ASK mode */}
        {mode === 'ASK' && (
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Sua Pergunta ou Dúvida Específica
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Qual a diferença prática entre ITIL v4 e COBIT 2019 na visão da banca? Ou: Explique como funciona o padrão Saga para transações distribuídas..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gerando Conteúdo com Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                {mode === 'EXPLAIN'
                  ? 'Gerar Resumo do Tópico'
                  : mode === 'QUIZ'
                  ? 'Gerar Questões com Gabarito'
                  : mode === 'FLASHCARDS'
                  ? 'Gerar Flashcards'
                  : 'Consultar Tutor IA'}
              </span>
            </>
          )}
        </button>
      </form>

      {/* AI Output Result Box */}
      {aiResponse && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>Resposta Gerada pelo Tutor IA</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar Resposta</span>
                </>
              )}
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
            {aiResponse}
          </div>
        </div>
      )}
    </div>
  );
}
