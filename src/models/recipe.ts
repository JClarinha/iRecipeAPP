import {Category} from "./category";
import {User} from "./user";
import { Difficulty } from "./difficulty";
import { DatePipe } from "@angular/common";


export interface Recipe {
    Id: number;
    Pax: number;
    Name: string;
    Description: string;
    CategoryId: number;
    Category?: Category;
    Approval: boolean;
    Duration: number;
    UserId: number;
    User?: User;
    RecipeDate: Date;
    DifficultyId: number;
    Difficulty?: Difficulty;
    Preparation: string;
    Image?: File | null; // Equivalente ao IFormFile? no C#
    ImagePath?: string | null; // Equivalente ao string? no C#


}