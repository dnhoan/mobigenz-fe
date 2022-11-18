import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private readonly baseUrl = `${environment.baseUrl}/`;

    constructor(private http: HttpClient, private router: Router) { }

    public login(form: any): Observable<any> {
      return this.http.post(`${this.baseUrl}login`, form);
    }
}
