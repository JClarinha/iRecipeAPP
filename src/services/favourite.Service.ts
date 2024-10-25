import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Favourite} from '../models/favourite';
import { User } from '../models/user';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


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

    getAllByUserId(id: number): Observable<Favourite[]> {
        return this.httpClient.get<Favourite[]>(this.apiUrl + 'iRecipeAPI/Favourite/User/' + id)
    }

    save(favourite : FormData): Observable<any> {
        return this.httpClient.post<any>(this.apiUrl + 'iRecipeAPI/Favourite' , favourite).pipe(
            tap(() => {
              Swal.fire({
                icon: 'success',
                title: 'Favourite added!',
                text: 'The selected recipe was saved in your favourites!',
                confirmButtonText: 'Great!',
              });
            }));
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Favourite/' + id).pipe(
            tap(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Favourite removed!',
                    text: 'The selected recipe was removed from your favourites!',
                    confirmButtonText: 'OK',
                  });
            }));
    }
}
