import React, { useState, useEffect } from "react";
import { get, update, remove } from "../services/RecipeService";
import CreatableInputOnly from './CreatableInputOnly'

const Recipe = props => {
    const initialRecipeState = {
        id: null,
        title: "",
        name: "",
        ingredients: [],
    };
    const [currentRecipe, setCurrentRecipe] = useState(initialRecipeState);
    const [currentMappedIngredients, setCurrentMappedIngredients] = useState([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        const getRecipe = id => {
            get(id)
                .then(response => {
                    setCurrentRecipe(response.data);
                    setCurrentMappedIngredients(mapIngredients(response.data.ingredients));
                })
                .catch(e => {
                    console.log(e);
                });
        };

        getRecipe(props.match.params.id);
    }, [props.match.params.id]);

    const handleInputChange = event => {
        const { name, value } = event.target;

        setCurrentRecipe({ ...currentRecipe, [name]: value });
    };

    const handleIngredientAdded = ({ inputValue, value }) => {
        const ingredients = convertIngredients({ inputValue, value });

        setCurrentRecipe({ ...currentRecipe, ingredients });
        setCurrentMappedIngredients(mapIngredients(ingredients));
    }

    const handleIngredientRemoved = ({ value }) => {
        const ingredients = convertIngredients({ value });

        setCurrentRecipe({ ...currentRecipe, ingredients });
        setCurrentMappedIngredients(mapIngredients(ingredients));
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

    const mapIngredients = (ingredients) => {
        const reducer = (existingIngredients, newIngredient) => {
            existingIngredients.push({
                label: newIngredient.name,
                value: newIngredient.name,
            });

            return existingIngredients;
        };

        const mappedIngredients = ingredients.reduce(reducer, []);

        return mappedIngredients
    };

    const updateRecipe = () => {
        update(currentRecipe.id, currentRecipe)
            .then(response => {
                setMessage("The recipe was updated successfully!");
            })
            .catch(e => {
                console.log(e);
            });
    };

    const deleteRecipe = () => {
        remove(currentRecipe.id)
            .then(response => {
                props.history.push("/recipes");
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div>
            {currentRecipe ? (
                <div className="edit-form">
                    <h4>Recipe</h4>
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Name: </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={currentRecipe.name}
                                onChange={handleInputChange}
                                data-testid="name-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description: </label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                value={currentRecipe.description}
                                onChange={handleInputChange}
                                data-testid="description-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ingredients">Ingredients: </label>
                            <CreatableInputOnly
                                handleIngredientAdded={handleIngredientAdded}
                                handleIngredientRemoved={handleIngredientRemoved}
                                ingredients={currentMappedIngredients}
                            />
                        </div>
                    </form>

                    <button
                        className="btn btn-danger"
                        onClick={deleteRecipe}
                        data-testid="delete-btn"
                    >
                        Delete
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        onClick={updateRecipe}
                        data-testid="update-btn"
                    >
                        Update
                    </button>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Please click on a Recipe...</p>
                </div>
            )}
        </div>
    );
};

export default Recipe;