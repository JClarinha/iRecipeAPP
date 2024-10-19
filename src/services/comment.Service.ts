import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import {Comment} from '../models/comment';


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

    save(comment : Comment): Observable<Comment> {
        return this.httpClient.post<Comment>(this.apiUrl + 'iRecipeAPI/Comment' , comment)
    }

    delete(id:number) {
        return this.httpClient.delete(this.apiUrl + 'iRecipeAPI/Comment/' + id)
    }
}
