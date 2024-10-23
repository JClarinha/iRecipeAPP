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

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Recipe/' + id)
    }

    getImageUrl(filename: string): Observable<string> {
        // Certifique-se de que o caminho a seguir é o correto para acessar as imagens
        const imageUrl = this.apiUrl + `iRecipeAPI/Recipe/images/${encodeURIComponent(filename)}`; // Ajuste a porta se necessário
        return of(imageUrl); // Retorna um Observable com a URL da imagem
    }


}
