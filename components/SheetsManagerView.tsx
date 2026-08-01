'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  Link,
  Database,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  Info
} from 'lucide-react';
import { GoogleSheetsConfig } from '@/lib/types';

interface SheetsManagerViewProps {
  sheetsConfig: GoogleSheetsConfig;
  isSyncing: boolean;
  syncError: string | null;
  onCreateSheet: () => Promise<unknown>;
  onFetchData: (id?: string) => Promise<unknown>;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
}

export function SheetsManagerView({
  sheetsConfig,
  isSyncing,
  syncError,
  onCreateSheet,
  onFetchData,
  onSaveConfig
}: SheetsManagerViewProps) {
  const [inputSheetId, setInputSheetId] = useState<string>(sheetsConfig.spreadsheetId || '');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleManualLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSheetId.trim()) return;

    setSuccessMsg(null);
    try {
      await onFetchData(inputSheetId.trim());
      setSuccessMsg('Planilha vinculada e dados sincronizados com sucesso!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNew = async () => {
    setSuccessMsg(null);
    try {
      const result = (await onCreateSheet()) as GoogleSheetsConfig;
      if (result?.spreadsheetId) {
        setInputSheetId(result.spreadsheetId);
        setSuccessMsg('Sua planilha oficial do DATAPREV 2026 foi criada e formatada no Google Sheets!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Integração com Google Sheets</h2>
            <p className="text-xs text-slate-400">
              Gerencie a planilha do Google Sheets que serve como banco de dados persistente para seus estudos.
            </p>
          </div>
        </div>
      </div>

      {/* Active Connection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
        <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-emerald-400" />
          Status da Planilha do Google Sheets
        </h3>

        {sheetsConfig.spreadsheetId ? (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Conectada & Sincronizada
                </span>
                <h4 className="font-bold text-white text-sm mt-2">
                  DATAPREV 2026 - Concurso - Registro de Estudos
                </h4>
                <p className="text-xs text-slate-400 font-mono break-all">
                  ID: {sheetsConfig.spreadsheetId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onFetchData()}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sincronizar Dados</span>
                </button>

                <a
                  href={sheetsConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/edit`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <span>Abrir no Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {sheetsConfig.lastSyncedAt && (
              <p className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                Última sincronização completa com o servidor: {new Date(sheetsConfig.lastSyncedAt).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-6 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto opacity-80" />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Nenhuma planilha vinculada no momento</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Clique no botão abaixo para criar automaticamente no seu Google Drive uma planilha com todas as abas e edital DATAPREV pré-formatado.
              </p>
            </div>

            <button
              onClick={handleCreateNew}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSyncing ? 'Criando Planilha...' : 'Criar Planilha no Google Sheets Agora'}</span>
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {syncError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{syncError}</span>
          </div>
        )}
      </div>

      {/* Manual Link ID Form */}
      <form onSubmit={handleManualLink} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Link className="w-4 h-4 text-blue-400" />
          Vincular Planilha Existente por ID
        </h3>
        <p className="text-xs text-slate-400">
          Se você já possui uma planilha no Google Sheets e deseja conectar a este aplicativo:
        </p>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="ID da Planilha (ex: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlb74oEv0bZD34)"
            value={inputSheetId}
            onChange={(e) => setInputSheetId(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            required
          />
          <button
            type="submit"
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors shrink-0 disabled:opacity-50"
          >
            {isSyncing ? 'Conectando...' : 'Conectar ID'}
          </button>
        </div>
      </form>

      {/* Structure Information Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          Como os dados são organizados no seu Google Sheets
        </h3>
        <p className="text-xs text-slate-400">
          Sua planilha contém 3 abas estruturadas automaticamente:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <h5 className="font-bold text-emerald-400">1. Visão Geral & Tópicos</h5>
            <p className="text-slate-400">
              Lista os 31 tópicos do edital DATAPREV com colunas de status, tempo estudado, número de questões e acertos.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <h5 className="font-bold text-blue-400">2. Sessões de Estudo</h5>
            <p className="text-slate-400">
              Histórico detalhado de cada sessão realizada com data, duração, modo (teoria/questões), mnemônicos e notas.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
            <h5 className="font-bold text-purple-400">3. Revisões Agendadas</h5>
            <p className="text-slate-400">
              Agenda automatizada de repetição espaçada (24h, 7d, 30d) criada após cada sessão.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
