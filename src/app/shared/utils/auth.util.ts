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

    static getUserRole(): string {
        const token = AuthUtil.accessToken;
        if (token) {
            const tokenJwtParts: string[] = token.split('.');
            const payload = JSON.parse(atob(tokenJwtParts[1]));
            console.log('Decoded JWT payload:', payload); // Debugging line

            // Check for role in the token payload
            if (payload.role) {
                console.log('Role found in token:', payload.role); // Debugging line
                return payload.role;
            }

            // Fallback to local storage if role is not in the token
            const storedRole = localStorage.getItem('userRole');
            console.log('Role from local storage:', storedRole); // Debugging line
            return storedRole || 'Guest';
        }
        console.log('No token found, returning Guest'); // Debugging line
        return 'Guest';
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
}