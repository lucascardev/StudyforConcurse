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

    const body = await req.json();
    const { mode, examText, banca, year, disciplineName, topicTitle, questionCount } = body;

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Você é um elaborador e especialista de bancas examinadoras de concursos públicos do Brasil (CEBRASPE/CESPE, FGV, FCC, IBFC, VUNESP, IADES).
Você é capaz de extrair e estruturar questões de provas reais passadas ou elaborar questões inéditas de alta fidelidade seguindo rigorosamente o estilo, pegadinhas e gabarito comentado da banca solicitada.`;

    let prompt = '';

    if (mode === 'EXTRACT_FROM_TEXT') {
      prompt = `Extraia exatamente ${questionCount || 3} questões de concurso do texto de prova fornecido abaixo:

Banca: ${banca || 'Desconhecida'} | Ano: ${year || '2024'} | Disciplina: ${disciplineName || 'Geral'}

Texto da Prova Passada:
"""
${examText}
"""

Retorne APENAS um objeto JSON válido no seguinte formato:
{
  "questions": [
    {
      "id": "q-1",
      "banca": "${banca || 'CEBRASPE'}",
      "year": ${year || 2024},
      "disciplineName": "Nome da Disciplina",
      "topicTitle": "Tópico identificado",
      "statement": "Texto do enunciado da questão...",
      "options": [
        { "id": "A", "text": "Texto da alternativa A" },
        { "id": "B", "text": "Texto da alternativa B" },
        { "id": "C", "text": "Texto da alternativa C" },
        { "id": "D", "text": "Texto da alternativa D" },
        { "id": "E", "text": "Texto da alternativa E" }
      ],
      "correctOptionId": "A",
      "explanation": "Gabarito comentado fundamentado no texto, jurisprudência, norma ou regra gramatical/conceito técnico."
    }
  ]
}
Observação: Se for banca CEBRASPE formato Certo/Errado, as opções devem ser "CERTO" e "ERRADO".`;
    } else {
      // GENERATE_INEDITA
      prompt = `Gere ${questionCount || 3} questões inéditas no estilo rigoroso da banca ${banca || 'CEBRASPE'} sobre o seguinte tópico:

Disciplina: ${disciplineName || 'Geral'}
Tópico: ${topicTitle || 'Conhecimentos Gerais'}

Exigências:
- Banca: ${banca || 'CEBRASPE'} (${banca === 'CEBRASPE' ? 'Formato Certo/Errado com itens bem formulados' : 'Múltipla Escolha A, B, C, D, E'})
- Questões atuais, realistas e com pegadinhas clássicas da banca ${banca || 'CEBRASPE'}.
- Inclua gabarito comentado passo a passo para cada alternativa/item.

Retorne APENAS um objeto JSON válido no seguinte formato:
{
  "questions": [
    {
      "id": "gen-${Date.now()}-1",
      "banca": "${banca || 'CEBRASPE'}",
      "year": 2026,
      "disciplineName": "${disciplineName || 'Geral'}",
      "topicTitle": "${topicTitle || 'Geral'}",
      "statement": "Texto completo do enunciado...",
      "options": [
        ${banca === 'CEBRASPE' 
          ? '{"id": "CERTO", "text": "Certo"}, {"id": "ERRADO", "text": "Errado"}'
          : '{"id": "A", "text": "Opção A"}, {"id": "B", "text": "Opção B"}, {"id": "C", "text": "Opção C"}, {"id": "D", "text": "Opção D"}, {"id": "E", "text": "Opção E"}'}
      ],
      "correctOptionId": "${banca === 'CEBRASPE' ? 'CERTO' : 'A'}",
      "explanation": "Explicação detalhada e fundamentada do gabarito."
    }
  ]
}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    const rawText = response.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Não foi possível gerar questões no formato JSON esperado.');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      questions: parsedData.questions || []
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro na API questions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar questões.' },
      { status: 500 }
    );
  }
}
