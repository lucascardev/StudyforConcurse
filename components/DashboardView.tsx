'use client';

import React from 'react';
import {
  Flame,
  Clock,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Brain,
  CalendarCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { DATAPREV_SYLLABUS } from '@/lib/dataprev-syllabus';
import {
  TopicProgress,
  StudySession,
  ScheduledRevision,
  StudySummaryStats
} from '@/lib/types';

interface DashboardViewProps {
  summaryStats: StudySummaryStats;
  topicProgressMap: Record<string, TopicProgress>;
  sessions: StudySession[];
  revisions: ScheduledRevision[];
  onNavigateTab: (tab: string) => void;
  onStartStudyTopic: (topicId: string) => void;
}

export function DashboardView({
  summaryStats,
  topicProgressMap,
  sessions,
  revisions,
  onNavigateTab,
  onStartStudyTopic
}: DashboardViewProps) {
  // Hours and minutes calculation
  const totalHours = Math.floor(summaryStats.totalMinutesStudied / 60);
  const remainingMins = summaryStats.totalMinutesStudied % 60;

  // Calculate Syllabus Completion Percentage
  const allTopicsList = DATAPREV_SYLLABUS.flatMap((d) => d.topics);
  const totalTopicsCount = allTopicsList.length;
  const startedTopicsCount = Object.values(topicProgressMap).filter(
    (t) => t.status !== 'Não Iniciado'
  ).length;
  const completedTopicsCount = Object.values(topicProgressMap).filter(
    (t) => t.status === 'Concluído' || t.status === 'Dominado'
  ).length;

  const syllabusCoveragePct = totalTopicsCount > 0
    ? Math.round((startedTopicsCount / totalTopicsCount) * 100)
    : 0;

  const syllabusMasteryPct = totalTopicsCount > 0
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  // Data for Discipline Distribution Chart
  const disciplineTimeData = DATAPREV_SYLLABUS.map((disc) => {
    const discTopics = disc.topics.map((t) => t.id);
    const discMinutes = sessions
      .filter((s) => discTopics.includes(s.topicId) || s.disciplineName === disc.name)
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      name: disc.shortName,
      fullName: disc.name,
      value: Math.round(discMinutes / 60 * 10) / 10, // hours
      minutes: discMinutes,
      color:
        disc.id === 'DESENVOLVIMENTO_SISTEMAS'
          ? '#10b981'
          : disc.id === 'BI'
          ? '#3b82f6'
          : disc.id === 'SEGURANCA'
          ? '#f43f5e'
          : disc.id === 'BANCO_DADOS'
          ? '#f59e0b'
          : '#a855f7'
    };
  });

  // Data for Discipline Questions Accuracy Chart
  const disciplineQuestionsData = DATAPREV_SYLLABUS.map((disc) => {
    const discTopics = disc.topics.map((t) => t.id);
    const discSessions = sessions.filter(
      (s) => discTopics.includes(s.topicId) || s.disciplineName === disc.name
    );

    const totalQ = discSessions.reduce((sum, s) => sum + s.questionsTotal, 0);
    const correctQ = discSessions.reduce((sum, s) => sum + s.questionsCorrect, 0);
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

    return {
      name: disc.shortName,
      total: totalQ,
      correct: correctQ,
      accuracy: accuracy
    };
  });

  // Pending Revisions due today
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingRevisionsToday = revisions.filter(
    (r) => !r.completed && r.scheduledForDate <= todayStr
  );

  return (
    <div className="space-y-8">
      {/* Top Banner & Hero Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              DATAPREV 2026 • Concurso Público
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Acompanhamento do Conteúdo Programático
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Perfil 3: Desenvolvimento de Software • Todas as suas sessões e progresso são sincronizados automaticamente em tempo real com a sua planilha do Google Sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('timer')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all text-sm"
            >
              <Clock className="w-4 h-4 text-slate-950" />
              Iniciar Estudo Agora
            </button>
            <button
              onClick={() => onNavigateTab('syllabus')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all text-sm"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Explorar Edital
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Horas Estudadas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tempo de Estudo
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {totalHours}h {remainingMins}m
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total em {summaryStats.totalSessions} sessões registradas
          </p>
        </div>

        {/* Card 2: Cobertura do Edital */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Cobertura do Edital
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {syllabusCoveragePct}%
            </span>
            <span className="text-xs text-slate-400">
              ({startedTopicsCount}/{totalTopicsCount} tópicos)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${syllabusCoveragePct}%` }}
            />
          </div>
        </div>

        {/* Card 3: Taxa de Acerto */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Acerto de Questões
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {summaryStats.accuracyRate}%
            </span>
            <span className="text-xs text-slate-400">
              ({summaryStats.totalCorrect}/{summaryStats.totalQuestions} acertos)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Média de rendimento em exercícios
          </p>
        </div>

        {/* Card 4: Sequência de Estudos */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Ofensiva (Streak)
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{summaryStats.currentStreakDays} dias</span>
            {summaryStats.currentStreakDays > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                Ativo!
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dias consecutivos estudando
          </p>
        </div>
      </div>

      {/* Discipline Progress Bars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Progresso por Disciplina do Edital</h3>
            <p className="text-xs text-slate-400">Acompanhamento das 5 grandes áreas cobradas no concurso DATAPREV</p>
          </div>
          <button
            onClick={() => onNavigateTab('syllabus')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            Ver Edital Completo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATAPREV_SYLLABUS.map((disc) => {
            const discTopics = disc.topics;
            const discTotal = discTopics.length;
            const discStarted = discTopics.filter(
              (t) => topicProgressMap[t.id]?.status && topicProgressMap[t.id].status !== 'Não Iniciado'
            ).length;
            const discMastered = discTopics.filter(
              (t) => topicProgressMap[t.id]?.status === 'Dominado' || topicProgressMap[t.id]?.status === 'Concluído'
            ).length;

            const startedPct = discTotal > 0 ? Math.round((discStarted / discTotal) * 100) : 0;
            const masteredPct = discTotal > 0 ? Math.round((discMastered / discTotal) * 100) : 0;

            const discMinutes = sessions
              .filter((s) => discTopics.some((t) => t.id === s.topicId) || s.disciplineName === disc.name)
              .reduce((sum, s) => sum + s.durationMinutes, 0);

            const discHoursFormatted = `${Math.floor(discMinutes / 60)}h ${discMinutes % 60}m`;

            return (
              <div
                key={disc.id}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${disc.badgeBg} ${disc.badgeText} border`}>
                        {disc.topics.length} Tópicos
                      </span>
                      <span className="text-xs text-slate-400">{discHoursFormatted}</span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm mt-1">{disc.name}</h4>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {startedPct}%
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Estudados: {discStarted}/{discTotal}</span>
                    <span>Dominados: {discMastered}/{discTotal}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${masteredPct}%` }}
                      title="Dominado / Concluído"
                    />
                    <div
                      className="bg-blue-500/70 h-full transition-all duration-500"
                      style={{ width: `${startedPct - masteredPct}%` }}
                      title="Em Estudo"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Time per Discipline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Distribuição do Tempo de Estudo (Horas)
            </h3>
          </div>

          {summaryStats.totalMinutesStudied > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disciplineTimeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, value }) => (value > 0 ? `${name}: ${value}h` : '')}
                  >
                    {disciplineTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                    formatter={(val: any) => [`${val} horas`, 'Tempo Estudado']}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm text-center">
              <Clock className="w-8 h-8 mb-2 opacity-40 text-emerald-400" />
              <p>Nenhuma sessão gravada ainda.</p>
              <p className="text-xs text-slate-600 mt-1">
                Inicie um cronômetro para visualizar o gráfico de horas.
              </p>
            </div>
          )}
        </div>

        {/* Chart 2: Question Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Rendimento em Exercícios por Matéria
            </h3>
          </div>

          {summaryStats.totalQuestions > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disciplineQuestionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Bar dataKey="correct" name="Acertos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" name="Total Resolvidas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm text-center">
              <Award className="w-8 h-8 mb-2 opacity-40 text-amber-400" />
              <p>Nenhuma questão resolvida registrada.</p>
              <p className="text-xs text-slate-600 mt-1">
                Ao finalizar um estudo, informe o número de acertos/erros para gerar este gráfico.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Revisions Alert Box & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Revisions Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-rose-400" />
              Revisões Pendentes Hoje
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              {pendingRevisionsToday.length}
            </span>
          </div>

          {pendingRevisionsToday.length > 0 ? (
            <div className="space-y-2.5">
              {pendingRevisionsToday.slice(0, 4).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      Revisão {rev.intervalType}
                    </span>
                    <h5 className="font-semibold text-slate-200 text-xs mt-1">{rev.topicTitle}</h5>
                    <p className="text-[11px] text-slate-400">{rev.disciplineName}</p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('revisions')}
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Concluir Revisão"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onNavigateTab('revisions')}
                className="w-full text-center text-xs text-emerald-400 hover:underline pt-1 font-medium"
              >
                Ver todas as revisões agendadas ({revisions.length})
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 opacity-80" />
              <p className="font-medium text-slate-300">Tudo em dia!</p>
              <p className="text-slate-500">Nenhuma revisão pendente para hoje.</p>
            </div>
          )}
        </div>

        {/* Recent Study Sessions */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Últimas Sessões de Estudo
            </h3>
            <button
              onClick={() => onNavigateTab('timer')}
              className="text-xs text-emerald-400 hover:underline font-medium"
            >
              Nova Sessão
            </button>
          </div>

          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 4).map((sess) => (
                <div
                  key={sess.id}
                  className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {sess.durationMinutes}m
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {sess.studyMode}
                        </span>
                        <span className="text-xs text-slate-400">{sess.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-200 text-sm mt-0.5">
                        {sess.topicCode} - {sess.topicTitle}
                      </h4>
                      <p className="text-xs text-slate-400">{sess.disciplineName}</p>
                    </div>
                  </div>

                  {sess.questionsTotal > 0 && (
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400">
                        {sess.questionsCorrect}/{sess.questionsTotal} acertos
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Math.round((sess.questionsCorrect / sess.questionsTotal) * 100)}% de precisão
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3 text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">Você ainda não registrou nenhuma sessão de estudo.</p>
              <button
                onClick={() => onNavigateTab('timer')}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 transition-colors"
              >
                Registrar Primeira Sessão
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
