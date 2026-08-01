'use client';

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  CalendarCheck,
  Bot,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { GoogleSheetsConfig } from '@/lib/types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sheetsConfig: GoogleSheetsConfig;
  isSyncing: boolean;
  onSyncClick: () => void;
  onCreateSheetClick: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  sheetsConfig,
  isSyncing,
  onSyncClick,
  onCreateSheetClick
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-900/40 font-bold text-white text-lg">
              DP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-50 text-base sm:text-lg tracking-tight">
                  DATAPREV 2026
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Perfil 3 • Dev Software
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Jornada de Estudos com Banco no Google Sheets
              </p>
            </div>
          </div>

          {/* Google Sheets Status Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
            {sheetsConfig.spreadsheetId ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Google Sheets Conectado
                </span>
                <a
                  href={sheetsConfig.spreadsheetUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1 underline underline-offset-2 ml-1"
                  title="Abrir Planilha no Google Sheets"
                >
                  Planilha
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <button
                onClick={onCreateSheetClick}
                disabled={isSyncing}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Conectar ao Google Sheets
              </button>
            )}
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
              { id: 'syllabus', label: 'Edital', icon: BookOpen },
              { id: 'edital-import', label: 'Importar Edital', icon: Sparkles },
              { id: 'questions', label: 'Provas & Questões', icon: HelpCircle },
              { id: 'timer', label: 'Estudar', icon: Timer },
              { id: 'revisions', label: 'Revisões', icon: CalendarCheck },
              { id: 'ai', label: 'Tutor IA', icon: Bot },
              { id: 'sheets', label: 'Sheets', icon: FileSpreadsheet }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
