export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    blocked: boolean;
    admin: boolean;
}