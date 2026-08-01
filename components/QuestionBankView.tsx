'use client';

import React, { useState } from 'react';
import { parseJsonResponse } from '@/lib/utils';
import {
  HelpCircle,
  FileSpreadsheet,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  Award,
  BookOpen,
  Send,
  Layers,
  ChevronRight,
  BrainCircuit,
  Database
} from 'lucide-react';
import { ExamQuestion, PastExam } from '@/lib/types';
import { Discipline } from '@/lib/dataprev-syllabus';

interface QuestionBankViewProps {
  questionBank: ExamQuestion[];
  pastExams: PastExam[];
  activeDisciplines: Discipline[];
  onAddQuestions: (questions: ExamQuestion[], pastExamTitle?: string, banca?: string, year?: number) => void;
  onAnswerQuestion: (questionId: string, selectedOptionId: string) => void;
}

export function QuestionBankView({
  questionBank,
  pastExams,
  activeDisciplines,
  onAddQuestions,
  onAnswerQuestion
}: QuestionBankViewProps) {
  const [activeTab, setActiveTab] = useState<'solve' | 'extract' | 'generate' | 'exams'>('solve');

  // Filters for Solver
  const [filterBanca, setFilterBanca] = useState<string>('TODAS');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('TODAS');
  const [filterStatus, setFilterStatus] = useState<'TODAS' | 'NAO_RESPONDIDAS' | 'ERRADAS'>('TODAS');

  // State for Solver
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // State for Extracting Past Exam
  const [extractExamText, setExtractExamText] = useState('');
  const [extractTitle, setExtractTitle] = useState('Prova DATAPREV 2023 - Analista de TI');
  const [extractBanca, setExtractBanca] = useState('CEBRASPE');
  const [extractYear, setExtractYear] = useState(2023);
  const [extractDiscipline, setExtractDiscipline] = useState('Desenvolvimento de Sistemas');
  const [extractCount, setExtractCount] = useState(3);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null);

  // State for Generating Inédita
  const [genBanca, setGenBanca] = useState('CEBRASPE');
  const [genDiscipline, setGenDiscipline] = useState('Língua Portuguesa');
  const [genTopic, setGenTopic] = useState('Compreensão e Interpretação de Textos');
  const [genCount, setGenCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccessMsg, setGenSuccessMsg] = useState<string | null>(null);

  // Filter questions for practice
  const filteredQuestions = questionBank.filter((q) => {
    if (filterBanca !== 'TODAS' && q.banca.toUpperCase() !== filterBanca.toUpperCase()) return false;
    if (filterDiscipline !== 'TODAS' && q.disciplineName !== filterDiscipline) return false;
    if (filterStatus === 'NAO_RESPONDIDAS' && q.userAnswer) return false;
    if (filterStatus === 'ERRADAS' && q.isCorrect !== false) return false;
    return true;
  });

  // Calculate stats
  const answeredCount = questionBank.filter((q) => q.userAnswer).length;
  const correctCount = questionBank.filter((q) => q.isCorrect === true).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleConfirmAnswer = (questionId: string) => {
    const selectedOpt = selectedAnswers[questionId];
    if (!selectedOpt) return;
    onAnswerQuestion(questionId, selectedOpt);
    setRevealedExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  // Extract Questions Handler
  const handleExtractFromExam = async () => {
    if (!extractExamText.trim()) {
      setExtractError('Cole o texto da prova passada para extração.');
      return;
    }

    setIsExtracting(true);
    setExtractError(null);
    setExtractSuccessMsg(null);

    try {
      const res = await fetch('/api/gemini/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'EXTRACT_FROM_TEXT',
          examText: extractExamText,
          banca: extractBanca,
          year: extractYear,
          disciplineName: extractDiscipline,
          questionCount: extractCount
        })
      });

      const data = await parseJsonResponse(res);
      if (!data.success) {
        throw new Error(data.error || 'Erro ao extrair questões da prova.');
      }

      if (data.questions && data.questions.length > 0) {
        onAddQuestions(data.questions, extractTitle, extractBanca, extractYear);
        setExtractSuccessMsg(`${data.questions.length} questões extraídas com sucesso e salvas no seu Banco de Questões!`);
        setExtractExamText('');
      } else {
        throw new Error('Nenhuma questão pôde ser identificada no texto fornecido.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setExtractError(error.message || 'Erro de comunicação com o servidor.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Generate Inéditas Handler
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setGenError(null);
    setGenSuccessMsg(null);

    try {
      const res = await fetch('/api/gemini/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'GENERATE_INEDITA',
          banca: genBanca,
          disciplineName: genDiscipline,
          topicTitle: genTopic,
          questionCount: genCount
        })
      });

      const data = await parseJsonResponse(res);
      if (!data.success) {
        throw new Error(data.error || 'Erro ao gerar questões inéditas com IA.');
      }

      if (data.questions && data.questions.length > 0) {
        onAddQuestions(data.questions, `Questões Inéditas ${genBanca} - ${genDiscipline}`, genBanca, 2026);
        setGenSuccessMsg(`${data.questions.length} questões inéditas no estilo ${genBanca} geradas com sucesso!`);
      } else {
        throw new Error('Não foi possível gerar questões para este tópico.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setGenError(error.message || 'Erro de comunicação com o servidor.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Banco de Questões & Extração da Banca</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Questões de Provas Passadas & Inéditas da Banca
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Treine com questões de Português, Raciocínio Lógico, Legislação e TI de bancas renomadas (CEBRASPE, FGV, IBFC, FCC).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500">Taxa de Acerto</span>
              <span className="text-2xl font-black text-indigo-600">{accuracy}%</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500">Respondidas</span>
              <span className="text-2xl font-black text-slate-800">{answeredCount}/{questionBank.length}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('solve')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'solve'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Praticar Questões ({filteredQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('extract')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'extract'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Extrair de Prova Passada</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Gerar Questões Inéditas com IA</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'exams'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Provas Cadastradas ({pastExams.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SOLVER / PRATICAR */}
      {activeTab === 'solve' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Banca
              </label>
              <select
                value={filterBanca}
                onChange={(e) => setFilterBanca(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="TODAS">Todas as Bancas</option>
                <option value="CEBRASPE">CEBRASPE / CESPE</option>
                <option value="FGV">FGV</option>
                <option value="FCC">FCC</option>
                <option value="IBFC">IBFC</option>
                <option value="VUNESP">VUNESP</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Disciplina
              </label>
              <select
                value={filterDiscipline}
                onChange={(e) => setFilterDiscipline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="TODAS">Todas as Disciplinas</option>
                {activeDisciplines.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Filtro de Resposta
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="TODAS">Todas as Questões</option>
                <option value="NAO_RESPONDIDAS">Apenas Não Respondidas</option>
                <option value="ERRADAS">Apenas Incorretas</option>
              </select>
            </div>
          </div>

          {/* Question List */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Nenhuma questão encontrada para este filtro</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Adicione questões de provas passadas na aba &quot;Extrair de Prova Passada&quot; ou gere questões inéditas com IA na aba ao lado!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const currentAnswer = selectedAnswers[q.id] || q.userAnswer || '';
                const isAnswered = Boolean(q.userAnswer);
                const isExplanationVisible = revealedExplanations[q.id] || isAnswered;

                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Questão #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {q.banca}
                        </span>
                        {q.year && (
                          <span className="text-xs text-slate-500 font-medium">Ano: {q.year}</span>
                        )}
                        <span className="text-xs font-medium text-slate-600">
                          • {q.disciplineName}
                        </span>
                      </div>

                      {q.userAnswer && (
                        <div>
                          {q.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Acertou
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" />
                              Incorreta
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Enunciado */}
                    <div className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {q.statement}
                    </div>

                    {/* Alternatives */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt) => {
                        const isSelected = currentAnswer.toUpperCase() === opt.id.toUpperCase();
                        const isCorrectOption = q.correctOptionId.toUpperCase() === opt.id.toUpperCase();

                        let buttonStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

                        if (isExplanationVisible) {
                          if (isCorrectOption) {
                            buttonStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                          } else if (isSelected && !q.isCorrect) {
                            buttonStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                          } else {
                            buttonStyle = 'bg-slate-50 border-slate-200 opacity-60 text-slate-600';
                          }
                        } else if (isSelected) {
                          buttonStyle = 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold';
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(q.id, opt.id)}
                            className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${buttonStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {opt.id}
                            </span>
                            <span className="leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Action buttons */}
                    {!isAnswered && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleConfirmAnswer(q.id)}
                          disabled={!selectedAnswers[q.id]}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Responder e Ver Gabarito</span>
                        </button>
                      </div>
                    )}

                    {/* Gabarito Comentado */}
                    {isExplanationVisible && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                          <BrainCircuit className="w-4 h-4 text-indigo-600" />
                          <span>Gabarito Comentado (Resposta Correta: {q.correctOptionId})</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed pt-1">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXTRAIR DE PROVA PASSADA */}
      {activeTab === 'extract' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span>Extração Inteligente de Provas Passadas da Banca</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cole o texto transcrito ou PDF de uma prova antiga para que a IA extraia as questões e crie os gabaritos automaticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Prova</label>
              <input
                type="text"
                value={extractTitle}
                onChange={(e) => setExtractTitle(e.target.value)}
                placeholder="Ex: Prova DATAPREV 2023"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banca</label>
              <select
                value={extractBanca}
                onChange={(e) => setExtractBanca(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CEBRASPE">CEBRASPE / CESPE</option>
                <option value="FGV">FGV</option>
                <option value="FCC">FCC</option>
                <option value="IBFC">IBFC</option>
                <option value="VUNESP">VUNESP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ano</label>
              <input
                type="number"
                value={extractYear}
                onChange={(e) => setExtractYear(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qtd. Questões</label>
              <input
                type="number"
                min={1}
                max={10}
                value={extractCount}
                onChange={(e) => setExtractCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disciplina
            </label>
            <select
              value={extractDiscipline}
              onChange={(e) => setExtractDiscipline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {activeDisciplines.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Texto da Prova Passada / Transcrição
            </label>
            <textarea
              value={extractExamText}
              onChange={(e) => setExtractExamText(e.target.value)}
              rows={8}
              placeholder="Cole aqui o trecho da prova passada com os enunciados e alternativas..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-3 font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {extractError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{extractError}</span>
            </div>
          )}

          {extractSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{extractSuccessMsg}</span>
            </div>
          )}

          <button
            onClick={handleExtractFromExam}
            disabled={isExtracting || !extractExamText.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Extraindo e Formatando Questões com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Extrair Questões para o Banco de Dados</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* TAB 3: GERAR QUESTÕES INÉDITAS COM IA */}
      {activeTab === 'generate' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Gerador de Questões Inéditas por Banca</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Crie questões exclusivas no perfil exato da banca desejada (CEBRASPE Certo/Errado ou FGV Múltipla Escolha) para testar seu domínio do edital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Banca Estilo</label>
              <select
                value={genBanca}
                onChange={(e) => setGenBanca(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CEBRASPE">CEBRASPE / CESPE (Certo/Errado)</option>
                <option value="FGV">FGV (Múltipla Escolha A-E)</option>
                <option value="FCC">FCC (Múltipla Escolha A-E)</option>
                <option value="IBFC">IBFC (Múltipla Escolha A-E)</option>
                <option value="VUNESP">VUNESP (Múltipla Escolha A-E)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Disciplina</label>
              <select
                value={genDiscipline}
                onChange={(e) => setGenDiscipline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {activeDisciplines.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade</label>
              <input
                type="number"
                min={1}
                max={5}
                value={genCount}
                onChange={(e) => setGenCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tópico Específico do Edital
            </label>
            <input
              type="text"
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              placeholder="Ex: Tabela Verdade, Equilíbrio Lógico, Spring Boot, LGPD, Crase..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {genError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{genError}</span>
            </div>
          )}

          {genSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{genSuccessMsg}</span>
            </div>
          )}

          <button
            onClick={handleGenerateQuestions}
            disabled={isGenerating || !genTopic.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Elaborando Questões Inéditas com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Gerar {genCount} Questões Inéditas Agora</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* TAB 4: PROVAS PASSADAS CADASTRADAS */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {pastExams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Nenhuma prova passada salva ainda</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Utilize a aba &quot;Extrair de Prova Passada&quot; para importar arquivos e cadernos de provas anteriores da banca!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastExams.map((exam) => (
                <div key={exam.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{exam.title}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">{exam.disciplineName}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {exam.banca} • {exam.year}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <span>{exam.questionsCount} Questões Extraídas</span>
                    <button
                      onClick={() => {
                        setFilterBanca(exam.banca);
                        setActiveTab('solve');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Treinar Esta Prova</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
