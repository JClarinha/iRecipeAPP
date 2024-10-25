import {Category} from "./category";
import {User} from "./user";
import { Difficulty } from "./difficulty";
import { DatePipe } from "@angular/common";
import { IngredientRecipe } from "./ingredientRecipe";


export interface Recipe {
    id: number;
    pax: number;
    name: string;
    description: string;
    categoryId: number;
    category?: Category;
    approval?: boolean;
    duration: number;
    userId: number;
    user?: User;
    recipeDate: Date;
    difficultyId: number;
    difficulty?: Difficulty;
    preparation: string;
    image?: File | null; 
    imagePath?: string | null; 
    
    
    ingredients?: IngredientRecipe[];


}