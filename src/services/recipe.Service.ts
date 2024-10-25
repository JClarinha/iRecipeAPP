import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

import {Recipe} from '../models/recipe';


@Injectable({
    providedIn: 'root'
})

export class RecipeService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Recipe[]> {
        return this.httpClient.get<Recipe[]>(this.apiUrl + 'iRecipeAPI/Recipe')
    }

    getById(id: number): Observable<Recipe> {
        return this.httpClient.get<Recipe>(this.apiUrl + 'iRecipeAPI/Recipe/' + id)
    }

    getByUserId(UserId: number): Observable<Recipe[]> {
        console.log(UserId);
        return this.httpClient.get<Recipe[]>(this.apiUrl + 'iRecipeAPI/Recipe/User/' + UserId)
    } 

    save(recipe : FormData): Observable<any> {
        return this.httpClient.post<any>(this.apiUrl + 'iRecipeAPI/Recipe' , recipe)
    }

    update(recipe : FormData): Observable<any> {
        return this.httpClient.put<any>(this.apiUrl + 'iRecipeAPI/Recipe' , recipe)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Recipe/' + id)
    }

    getImageUrl(filename: string): Observable<string> {
        const imageUrl = this.apiUrl + `iRecipeAPI/Recipe/images/${encodeURIComponent(filename)}`; 
        return of(imageUrl); 
    }


}
