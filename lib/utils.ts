import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function parseJsonResponse<T = any>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new Error(`O servidor retornou uma resposta vazia (Status ${res.status}).`);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    if (text.startsWith('<!') || text.includes('<html')) {
      throw new Error(`Servidor em inicialização ou temporariamente indisponível (Status ${res.status}). Seus dados continuam salvos com segurança no navegador.`);
    }
    throw new Error(`Resposta inválida do servidor: ${text.slice(0, 100)}`);
  }
}
