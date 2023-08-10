import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  apiUrl = "http://localhost:3000/";

  public getAllUsers() {
    return this.http.get(this.apiUrl + "all");
  }

  public addUser(formData: FormData) {
    return this.http.post(this.apiUrl + "add_user", formData);
  }

  public deleteUser(id: number) {
    return this.http.delete(this.apiUrl + 'delete/' + id);
  }

  public updateUser(id: number, formData: FormData) {
    return this.http.put(this.apiUrl + 'update/' + id, formData);
  }
}
