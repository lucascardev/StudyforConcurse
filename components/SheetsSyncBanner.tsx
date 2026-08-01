'use client';

import React from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { GoogleSheetsConfig } from '@/lib/types';

interface SheetsSyncBannerProps {
  sheetsConfig: GoogleSheetsConfig;
  isSyncing: boolean;
  syncError: string | null;
  onSync: () => void;
  onCreateSheet: () => void;
  onOpenManager: () => void;
}

export function SheetsSyncBanner({
  sheetsConfig,
  isSyncing,
  syncError,
  onSync,
  onCreateSheet,
  onOpenManager
}: SheetsSyncBannerProps) {
  const formattedLastSync = sheetsConfig.lastSyncedAt
    ? new Date(sheetsConfig.lastSyncedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Connection Status */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Banco de Dados: <strong>Google Sheets</strong></span>
          </div>

          {sheetsConfig.spreadsheetId ? (
            <div className="flex items-center gap-3 text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Planilha Conectada
              </span>

              {formattedLastSync && (
                <span className="text-slate-400 flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3 text-slate-500" />
                  Última sincronização: {formattedLastSync}
                </span>
              )}
            </div>
          ) : (
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Nenhuma planilha vinculada ainda.
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {sheetsConfig.spreadsheetId ? (
            <>
              <button
                onClick={onSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
              </button>

              <a
                href={sheetsConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/edit`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all"
              >
                <span>Abrir Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          ) : (
            <button
              onClick={onCreateSheet}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>{isSyncing ? 'Criando Tabela...' : '⚡ Adicionar Tabela Google Sheets (Exigido)'}</span>
            </button>
          )}

          <button
            onClick={onOpenManager}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors text-xs font-medium"
            title="Configurações da Planilha"
          >
            Gerenciar
          </button>
        </div>
      </div>

      {syncError && (
        <div className="max-w-7xl mx-auto mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{syncError}</span>
        </div>
      )}
    </div>
  );
}
