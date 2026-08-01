'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Play,
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Award,
  BarChart2
} from 'lucide-react';
import { DATAPREV_SYLLABUS, SyllabusTopic, Discipline } from '@/lib/dataprev-syllabus';
import { TopicProgress, TopicStatus } from '@/lib/types';

interface SyllabusViewProps {
  topicProgressMap: Record<string, TopicProgress>;
  activeDisciplines?: Discipline[];
  onUpdateStatus: (topicId: string, status: TopicStatus) => void;
  onStartStudyTopic: (topicId: string) => void;
  onAskAiForTopic: (topic: SyllabusTopic, mode: string) => void;
}

export function SyllabusView({
  topicProgressMap,
  activeDisciplines = DATAPREV_SYLLABUS,
  onUpdateStatus,
  onStartStudyTopic,
  onAskAiForTopic
}: SyllabusViewProps) {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopicIds, setExpandedTopicIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (topicId: string) => {
    setExpandedTopicIds((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Filter topics
  const allDisciplines = activeDisciplines;
  let filteredDisciplines = allDisciplines;

  if (selectedDisciplineId !== 'ALL') {
    filteredDisciplines = allDisciplines.filter((d) => d.id === selectedDisciplineId);
  }

  const getTopicProgress = (topicId: string): TopicProgress => {
    return (
      topicProgressMap[topicId] || {
        topicId,
        topicCode: '',
        topicTitle: '',
        disciplineId: '',
        disciplineName: '',
        status: 'Não Iniciado',
        hoursStudiedMinutes: 0,
        questionsTotal: 0,
        questionsCorrect: 0,
        lastStudiedDate: null,
        notesCount: 0,
        confidenceRating: 0
      }
    );
  };

  const statusOptions: { value: TopicStatus; label: string; color: string }[] = [
    { value: 'Não Iniciado', label: 'Não Iniciado', color: 'bg-slate-800 text-slate-400 border-slate-700' },
    { value: 'Em Estudo', label: 'Em Estudo', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { value: 'Revisando', label: 'Revisando', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { value: 'Concluído', label: 'Concluído', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { value: 'Dominado', label: 'Dominado', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Conteúdo Programático Oficial (Edital DATAPREV 2026)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Perfil 3: Desenvolvimento de Software • Selecione temas, altere status e inicie sessões de estudo
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por tópico, tecnologia (ex: Java, SonarQube, COBIT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-800">
          {/* Discipline Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
            <button
              onClick={() => setSelectedDisciplineId('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDisciplineId === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas as Matérias
            </button>
            {allDisciplines.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDisciplineId(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedDisciplineId === d.id
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {d.shortName}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Todos os Status</option>
              <option value="Não Iniciado">Não Iniciados</option>
              <option value="Em Estudo">Em Estudo</option>
              <option value="Revisando">Revisando</option>
              <option value="Concluído">Concluídos</option>
              <option value="Dominado">Dominados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disciplines & Topics List */}
      <div className="space-y-8">
        {filteredDisciplines.map((discipline) => {
          // Filter topics within discipline based on query and status filter
          const matchedTopics = discipline.topics.filter((topic) => {
            const progress = getTopicProgress(topic.id);
            if (selectedStatusFilter !== 'ALL' && progress.status !== selectedStatusFilter) {
              return false;
            }
            if (searchQuery.trim() !== '') {
              const q = searchQuery.toLowerCase();
              const inTitle = topic.title.toLowerCase().includes(q);
              const inCode = topic.code.toLowerCase().includes(q);
              const inSubtopics = topic.subtopics.some((st) => st.toLowerCase().includes(q));
              const inKey = topic.keyTopics.some((kt) => kt.toLowerCase().includes(q));
              return inTitle || inCode || inSubtopics || inKey;
            }
            return true;
          });

          if (matchedTopics.length === 0) return null;

          return (
            <div key={discipline.id} className="space-y-4">
              {/* Discipline Section Header */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${discipline.badgeBg} ${discipline.badgeText} border`}>
                    {discipline.shortName}
                  </span>
                  <h3 className="font-bold text-slate-100 text-base">{discipline.name}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {matchedTopics.length} tópicos
                </span>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 gap-4">
                {matchedTopics.map((topic) => {
                  const progress = getTopicProgress(topic.id);
                  const isExpanded = !!expandedTopicIds[topic.id];

                  const hoursVal = Math.floor(progress.hoursStudiedMinutes / 60);
                  const minsVal = progress.hoursStudiedMinutes % 60;
                  const timeFormatted = `${hoursVal}h ${minsVal}m`;

                  return (
                    <div
                      key={topic.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm transition-all space-y-4"
                    >
                      {/* Top Row: Code, Title, Status & Actions */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                              {topic.code}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              topic.importance === 'Alta'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              Relevância: {topic.importance}
                            </span>

                            {progress.hoursStudiedMinutes > 0 && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                {timeFormatted} estudados
                              </span>
                            )}

                            {progress.questionsTotal > 0 && (
                              <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                                <Award className="w-3.5 h-3.5" />
                                {progress.questionsCorrect}/{progress.questionsTotal} acertos ({Math.round((progress.questionsCorrect / progress.questionsTotal) * 100)}%)
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-slate-100 text-base leading-snug">
                            {topic.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{topic.description}</p>
                        </div>

                        {/* Status Select & Direct Buttons */}
                        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                          {/* Status Dropdown */}
                          <select
                            value={progress.status}
                            onChange={(e) => onUpdateStatus(topic.id, e.target.value as TopicStatus)}
                            className="bg-slate-950 border border-slate-700 text-xs font-semibold rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {/* Launch Timer Button */}
                          <button
                            onClick={() => onStartStudyTopic(topic.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                            <span>Estudar</span>
                          </button>

                          {/* AI Tutor Quick Button */}
                          <button
                            onClick={() => onAskAiForTopic(topic, 'EXPLAIN')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-medium text-xs transition-colors"
                            title="Gerar Resumo do Edital com IA"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Resumo IA</span>
                          </button>
                        </div>
                      </div>

                      {/* Subtopics Accordion Toggle */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => toggleExpand(topic.id)}
                          className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors font-medium"
                        >
                          <span>Subtemas do Edital ({topic.subtopics.length} itens detalhados)</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
                            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                              Conteúdo Específico
                            </h5>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                              {topic.subtopics.map((sub, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                                  <span>{sub}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Key Tag Badges */}
                            <div className="flex items-center gap-1.5 flex-wrap pt-2">
                              <span className="text-[11px] text-slate-500 font-medium">Palavras-chave:</span>
                              {topic.keyTopics.map((kt, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                                >
                                  #{kt}
                                </span>
                              ))}
                            </div>

                            {/* Quick AI Quiz Launcher */}
                            <div className="pt-2 flex items-center gap-2">
                              <button
                                onClick={() => onAskAiForTopic(topic, 'QUIZ')}
                                className="text-xs text-purple-300 hover:text-purple-200 font-medium flex items-center gap-1 underline underline-offset-2"
                              >
                                <Bot className="w-3.5 h-3.5" />
                                Gerar Questões Inéditas DATAPREV para este tópico
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
