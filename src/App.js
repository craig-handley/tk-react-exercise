import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, Link } from "react-router-dom";
import AddRecipe from "./components/AddRecipe";
import Recipe from "./components/Recipe";
import RecipesList from "./components/RecipesList";
import { BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <a href="/recipes/" className="navbar-brand">
                        Travelperk React Exercise
                    </a>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/recipes"} className="nav-link">
                                Recipes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/add"} className="nav-link">
                                Add
                            </Link>
                        </li>
                    </div>
                </nav>

                <div className="container mt-3">
                    <Switch>
                        <Route exact path={["/", "/recipes"]} component={RecipesList} />
                        <Route exact path="/add" component={AddRecipe} />
                        <Route path="/recipes/:id" component={Recipe} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}


export default App;
