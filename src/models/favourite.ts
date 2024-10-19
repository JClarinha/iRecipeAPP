import {Recipe} from "./recipe";
import {User} from "./user";


export interface Favourite {
    id: number;
    userId: number;
    user: User;
    recipeId: number;
    recipe: Recipe;

} 