import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const { editalText, banca, cargo } = await req.json();

    if (!editalText || typeof editalText !== 'string' || !editalText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Texto do edital não informado.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Você é um analista especialista em concursos públicos e estruturas de editais de bancas examinadoras (Cebraspe, FGV, FCC, IBFC, VUNESP, IADES).
Sua função é ler um texto bruto de edital de concurso público e extrair a matriz estruturada do conteúdo programático, separando disciplinas, tópicos numerados, subtemas e importância estimada.`;

    const prompt = `Analise o seguinte trecho de edital de concurso público (${banca || 'Banca Padrão'} - ${cargo || 'Cargo Padrão'}) e converta em um JSON estrito.

Texto do Edital:
"""
${editalText}
"""

Retorne APENAS um objeto JSON válido (sem texto extra antes ou depois) com o seguinte formato:
{
  "disciplines": [
    {
      "id": "DISCIPLINE_ID_SLUG",
      "name": "Nome Completo da Disciplina (ex: Língua Portuguesa)",
      "shortName": "Nome Curto (ex: Português)",
      "description": "Breve resumo do foco da disciplina",
      "color": "indigo",
      "topics": [
        {
          "id": "topic-1",
          "code": "PORT.1",
          "title": "Título resumido e profissional do tópico",
          "subtopics": ["Subtema 1", "Subtema 2", "Subtema 3"],
          "keyTopics": ["PalavraChave1", "PalavraChave2"],
          "importance": "Alta",
          "description": "Descrição sucinta do conteúdo cobrado neste tópico"
        }
      ]
    }
  ]
}
Associe cores válidas (indigo, cyan, emerald, blue, rose, amber, purple, teal) para cada disciplina.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    const rawText = response.text || '';
    // Extract JSON block
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Falha ao formatar resposta da IA em JSON válido.');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      data: parsedData
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro na API parse-edital:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar edital.' },
      { status: 500 }
    );
  }
}
