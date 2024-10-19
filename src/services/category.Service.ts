import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Category} from '../models/category';


@Injectable({
    providedIn: 'root'
})

export class CategoryService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Category[]> {
        return this.httpClient.get<Category[]>(this.apiUrl + 'iRecipeAPI/Category')
    }

    getById(id: number): Observable<Category> {
        return this.httpClient.get<Category>(this.apiUrl + 'iRecipeAPI/Category/' + id)
    }

    save(category : Category): Observable<Category> {
        return this.httpClient.post<Category>(this.apiUrl + 'iRecipeAPI/Category' , category)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Category/' + id)
    }
}
