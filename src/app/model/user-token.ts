import {Role} from './role';

export interface UserToken {
    id?: number;
    email?: string;
    password?: string;
    fullName?: string;
    accessToken?: string;
}
