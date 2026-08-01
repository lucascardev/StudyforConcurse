'use client';

import React, { useState } from 'react';
import { parseJsonResponse } from '@/lib/utils';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  BookOpen, 
  Plus, 
  Trash2, 
  Sliders,
  Download,
  Check
} from 'lucide-react';
import { Discipline } from '@/lib/dataprev-syllabus';

interface EditalImportViewProps {
  activeDisciplines: Discipline[];
  onLoadCustomDisciplines: (disciplines: Discipline[]) => void;
  onResetToDefault: () => void;
}

export function EditalImportView({
  activeDisciplines,
  onLoadCustomDisciplines,
  onResetToDefault
}: EditalImportViewProps) {
  const [editalText, setEditalText] = useState('');
  const [banca, setBanca] = useState('CEBRASPE');
  const [cargo, setCargo] = useState('Analista de Tecnologia da Informação');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedDisciplines, setParsedDisciplines] = useState<Discipline[] | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const sampleEdital = `LÍNGUA PORTUGUESA: 1 Compreensão e interpretação de textos. 2 Tipologia e gêneros textuais. 3 Acentuação gráfica. 4 Sintaxe de concordância e regência. 5 Crase.
RACIOCÍNIO LÓGICO-MATEMÁTICO: 1 Lógica proposicional e tabelas-verdade. 2 Equivalências lógicas e negações. 3 Análise combinatória e probabilidade.
LEGISLAÇÃO E ÉTICA: 1 Lei Geral de Proteção de Dados (Lei 13.709/2018). 2 Lei de Acesso à Informação (Lei 12.527/2011). 3 Código de Ética do Servidor Público.
DESENVOLVIMENTO DE SISTEMAS: 1 Linguagens Java, Spring Boot e REST APIs. 2 Arquitetura de Microsserviços e Docker. 3 Testes de Software e TDD. 4 Bancos de Dados SQL e NoSQL.`;

  const handleParseEdital = async () => {
    if (!editalText.trim()) {
      setErrorMsg('Por favor, cole o texto do edital para extração.');
      return;
    }

    setIsParsing(true);
    setErrorMsg(null);
    setParsedDisciplines(null);
    setAppliedSuccess(false);

    try {
      const res = await fetch('/api/gemini/parse-edital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editalText, banca, cargo })
      });

      const data = await parseJsonResponse(res);
      if (!data.success) {
        throw new Error(data.error || 'Erro ao processar edital com IA.');
      }

      if (data.data?.disciplines && Array.isArray(data.data.disciplines)) {
        setParsedDisciplines(data.data.disciplines);
      } else {
        throw new Error('A IA não retornou uma lista válida de disciplinas.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Erro ao comunicar com a IA do Gemini.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleApplyEdital = () => {
    if (parsedDisciplines && parsedDisciplines.length > 0) {
      onLoadCustomDisciplines(parsedDisciplines);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - High Density Slate & Indigo */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Algoritmo Reutilizável de Extração de Edital</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Importador & Extrator de Edital com IA
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Cole o texto de qualquer edital (Português, Raciocínio Lógico, Direito, TI, etc.) para que a IA estruture automaticamente as disciplinas e tópicos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              title="Restaurar edital padrão DATAPREV 2026 com Conhecimentos Básicos e Específicos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Edital Padrão</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Colar Conteúdo Programático do Edital</span>
              </h2>

              <button
                onClick={() => setEditalText(sampleEdital)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
              >
                <span>Usar Exemplo de Edital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banca Examinadora
                </label>
                <select
                  value={banca}
                  onChange={(e) => setBanca(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="CEBRASPE">CEBRASPE / CESPE</option>
                  <option value="FGV">FGV (Fundação Getulio Vargas)</option>
                  <option value="FCC">FCC (Fundação Carlos Chagas)</option>
                  <option value="IBFC">IBFC</option>
                  <option value="VUNESP">VUNESP</option>
                  <option value="IADES">IADES</option>
                  <option value="OUTRA">Outra Banca / Genérico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cargo / Especialidade
                </label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Analista de TI, Agente, Fiscal..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Texto Bruto do Edital (Conteúdo Programático Completo)
              </label>
              <textarea
                value={editalText}
                onChange={(e) => setEditalText(e.target.value)}
                rows={10}
                placeholder="Cole aqui todo o texto do edital. Exemplo:&#10;LÍNGUA PORTUGUESA: 1 Compreensão de texto. 2 Ortografia...&#10;RACIOCÍNIO LÓGICO: 1 Tabela verdade..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg p-3 font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleParseEdital}
                disabled={isParsing || !editalText.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Analisando e Extraindo Edital com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>Analisar e Estruturar Edital com IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parsed Preview or Active Disciplines (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>
                  {parsedDisciplines ? 'Resultado da Extração pela IA' : 'Disciplinas Atuais Ativas'}
                </span>
              </h2>

              <span className="text-xs font-medium text-slate-500">
                {parsedDisciplines ? parsedDisciplines.length : activeDisciplines.length} Disciplinas
              </span>
            </div>

            {appliedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Edital personalizado aplicado com sucesso ao seu cronograma!</span>
              </div>
            )}

            {parsedDisciplines ? (
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-xs text-indigo-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Estrutura Extraída com Sucesso!</span>
                    <span>Verifique as disciplinas abaixo e clique em &quot;Aplicar este Edital&quot; para substituir seu cronograma.</span>
                  </div>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {parsedDisciplines.map((disc, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{disc.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {disc.topics.length} Tópicos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{disc.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {disc.topics.slice(0, 4).map((t, tidx) => (
                          <span key={tidx} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                            {t.code}: {t.title}
                          </span>
                        ))}
                        {disc.topics.length > 4 && (
                          <span className="text-[10px] text-slate-500 font-medium self-center">
                            +{disc.topics.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleApplyEdital}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar Este Edital ao Meu Cronograma</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Disciplinas atualmente carregadas no seu sistema (suporta Português, Raciocínio Lógico, Legislação, TI e editais personalizados):
                </p>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {activeDisciplines.map((disc) => (
                    <div key={disc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{disc.name}</div>
                        <div className="text-[11px] text-slate-500">{disc.topics.length} tópicos estruturados</div>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${disc.badgeBg} ${disc.badgeText}`}>
                        {disc.shortName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
