import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:3000/login";

  public login(userData: any) {
    return this.http.post(this.apiUrl, userData).pipe(map((user: any) => {
      return user;
    }),
      catchError(err => {
        return throwError(() => new Error(err))
      })
    );
  }

  public saveUsernameToLocalStorage(username: string) {
    localStorage.setItem('username', username);
  }

  public logout() {
    localStorage.removeItem('username');
  }

  public isLoggedIn() {
    return localStorage.getItem('username') ? true : false;
  }
}
