import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Unit} from '../models/unit';


@Injectable({
    providedIn: 'root'
})

export class UnitService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Unit[]> {
        return this.httpClient.get<Unit[]>(this.apiUrl + 'iRecipeAPI/Unit')
    }

    getById(id: number): Observable<Unit> {
        return this.httpClient.get<Unit>(this.apiUrl + 'iRecipeAPI/Unit/' + id)
    }

    save(unit : Unit): Observable<Unit> {
        return this.httpClient.post<Unit>(this.apiUrl + 'iRecipeAPI/Unit' , unit)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Unit/' + id)
    }
}
