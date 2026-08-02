import { NextRequest, NextResponse } from 'next/server';
import {
  createDataprevSpreadsheet,
  readSpreadsheetData,
  appendStudySessionToSheet
} from '@/lib/google-sheets';
import { StudySession, TopicProgress, ScheduledRevision } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || '';
    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim() || undefined;

    const body = await req.json();
    const { action, spreadsheetId, session, topicProgress, revisions } = body;

    if (action === 'CREATE_SHEET') {
      const result = await createDataprevSpreadsheet(accessToken);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'READ_DATA') {
      if (!spreadsheetId) {
        return NextResponse.json(
          { success: false, error: 'spreadsheetId é obrigatório' },
          { status: 400 }
        );
      }
      const data = await readSpreadsheetData(spreadsheetId, accessToken);
      return NextResponse.json({ success: true, ...data });
    }

    if (action === 'APPEND_SESSION') {
      if (!spreadsheetId) {
        return NextResponse.json(
          { success: false, error: 'spreadsheetId é obrigatório' },
          { status: 400 }
        );
      }
      await appendStudySessionToSheet(
        spreadsheetId,
        session as StudySession,
        topicProgress as TopicProgress,
        (revisions || []) as ScheduledRevision[],
        accessToken
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Ação inválida' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro na rota do Google Sheets:', error);

    const rawMessage = error?.message || (typeof err === 'string' ? err : 'Erro inesperado na integração do Google Sheets');
    let userMessage = rawMessage;
    let isSheetsDisabled = false;

    if (
      rawMessage.includes('Google Sheets API has not been used in project') ||
      rawMessage.includes('Could not load the default credentials') ||
      rawMessage.includes('disabled') ||
      rawMessage.includes('sheets.googleapis.com')
    ) {
      isSheetsDisabled = true;
      userMessage =
        'Integração do Google Sheets indisponível (credenciais de Service Account do Google não configuradas no servidor). Todos os seus estudos continuam salvos com total segurança no Armazenamento Local do seu navegador.';
    }

    return NextResponse.json(
      {
        success: false,
        sheetsDisabled: isSheetsDisabled,
        error: userMessage
      },
      { status: 200 }
    );
  }
}

