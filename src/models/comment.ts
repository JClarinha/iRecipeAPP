import { Recipe } from "./recipe";
import { User } from "./user";


export interface Comment{
    id: number;
    recipeId: number;
    recipe: Recipe;
    userId: number;
    user: User;
    description: string;


}