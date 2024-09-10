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
}