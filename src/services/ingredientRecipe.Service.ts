import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {IngredientRecipe} from '../models/ingredientRecipe';



@Injectable({
    providedIn: 'root'
})

export class IngredientRecipeService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<IngredientRecipe[]> {
        return this.httpClient.get<IngredientRecipe[]>(this.apiUrl + 'iRecipeAPI/IngredientRecipe')
    }

    getByRecipeId(recipeid: number): Observable<IngredientRecipe> {
        return this.httpClient.get<IngredientRecipe>(this.apiUrl + 'iRecipeAPI/IngredientRecipe/' + recipeid)
    }

    save(formData: FormData): Observable<any> {
        return this.httpClient.post<any>(this.apiUrl + 'iRecipeAPI/IngredientRecipe', formData);
      }
      


    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/IngredientRecipe/' + id)
    }
}
