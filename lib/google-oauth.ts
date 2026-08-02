'use client';

export interface GoogleAuthUser {
  accessToken: string;
  expiresAt: number;
}

const STORAGE_KEY_TOKEN = 'dataprev_google_access_token_v2';
const STORAGE_KEY_CLIENT_ID = 'dataprev_custom_google_client_id_v2';

export function getStoredGoogleAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!raw) return null;
    const parsed: GoogleAuthUser = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      return null;
    }
    return parsed.accessToken;
  } catch {
    return null;
  }
}

export function saveStoredGoogleAccessToken(token: string, expiresInSeconds: number = 3600) {
  if (typeof window === 'undefined') return;
  const expiresAt = Date.now() + (expiresInSeconds - 60) * 1000;
  localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify({ accessToken: token, expiresAt }));
}

export function clearStoredGoogleAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_TOKEN);
}

export function getStoredGoogleClientId(): string {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const stored = localStorage.getItem(STORAGE_KEY_CLIENT_ID);
  return stored || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
}

export function saveStoredGoogleClientId(clientId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CLIENT_ID, clientId.trim());
}

export function requestGoogleLogin(
  clientId: string,
  onSuccess: (accessToken: string) => void,
  onError?: (errorMessage: string) => void
) {
  if (typeof window === 'undefined') return;

  if (!clientId || !clientId.trim()) {
    onError?.('ID do Cliente OAuth do Google não configurado.');
    return;
  }

  const windowGoogle = (window as any).google;

  if (windowGoogle?.accounts?.oauth2) {
    try {
      const tokenClient = windowGoogle.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
        callback: (response: any) => {
          if (response.error) {
            console.error('Erro na autenticação do Google:', response);
            onError?.(response.error_description || response.error || 'Falha na autorização do Google');
            return;
          }
          if (response.access_token) {
            saveStoredGoogleAccessToken(response.access_token, response.expires_in || 3600);
            onSuccess(response.access_token);
          }
        }
      });
      tokenClient.requestAccessToken({ prompt: 'consent' });
      return;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erro ao inicializar tokenClient:', error);
    }
  }

  // Fallback to standard Google OAuth 2.0 popup flow
  const redirectUri = window.location.origin;
  const scope = encodeURIComponent(
    'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
  );
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId.trim()
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=consent`;

  const width = 550;
  const height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const popup = window.open(
    authUrl,
    'google_oauth_login',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
  );

  if (!popup) {
    onError?.('Pop-up de login bloqueado pelo navegador. Por favor, permita pop-ups para autorizar o Google.');
    return;
  }

  // Poll for token in popup URL hash
  const interval = setInterval(() => {
    try {
      if (popup.closed) {
        clearInterval(interval);
        return;
      }
      if (popup.location.href.includes(redirectUri)) {
        const hash = popup.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const expiresIn = params.get('expires_in');
          if (accessToken) {
            saveStoredGoogleAccessToken(accessToken, Number(expiresIn) || 3600);
            onSuccess(accessToken);
            popup.close();
            clearInterval(interval);
            return;
          }
        }
      }
    } catch {
      // Cross-origin check before redirect is expected to throw until redirect back
    }
  }, 500);
}
