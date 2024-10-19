import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Favourite} from '../models/favourite';
import { User } from '../models/user';


@Injectable({
    providedIn: 'root'
})

export class FavouriteService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Favourite[]> {
        return this.httpClient.get<Favourite[]>(this.apiUrl + 'iRecipeAPI/Favourite')
    }

    getById(id: number): Observable<Favourite> {
        return this.httpClient.get<Favourite>(this.apiUrl + 'iRecipeAPI/Favourite/' + id)
    }

    getByUser(user:User): Observable<Favourite> {
        return this.httpClient.get<Favourite>(this.apiUrl + 'iRecipeAPI/Favourite/' + user)
    }


    save(favourite : Favourite): Observable<Favourite> {
        return this.httpClient.post<Favourite>(this.apiUrl + 'iRecipeAPI/Favourite' , favourite)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Favourite/' + id)
    }
}
