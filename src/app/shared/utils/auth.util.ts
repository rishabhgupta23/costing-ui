export class AuthUtil {
    static get accessToken(): string {
        return localStorage.getItem('accessToken') || '';
    }

    static set accessToken(accessToken: string) {
        localStorage.setItem('accessToken', accessToken);
    }

    static resetToken() {
        localStorage.removeItem('accessToken');
    }

  static isTokenValid(): boolean {
    const decoded = AuthUtil.getDecodedToken();
    if (decoded?.exp) {
      const exp = new Date(0);
      exp.setUTCSeconds(decoded.exp);
      return new Date().getTime() < exp.getTime();
    }
    return false;
  }

  static getDecodedToken(): any | null {
  const token = AuthUtil.accessToken;
  if (!token) return null;
  try {
    const tokenJwtParts: string[] = token.split('.');
    return JSON.parse(atob(tokenJwtParts[1]));
  } catch {
    return null;
  }
}

static get resetRequired(): boolean {
    const decoded = AuthUtil.getDecodedToken();
    return decoded?.resetRequired === true;
  }
}