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
    const { mode, topicTitle, disciplineName, subtopics, userPrompt, model: requestedModel } = body;

    const selectedModel = requestedModel || 'gemini-3.6-flash';

    const ai = new GoogleGenAI({ apiKey });

    let systemInstruction = `Você é um tutor especialista e banca examinadora para o Concurso Público da DATAPREV (Perfil 3 - Desenvolvimento de Software).
Sua missão é ajudar o candidato a dominar os tópicos do edital com alta precisão técnica, foco em bancas de concursos (como Cebraspe, FGV, FCC, IADES) e explicações diretas e estruturadas em Português do Brasil.`;

    let prompt = '';

    if (mode === 'EXPLAIN') {
      prompt = `Forneça um resumo executivo focado para concurso sobre o tópico:
Disciplina: ${disciplineName}
Tópico: ${topicTitle}
Subtemas no edital: ${subtopics?.join(', ')}

Estruture sua resposta em:
1. **Conceito Chave & Definição Prática**: Em 2 ou 3 parágrafos claros.
2. **O que as Bancas mais Cobram**: Pontos de pega-ratão, pegadinhas frequentes e termos indispensáveis.
3. **Resumo em Tópicos (Mnemônico ou Tabela)**: Principais itens para revisão rápida.`;
    } else if (mode === 'QUIZ') {
      prompt = `Gere 2 questões inéditas no estilo de concurso (Múltipla Escolha com 4 ou 5 alternativas) sobre o tópico:
Disciplina: ${disciplineName}
Tópico: ${topicTitle}
Subtemas: ${subtopics?.join(', ')}

Para cada questão, inclua:
- Enunciado claro contextualizado à DATAPREV/tecnologia corporativa.
- Alternativas A, B, C, D e E.
- **Gabarito Comentado** detalhando o porquê da resposta correta e a pegadinha de cada alternativa.`;
    } else if (mode === 'FLASHCARDS') {
      prompt = `Crie 4 Flashcards de Memorização (Frente e Verso) em formato de perguntas e respostas objetivas para revisão do tópico:
Disciplina: ${disciplineName}
Tópico: ${topicTitle}
Subtemas: ${subtopics?.join(', ')}`;
    } else {
      prompt = `Dúvida do candidato sobre o edital DATAPREV 2026:
Disciplina: ${disciplineName || 'Geral'}
Tópico: ${topicTitle || 'Geral'}
Pergunta: ${userPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    return NextResponse.json({
      success: true,
      modelUsed: selectedModel,
      text: response.text || 'Não foi possível gerar a resposta.'
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Erro na API do Gemini:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar consulta IA' },
      { status: 500 }
    );
  }
}
