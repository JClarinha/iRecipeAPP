import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Difficulty} from '../models/difficulty';


@Injectable({
    providedIn: 'root'
})

export class DifficultyService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Difficulty[]> {
        return this.httpClient.get<Difficulty[]>(this.apiUrl + 'iRecipeAPI/Difficulty')
    }

    getById(id: number): Observable<Difficulty> {
        return this.httpClient.get<Difficulty>(this.apiUrl + 'iRecipeAPI/Difficulty/' + id)
    }

    save(difficulty : Difficulty): Observable<Difficulty> {
        return this.httpClient.post<Difficulty>(this.apiUrl + 'iRecipeAPI/Difficulty' , difficulty)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Difficulty/' + id)
    }
}
