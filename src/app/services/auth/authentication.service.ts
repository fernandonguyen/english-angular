import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserToken} from '../../model/user-token';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {User} from '../../model/user';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserToken>;
  public currentUser: Observable<UserToken>;
  update = new EventEmitter<string>();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserToken>(JSON.parse(localStorage.getItem('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(API_URL + '/login', {username, password})
        .pipe(map(user => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.update.emit('login');
          return user;
        }))
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}
