import { google } from 'googleapis';
import { DATAPREV_SYLLABUS } from './dataprev-syllabus';
import { StudySession, TopicProgress, ScheduledRevision, TopicStatus } from './types';

export async function getGoogleAuthClient(accessToken?: string) {
  if (accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return oauth2Client;
  }

  // 1. Support raw JSON string in GOOGLE_SERVICE_ACCOUNT_CREDENTIALS
  const serviceAccountEnv = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  if (serviceAccountEnv) {
    try {
      const credentials = JSON.parse(serviceAccountEnv);
      return new google.auth.GoogleAuth({
        credentials,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file'
        ]
      });
    } catch (e) {
      console.error('Erro ao processar GOOGLE_SERVICE_ACCOUNT_CREDENTIALS:', e);
    }
  }

  // 2. Support GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY environment variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ]
    });
  }

  // 3. Fallback to default Application Credentials search
  return new google.auth.GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ]
  });
}

export async function createDataprevSpreadsheet(accessToken?: string) {
  const auth = await getGoogleAuthClient(accessToken);
  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Create spreadsheet
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'DATAPREV 2026 - Concurso - Registro de Estudos'
      },
      sheets: [
        {
          properties: {
            title: 'Visão Geral & Tópicos',
            gridProperties: { frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'Sessões de Estudo',
            gridProperties: { frozenRowCount: 1 }
          }
        },
        {
          properties: {
            title: 'Revisões Agendadas',
            gridProperties: { frozenRowCount: 1 }
          }
        }
      ]
    }
  });

  const spreadsheetId = createResponse.data.spreadsheetId;
  const spreadsheetUrl = createResponse.data.spreadsheetUrl;

  if (!spreadsheetId) {
    throw new Error('Não foi possível criar a planilha do Google Sheets.');
  }

  // 2. Populate Headers and Initial Syllabus Data
  const topicHeaders = [
    'ID Tópico',
    'Código',
    'Disciplina',
    'Título do Tópico',
    'Status',
    'Tempo Estudado (minutos)',
    'Horas Formatadas',
    'Questões Resolvidas',
    'Acertos',
    '% Acerto',
    'Avaliação Confiança (1-5)',
    'Último Estudo'
  ];

  const initialTopicRows: (string | number)[][] = [topicHeaders];

  // Insert all DATAPREV topics
  for (const disc of DATAPREV_SYLLABUS) {
    for (const topic of disc.topics) {
      initialTopicRows.push([
        topic.id,
        topic.code,
        disc.name,
        topic.title,
        'Não Iniciado',
        0,
        '0h 0m',
        0,
        0,
        '0%',
        0,
        '-'
      ]);
    }
  }

  const sessionHeaders = [
    'ID Sessão',
    'Data (AAAA-MM-DD)',
    'Data/Hora',
    'Disciplina',
    'Código Tópico',
    'Título Tópico',
    'Detalhe/Subtema',
    'Modo de Estudo',
    'Duração (min)',
    'Questões Total',
    'Acertos',
    'Confiança (1-5)',
    'Anotações/Resumo'
  ];

  const revisionHeaders = [
    'ID Revisão',
    'ID Sessão Origem',
    'Código Tópico',
    'Título Tópico',
    'Disciplina',
    'Data Agendada',
    'Intervalo',
    'Status Concluído',
    'Data Conclusão'
  ];

  // Update sheet values
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: [
        {
          range: "'Visão Geral & Tópicos'!A1",
          values: initialTopicRows
        },
        {
          range: "'Sessões de Estudo'!A1",
          values: [sessionHeaders]
        },
        {
          range: "'Revisões Agendadas'!A1",
          values: [revisionHeaders]
        }
      ]
    }
  });

  return {
    spreadsheetId,
    spreadsheetUrl: spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}

export async function readSpreadsheetData(spreadsheetId: string, accessToken?: string) {
  const auth = await getGoogleAuthClient(accessToken);
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      "'Visão Geral & Tópicos'!A2:L",
      "'Sessões de Estudo'!A2:M",
      "'Revisões Agendadas'!A2:I"
    ]
  });

  const topicRanges = response.data.valueRanges?.[0]?.values || [];
  const sessionRanges = response.data.valueRanges?.[1]?.values || [];
  const revisionRanges = response.data.valueRanges?.[2]?.values || [];

  const topicProgressList: TopicProgress[] = topicRanges.map((row) => ({
    topicId: row[0] || '',
    topicCode: row[1] || '',
    disciplineId: row[2] || '',
    disciplineName: row[2] || '',
    topicTitle: row[3] || '',
    status: (row[4] as TopicStatus) || 'Não Iniciado',
    hoursStudiedMinutes: Number(row[5]) || 0,
    questionsTotal: Number(row[7]) || 0,
    questionsCorrect: Number(row[8]) || 0,
    confidenceRating: Number(row[10]) || 0,
    lastStudiedDate: row[11] !== '-' ? row[11] : null,
    notesCount: 0
  }));

  const sessions: StudySession[] = sessionRanges.map((row) => ({
    id: row[0] || '',
    date: row[1] || '',
    timestamp: row[2] || '',
    disciplineId: '',
    disciplineName: row[3] || '',
    topicCode: row[4] || '',
    topicId: '',
    topicTitle: row[5] || '',
    themeDetail: row[6] || '',
    studyMode: row[7] || 'Teoria',
    durationMinutes: Number(row[8]) || 0,
    questionsTotal: Number(row[9]) || 0,
    questionsCorrect: Number(row[10]) || 0,
    confidenceRating: Number(row[11]) || 0,
    notes: row[12] || '',
    syncedToSheets: true
  }));

  const revisions: ScheduledRevision[] = revisionRanges.map((row) => ({
    id: row[0] || '',
    sessionId: row[1] || '',
    topicCode: row[2] || '',
    topicId: '',
    topicTitle: row[3] || '',
    disciplineName: row[4] || '',
    scheduledForDate: row[5] || '',
    intervalType: (row[6] as '24h' | '7d' | '30d') || '24h',
    completed: row[7] === 'SIM' || row[7] === 'Sim' || row[7] === 'true',
    completedAt: row[8] || undefined
  }));

  return {
    topicProgressList,
    sessions,
    revisions
  };
}

export async function appendStudySessionToSheet(
  spreadsheetId: string,
  session: StudySession,
  updatedProgress: TopicProgress,
  revisions: ScheduledRevision[],
  accessToken?: string
) {
  const auth = await getGoogleAuthClient(accessToken);
  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Append session row
  const sessionRow = [
    session.id,
    session.date,
    session.timestamp,
    session.disciplineName,
    session.topicCode,
    session.topicTitle,
    session.themeDetail || '',
    session.studyMode,
    session.durationMinutes,
    session.questionsTotal,
    session.questionsCorrect,
    session.confidenceRating,
    session.notes || ''
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'Sessões de Estudo'!A:M",
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [sessionRow]
    }
  });

  // 2. Append revisions rows
  if (revisions.length > 0) {
    const revisionRows = revisions.map((rev) => [
      rev.id,
      rev.sessionId,
      rev.topicCode,
      rev.topicTitle,
      rev.disciplineName,
      rev.scheduledForDate,
      rev.intervalType,
      rev.completed ? 'SIM' : 'NÃO',
      rev.completedAt || ''
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Revisões Agendadas'!A:I",
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: revisionRows
      }
    });
  }

  // 3. Update the specific topic row in "Visão Geral & Tópicos"
  // First locate row index of topic
  const topicsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Visão Geral & Tópicos'!A:A"
  });

  const topicIds = topicsResponse.data.values?.map((r) => r[0]) || [];
  const rowIndex = topicIds.findIndex((id) => id === updatedProgress.topicId);

  if (rowIndex !== -1) {
    const rowNumber = rowIndex + 1; // 1-indexed in Google Sheets
    const hoursFormatted = `${Math.floor(updatedProgress.hoursStudiedMinutes / 60)}h ${updatedProgress.hoursStudiedMinutes % 60}m`;
    const accuracy = updatedProgress.questionsTotal > 0
      ? `${Math.round((updatedProgress.questionsCorrect / updatedProgress.questionsTotal) * 100)}%`
      : '0%';

    const updatedRow = [
      updatedProgress.topicId,
      updatedProgress.topicCode,
      updatedProgress.disciplineName,
      updatedProgress.topicTitle,
      updatedProgress.status,
      updatedProgress.hoursStudiedMinutes,
      hoursFormatted,
      updatedProgress.questionsTotal,
      updatedProgress.questionsCorrect,
      accuracy,
      updatedProgress.confidenceRating,
      updatedProgress.lastStudiedDate || '-'
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'Visão Geral & Tópicos'!A${rowNumber}:L${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [updatedRow]
      }
    });
  }
}
