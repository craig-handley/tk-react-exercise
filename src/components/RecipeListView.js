import { Link } from "react-router-dom";

const RecipesListView = ({ currentRecipe }) => {

    return (
        <>
            {currentRecipe ? (
                <div>
                    <h4>Recipe</h4>
                    <div data-testid="name">
                        <label>
                            <strong>Name:</strong>
                        </label>{" "}
                        {currentRecipe.name}
                    </div>
                    <div data-testid="description">
                        <label>
                            <strong>Description:</strong>
                        </label>{" "}
                        {currentRecipe.description}
                    </div>
                    <div data-testid="ingredients">
                        <label>
                            <strong>Ingredients:</strong>
                        </label>{" "}
                        {currentRecipe.ingredients.map((ingredient) => {
                            return ingredient.name
                        }).join(', ')}
                    </div>

                    <Link data-testid="edit-btn"
                        to={"/recipes/" + currentRecipe.id}
                        className="badge bg-warning text-dark"
                    >
                        Edit
                    </Link>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Please click on a Recipe...</p>
                </div>
            )}
        </>
    );
}

export default RecipesListView;