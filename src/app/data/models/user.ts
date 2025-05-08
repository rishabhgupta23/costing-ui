export interface User {
    displayName: string;
    emailId: string;
    companyId?: number;
    roleId?: number;
    roleName?: string;
    companyName?: string;
    userId?:number;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}