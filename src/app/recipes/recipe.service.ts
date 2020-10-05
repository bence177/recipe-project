import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
    // recipeSelected = new Subject<Recipe>();
    recipesChange = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    // new Recipe(
    // 'A Test Recipe',
    // 'This is simply a test',
    // 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.4x2EY3gWgW5lOxmWp5CoyAHaEK%26pid%3DApi&f=1',
    // [
    // new Ingredient('Meat', 1),
    // new Ingredient('French fries', 20)
    // ]),
    // new Recipe(
    // 'Another Test Recipe',
    // 'This is Test Recipe 2',
    // 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.VYkq8eoindCArHezdwxNfAHaEK%26pid%3DApi&f=1',
    // [
    // new Ingredient('Cake', 1),
    // new Ingredient('Raspberries', 30)
    // ])
    // ];
    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChange.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToSL(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    getRecipe(index: number) {
        return this.recipes[ index ];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChange.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[ index ] = newRecipe;
        this.recipesChange.next(this.recipes.slice());
    }

    removeRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChange.next(this.recipes.slice());
    }
}
