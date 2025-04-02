export interface User {
    displayName: string;
    emailId: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}