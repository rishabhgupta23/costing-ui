import { UserRole } from "../constants/userrole.constants";

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

    static  isTokenValid() {
    const token = AuthUtil.accessToken;
    const tokenJwtParts: string[] = token.split('.');
    const payload = JSON.parse(atob(tokenJwtParts[1]));
    if(payload?.exp) {
      const exp = new Date(0);
      exp.setUTCSeconds(payload.exp);
      const cur = new Date();
      return cur.getTime() < exp.getTime();
    } else {
      return false;
    }
  }

  static hasRole(currentRole: UserRole, allowedRoles?: UserRole[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    return allowedRoles.includes(currentRole);
  }
}