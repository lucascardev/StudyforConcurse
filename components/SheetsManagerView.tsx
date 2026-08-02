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
import {
  requestGoogleLogin,
  getStoredGoogleAccessToken,
  getStoredGoogleClientId,
  saveStoredGoogleClientId
} from '@/lib/google-oauth';

interface SheetsManagerViewProps {
  sheetsConfig: GoogleSheetsConfig;
  isSyncing: boolean;
  syncError: string | null;
  onCreateSheet: (customAccessToken?: string) => Promise<unknown>;
  onFetchData: (id?: string, customAccessToken?: string) => Promise<unknown>;
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
  const [clientId, setClientId] = useState<string>(getStoredGoogleClientId());
  const [showClientIdInput, setShowClientIdInput] = useState<boolean>(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleAuthLogin = () => {
    setOauthError(null);
    setSuccessMsg(null);

    const targetClientId = clientId.trim() || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (!targetClientId) {
      setShowClientIdInput(true);
      setOauthError('Por favor, informe seu ID de Cliente OAuth do Google para abrir a tela de autorização.');
      return;
    }

    saveStoredGoogleClientId(targetClientId);

    requestGoogleLogin(
      targetClientId,
      async (accessToken) => {
        try {
          const result = (await onCreateSheet(accessToken)) as GoogleSheetsConfig;
          if (result?.spreadsheetId) {
            setInputSheetId(result.spreadsheetId);
            setSuccessMsg('Sua planilha oficial do DATAPREV foi criada com sucesso diretamente na sua conta do Google!');
          }
        } catch (err: any) {
          setOauthError(err?.message || 'Erro ao criar planilha com token do Google.');
        }
      },
      (errorMsg) => {
        setOauthError(errorMsg);
      }
    );
  };

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
          <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-6 text-center space-y-5">
            <AlertCircle className="w-10 h-10 text-emerald-400 mx-auto opacity-90" />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Conectar & Autorizar Conta do Google</h4>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                Clique no botão abaixo para abrir a janela oficial de login do Google, autorizar a criação da planilha e gerar seu controle de estudos do edital DATAPREV 2026 diretamente no seu Google Drive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGoogleAuthLogin}
                disabled={isSyncing}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-lg transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isSyncing ? 'Autorizando...' : 'Fazer Login e Autorizar com o Google'}</span>
              </button>

              <button
                onClick={handleCreateNew}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Criar via Servidor</span>
              </button>
            </div>

            {showClientIdInput && (
              <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-left max-w-lg mx-auto">
                <label className="text-xs font-bold text-slate-200">ID de Cliente OAuth do Google (Client ID):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="72113231086-xxxx.apps.googleusercontent.com"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleGoogleAuthLogin}
                    className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    Salvar & Entrar
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ou configure a variável de ambiente <code className="text-emerald-400">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> no Vercel.
                </p>
              </div>
            )}
          </div>
        )}

        {oauthError && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{oauthError}</span>
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
