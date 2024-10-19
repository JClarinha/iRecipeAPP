import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {User} from '../models/user';


@Injectable({
    providedIn: 'root'
})

export class UserService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.apiUrl + 'iRecipeAPI/User')
    }

    getById(id: number): Observable<User> {
        return this.httpClient.get<User>(this.apiUrl + 'iRecipeAPI/User/' + id)
    }

    save(user : User): Observable<User> {
        return this.httpClient.post<User>(this.apiUrl + 'iRecipeAPI/User' , user)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/User/' + id)
    }
}
