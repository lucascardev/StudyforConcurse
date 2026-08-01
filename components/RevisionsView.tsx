'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { ScheduledRevision, TopicProgress } from '@/lib/types';

interface RevisionsViewProps {
  revisions: ScheduledRevision[];
  onToggleRevision: (revisionId: string) => void;
  onNavigateTab: (tab: string) => void;
  onAskAiForTopic: (topicTitle: string, disciplineName: string) => void;
}

export function RevisionsView({
  revisions,
  onToggleRevision,
  onNavigateTab,
  onAskAiForTopic
}: RevisionsViewProps) {
  const [filterMode, setFilterMode] = useState<'PENDING' | 'COMPLETED' | 'ALL'>('PENDING');

  const todayStr = new Date().toISOString().split('T')[0];

  const pendingRevisions = revisions.filter((r) => !r.completed);
  const completedRevisions = revisions.filter((r) => r.completed);

  const dueTodayCount = pendingRevisions.filter((r) => r.scheduledForDate <= todayStr).length;

  let displayedRevisions = revisions;
  if (filterMode === 'PENDING') {
    displayedRevisions = pendingRevisions;
  } else if (filterMode === 'COMPLETED') {
    displayedRevisions = completedRevisions;
  }

  // Sort by date
  displayedRevisions = [...displayedRevisions].sort(
    (a, b) => new Date(a.scheduledForDate).getTime() - new Date(b.scheduledForDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <CalendarCheck className="w-3.5 h-3.5" />
              Repetição Espaçada
            </div>
            <h2 className="text-xl font-bold text-white">Cronograma de Revisões Inteligentes</h2>
            <p className="text-xs text-slate-400 mt-1">
              Ciclos automatizados de 24 horas, 7 dias e 30 dias gerados a cada sessão de estudo realizada.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="block text-xs text-slate-400">Pendentes Hoje</span>
              <span className="text-lg font-bold text-rose-400">{dueTodayCount}</span>
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="block text-xs text-slate-400">Concluídas</span>
              <span className="text-lg font-bold text-emerald-400">{completedRevisions.length}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => setFilterMode('PENDING')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'PENDING'
                ? 'bg-rose-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pendentes ({pendingRevisions.length})
          </button>
          <button
            onClick={() => setFilterMode('COMPLETED')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'COMPLETED'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Concluídas ({completedRevisions.length})
          </button>
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'ALL'
                ? 'bg-slate-700 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todas ({revisions.length})
          </button>
        </div>
      </div>

      {/* Revisions List */}
      <div className="space-y-3">
        {displayedRevisions.length > 0 ? (
          displayedRevisions.map((rev) => {
            const isDue = !rev.completed && rev.scheduledForDate <= todayStr;

            return (
              <div
                key={rev.id}
                className={`bg-slate-900 border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  rev.completed
                    ? 'border-slate-800/60 opacity-75'
                    : isDue
                    ? 'border-rose-500/40 bg-rose-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleRevision(rev.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      rev.completed
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : isDue
                        ? 'border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        : 'border-slate-700 bg-slate-950 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {rev.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {rev.topicCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          rev.intervalType === '24h'
                            ? 'bg-blue-500/20 text-blue-300'
                            : rev.intervalType === '7d'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        Ciclo {rev.intervalType}
                      </span>

                      {isDue && !rev.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Para Hoje!
                        </span>
                      )}
                    </div>

                    <h4 className={`font-bold text-sm ${rev.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {rev.topicTitle}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{rev.disciplineName}</span>
                      <span>•</span>
                      <span>Data Agendada: {rev.scheduledForDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onAskAiForTopic(rev.topicTitle, rev.disciplineName)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Flashcards IA</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
            <h3 className="text-base font-bold text-slate-200">Nenhuma revisão encontrada nesta categoria</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Ao registrar sessões de estudo no cronômetro, os ciclos de 24h, 7 dias e 30 dias serão inseridos automaticamente aqui e na sua planilha do Google Sheets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
