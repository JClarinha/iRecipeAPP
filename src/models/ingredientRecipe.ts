import {Recipe} from "./recipe";
import {Unit} from "./unit";
import { Ingredient } from "./ingredient";

export interface IngredientRecipe {
    id: number;
    ingredientId: number;
    ingredient?: Ingredient;
    recipeId: number;
    recipe?: Recipe;
    unitId: number;
    unit?: Unit;
    quantity: number;
}