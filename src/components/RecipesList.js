import React, { useState, useEffect } from "react";
import { getAll, findByName } from "../services/RecipeService"
import RecipesListView from "./RecipeListView";

const RecipesList = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        retrieveRecipes();
    }, []);

    const onChangeSearchName = e => {
        const searchName = e.target.value;
        setSearchName(searchName);
    };


    const retrieveRecipes = () => {
        getAll()
            .then(response => {
                setRecipes(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const setActiveRecipe = (recipe, index) => {
        setCurrentRecipe(recipe);
        setCurrentIndex(index);
    };

    const getByName = () => {
        findByName(searchName)
            .then(response => {
                setRecipes(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={getByName}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <h4>Recipes List</h4>

                <ul className="list-group">
                    {recipes &&
                        recipes.map((recipe, index) => (
                            <li data-testid="recipe-item"
                                className={
                                    "list-group-item " + (index === currentIndex ? "active" : "")
                                }
                                onClick={() => setActiveRecipe(recipe, index)}
                                key={index}
                            >
                                {recipe.name}
                            </li>
                        ))}
                </ul>

            </div>
            <div className="col-md-6">
                <RecipesListView
                    currentRecipe={currentRecipe}
                />
            </div>
        </div>
    );
};

export default RecipesList;