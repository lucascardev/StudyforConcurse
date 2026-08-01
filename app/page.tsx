'use client';

import React, { useState } from 'react';
import { useStudyTracker } from '@/lib/useStudyTracker';
import { Header } from '@/components/Header';
import { SheetsSyncBanner } from '@/components/SheetsSyncBanner';
import { DashboardView } from '@/components/DashboardView';
import { SyllabusView } from '@/components/SyllabusView';
import { StudySessionView } from '@/components/StudySessionView';
import { RevisionsView } from '@/components/RevisionsView';
import { AiAssistantView } from '@/components/AiAssistantView';
import { SheetsManagerView } from '@/components/SheetsManagerView';
import { EditalImportView } from '@/components/EditalImportView';
import { QuestionBankView } from '@/components/QuestionBankView';
import { MandatorySheetRequirementModal } from '@/components/MandatorySheetRequirementModal';
import { SyllabusTopic } from '@/lib/dataprev-syllabus';

export default function HomePage() {
  const {
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
  } = useStudyTracker();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTopicForStudyId, setSelectedTopicForStudyId] = useState<string | undefined>(undefined);

  // Mandatory Sheet Requirement Modal state
  const [hasDismissedModal, setHasDismissedModal] = useState<boolean>(false);

  // Derived state: open modal when loaded, no spreadsheet is configured, and not dismissed
  const isMandatoryModalOpen = Boolean(isLoaded && !sheetsConfig.spreadsheetId && !hasDismissedModal);

  // AI Assistant State Props
  const [aiInitialTopic, setAiInitialTopic] = useState<string | undefined>(undefined);
  const [aiInitialDiscipline, setAiInitialDiscipline] = useState<string | undefined>(undefined);
  const [aiInitialMode, setAiInitialMode] = useState<string | undefined>('EXPLAIN');

  const handleStartStudyTopic = (topicId: string) => {
    setSelectedTopicForStudyId(topicId);
    setActiveTab('timer');
  };

  const handleAskAiForTopic = (topic: SyllabusTopic | string, modeOrDisc?: string) => {
    if (typeof topic === 'string') {
      setAiInitialTopic(topic);
      setAiInitialDiscipline(modeOrDisc || '');
      setAiInitialMode('FLASHCARDS');
    } else {
      setAiInitialTopic(topic.title);
      setAiInitialDiscipline(topic.disciplineName);
      setAiInitialMode(modeOrDisc || 'EXPLAIN');
    }
    setActiveTab('ai');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center animate-pulse font-bold text-xl">
            DP
          </div>
          <p className="text-xs text-slate-400 font-medium">Carregando Jornada DATAPREV 2026...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sheetsConfig={sheetsConfig}
        isSyncing={isSyncing}
        onSyncClick={() => fetchFromGoogleSheet()}
        onCreateSheetClick={() => createGoogleSheet()}
      />

      {/* Sync Status Bar */}
      <SheetsSyncBanner
        sheetsConfig={sheetsConfig}
        isSyncing={isSyncing}
        syncError={syncError}
        onSync={() => fetchFromGoogleSheet()}
        onCreateSheet={() => createGoogleSheet()}
        onOpenManager={() => setActiveTab('sheets')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            summaryStats={summaryStats}
            topicProgressMap={topicProgressMap}
            sessions={sessions}
            revisions={revisions}
            onNavigateTab={setActiveTab}
            onStartStudyTopic={handleStartStudyTopic}
          />
        )}

        {activeTab === 'syllabus' && (
          <SyllabusView
            topicProgressMap={topicProgressMap}
            onUpdateStatus={updateTopicStatus}
            onStartStudyTopic={handleStartStudyTopic}
            onAskAiForTopic={handleAskAiForTopic}
          />
        )}

        {activeTab === 'timer' && (
          <StudySessionView
            initialTopicId={selectedTopicForStudyId}
            onSaveSession={addStudySession}
            onFinish={() => {
              setSelectedTopicForStudyId(undefined);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'revisions' && (
          <RevisionsView
            revisions={revisions}
            onToggleRevision={toggleRevisionCompleted}
            onNavigateTab={setActiveTab}
            onAskAiForTopic={(topicTitle, disciplineName) =>
              handleAskAiForTopic(topicTitle, disciplineName)
            }
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantView
            initialTopicTitle={aiInitialTopic}
            initialDisciplineName={aiInitialDiscipline}
            initialMode={aiInitialMode}
          />
        )}

        {activeTab === 'sheets' && (
          <SheetsManagerView
            sheetsConfig={sheetsConfig}
            isSyncing={isSyncing}
            syncError={syncError}
            onCreateSheet={createGoogleSheet}
            onFetchData={fetchFromGoogleSheet}
            onSaveConfig={setSheetsConfig}
          />
        )}
      </main>

      {/* Mandatory Google Sheet Requirement Modal */}
      <MandatorySheetRequirementModal
        isOpen={isMandatoryModalOpen}
        sheetsConfig={sheetsConfig}
        isSyncing={isSyncing}
        syncError={syncError}
        onCreateSheet={createGoogleSheet}
        onFetchData={fetchFromGoogleSheet}
        onCloseModal={() => setHasDismissedModal(true)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            DATAPREV 2026 • Perfil 3: Desenvolvimento de Software
          </p>
          <p className="text-slate-600">
            Integrado ao Google Sheets & Google Drive API • Powered by Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
}
