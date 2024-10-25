import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Comment} from '../models/comment';
import { tap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
    providedIn: 'root'
})

export class CommentService {
    apiUrl = 'https://localhost:7199/';

    constructor(private httpClient:HttpClient) {}


    getAll(): Observable<Comment[]> {
        return this.httpClient.get<Comment[]>(this.apiUrl + 'iRecipeAPI/Comment')
    }

    getById(id: number): Observable<Comment> {
        return this.httpClient.get<Comment>(this.apiUrl + 'iRecipeAPI/Comment/' + id)
    }

    getAllByUserId(id: number): Observable<Comment[]> {
        return this.httpClient.get<Comment[]>(this.apiUrl + 'iRecipeAPI/Comment/User/' + id)
    }

    save(comment : FormData): Observable<any> {
        return this.httpClient.post<any>(this.apiUrl + 'iRecipeAPI/Comment' , comment).pipe(
            tap(() => {
              Swal.fire({
                icon: 'success',
                title: 'Comment added!',
                text: 'Your comment was successfully added!',
                confirmButtonText: 'Great!',
              });
            }));
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Comment/' + id).pipe(
            tap(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Comment removed!',
                    text: 'Your comment was removed.',
                    confirmButtonText: 'OK',
                  });
            }));
    }
}
