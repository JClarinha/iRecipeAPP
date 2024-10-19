import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { catchError, Observable } from 'rxjs';
import {Ingredient} from '../models/ingredient';


@Injectable({
    providedIn: 'root'
})

export class IngredientService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Ingredient[]> {
        return this.httpClient.get<Ingredient[]>(this.apiUrl + 'iRecipeAPI/Ingredient')
    }

    getById(id: number): Observable<Ingredient> {
        return this.httpClient.get<Ingredient>(this.apiUrl + 'iRecipeAPI/Ingredient/' + id)
    }

    getByName(name: string): Observable<Ingredient> {
        return this.httpClient.get<Ingredient>(this.apiUrl + 'iRecipeAPI/Ingredient/' + name)
    }

    save(ingredient : Ingredient): Observable<Ingredient> {
        return this.httpClient.post<Ingredient>(this.apiUrl + 'iRecipeAPI/Ingredient' , ingredient)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Ingredient/' + id)
    }

     // Função para verificar se o ingrediente já existe ou criá-lo
  checkOrCreateIngredient(ingredientName: string): Observable<Ingredient> {
    return this.getByName(ingredientName).pipe(
      catchError(() => {
        // Se não encontrar o ingrediente, cria um novo
        const newIngredient: Ingredient = { id: 0, name: ingredientName }; // Define o modelo do novo ingrediente
        return this.save(newIngredient); // Cria o novo ingrediente
      })
    );
  }
  
}
