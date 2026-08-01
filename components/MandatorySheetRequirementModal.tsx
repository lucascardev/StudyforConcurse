'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { GoogleSheetsConfig } from '@/lib/types';

interface MandatorySheetRequirementModalProps {
  isOpen: boolean;
  sheetsConfig: GoogleSheetsConfig;
  isSyncing: boolean;
  syncError: string | null;
  onCreateSheet: () => Promise<unknown>;
  onFetchData: (id?: string) => Promise<unknown>;
  onCloseModal?: () => void;
}

export function MandatorySheetRequirementModal({
  isOpen,
  sheetsConfig,
  isSyncing,
  syncError,
  onCreateSheet,
  onFetchData,
  onCloseModal
}: MandatorySheetRequirementModalProps) {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualSheetId, setManualSheetId] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateNew = async () => {
    setSuccessMsg(null);
    try {
      const result = (await onCreateSheet()) as GoogleSheetsConfig;
      if (result?.spreadsheetId) {
        setSuccessMsg('Planilha criada e vinculada com sucesso no seu Google Drive!');
        if (onCloseModal) {
          setTimeout(() => {
            onCloseModal();
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSheetId.trim()) return;

    setSuccessMsg(null);
    try {
      // Extract sheet ID if full URL pasted
      let sheetId = manualSheetId.trim();
      const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        sheetId = match[1];
      }

      await onFetchData(sheetId);
      setSuccessMsg('Tabela Google Sheets vinculada e sincronizada!');
      if (onCloseModal) {
        setTimeout(() => {
          onCloseModal();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-0 text-slate-100">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 p-6 border-b border-slate-800 relative">
          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Fechar (Modo Offline)"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shadow-lg shadow-emerald-900/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                Ação Necessária
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Adicionar Tabela no Google Sheets
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            Para garantir o salvamento seguro, histórico de edital, cronograma e banco de questões diretamente na sua conta do Google, adicione ou crie uma tabela Google Sheets.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block mb-0.5">Sem Risco de Perda</span>
                <span className="text-slate-400 text-[11px]">Seus dados são sincronizados no seu próprio Google Drive.</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block mb-0.5">Estrutura Pronta</span>
                <span className="text-slate-400 text-[11px]">Criação automática de abas de Edital, Cronograma e Questões.</span>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {syncError && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{syncError}</span>
              </div>
              {onCloseModal && (
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="w-full text-center px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Continuar Usando Armazenamento Local (100% Seguro)</span>
                </button>
              )}
            </div>
          )}

          {/* Action 1: Create Automatically (Primary) */}
          <div className="space-y-3">
            <button
              onClick={handleCreateNew}
              disabled={isSyncing}
              className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Criando e Formatando Tabela Google Sheets...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Criar Tabela Oficial no Google Sheets em 1 Clique</span>
                </>
              )}
            </button>

            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl border border-slate-700/80 transition-all"
              >
                <span>Usar Armazenamento Local no Navegador (Offline)</span>
              </button>
            )}

            {/* Action 2: Link Existing Sheet */}
            <div className="text-center">
              {!showManualInput ? (
                <button
                  onClick={() => setShowManualInput(true)}
                  className="text-xs text-slate-400 hover:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1.5"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Já possui uma tabela? Clique para colar o ID ou link</span>
                </button>
              ) : (
                <form onSubmit={handleManualLink} className="space-y-2 pt-2 text-left">
                  <label className="block text-xs font-semibold text-slate-300">
                    ID ou Link da Tabela do Google Sheets
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cole a URL ou ID da planilha..."
                      value={manualSheetId}
                      onChange={(e) => setManualSheetId(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50"
                    >
                      {isSyncing ? 'Conectando...' : 'Vincular'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tabela sincronizada via API oficial do Google Workspace</span>

          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="text-slate-400 hover:text-slate-200 underline font-medium"
            >
              Usar em Modo Offline Temporário
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
