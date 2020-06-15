import {Role} from './role';

export interface User {
    id?: number;
    username?: string;
    password?: string;
    fullname?: string;
    token?: string;
}
