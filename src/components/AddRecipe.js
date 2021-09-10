import React, { useState } from "react";
import { create } from "../services/RecipeService";
import CreatableInputOnly from './CreatableInputOnly'

const AddRecipe = () => {
    const initialRecipeState = {
        id: null,
        name: "",
        description: "",
        ingredients: [],
    };
    const [recipe, setRecipe] = useState(initialRecipeState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleIngredientAdded = ({ inputValue, value }) => {
        const ingredients = convertIngredients({ inputValue, value });

        setRecipe({ ...recipe, ingredients });
    }

    const handleIngredientRemoved = ({ value }) => {
        const ingredients = convertIngredients({ value });

        setRecipe({ ...recipe, ingredients });
    }

    const convertIngredients = ({ inputValue, value }) => {
        const ingredients = [];

        if (inputValue) {
            ingredients.push({ name: inputValue });
        }

        const reducer = (existingIngredients, newIngredient) => {
            existingIngredients.push({ name: newIngredient.value })
            return existingIngredients;
        };

        return value.reduce(reducer, ingredients);
    };

    const saveRecipe = () => {
        var data = {
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
        };

        create(data)
            .then(response => {
                setRecipe({
                    id: response.data.id,
                    name: response.data.name,
                    description: response.data.description,
                    ingredients: response.data.ingredients,
                });
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newRecipe = () => {
        setRecipe(initialRecipeState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4 data-testid="success-msg">You submitted successfully!</h4>
                    <button
                        className="btn btn-success"
                        onClick={newRecipe}
                        data-testid="add-btn"
                    >
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={recipe.name}
                            onChange={handleInputChange}
                            name="name"
                            data-testid="name-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description: </label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            required
                            value={recipe.description}
                            onChange={handleInputChange}
                            name="description"
                            data-testid="description-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ingredients">Ingredients: </label>
                        <CreatableInputOnly
                            handleIngredientAdded={handleIngredientAdded}
                            handleIngredientRemoved={handleIngredientRemoved}
                        />
                    </div>

                    <button
                        onClick={saveRecipe}
                        className="btn btn-success"
                        data-testid="submit-btn"
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddRecipe;