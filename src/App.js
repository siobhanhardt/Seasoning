import React, { Component } from "react";
import "./styles.css";
import heart from "./heart.png";
import { Recipes } from "./recipes";
import { Produce } from "./produce";
const localRecipes = Recipes;
const localProduce = Produce;
const current = new Date();
const curMonth = current.getMonth() + 1; // gets current month so the NOW filter will be for the specific month not season
let basket = [];

function getRecipeStart(object) {
  // function that finds the season beginning of a recipe based off the produce in it
  let start = "2022-01-01"; // initiliase start at earliest possibility
  for (let j = 0; j < object.ingredients.length; j++) {
    for (let i = 0; i < localProduce.length; i++) {
      if (object.ingredients[j].name.includes(localProduce[i].name)) {
        // runs through every ingredient name and checks if it is in the produce JSON
        let tempStart = localProduce[i].seasonStart;
        if (tempStart > start) {
          start = tempStart;
          // if the start season for the produce is later in the year than start update it
        }
      }
    }
  }
  return start; // after running through everything this will return the latest date as a String
}
function getRecipeEnd(object) {
  // function that finds the season end of a recipe based off the produce in it
  let end = "2023-12-31"; // initiliase end at latest possibility
  for (let j = 0; j < object.ingredients.length; j++) {
    for (let i = 0; i < localProduce.length; i++) {
      if (object.ingredients[j].name.includes(localProduce[i].name)) {
        // runs through every ingredient name and checks if it is in the produce JSON
        let tempEnd = localProduce[i].seasonEnd;
        if (tempEnd < end) {
          // if the end season for the produce is earlier in the year than end update it
          end = tempEnd;
        }
      }
    }
  }
  return end; // after running through everything this will return the earliest date as a String
}
function getSeason(start, end) {
  //takes in two dates and returns an array
  let recipeSeasons = [];
  let startNum = new Date(start); //turns start String into date
  let startMonth = startNum.getMonth() + 1; //get month number and add one so numbers run from 1 - 12
  let startYear = startNum.getFullYear(); //get year from date
  let endNum = new Date(end); //turns end String into date
  let endMonth = endNum.getMonth() + 1; //get month number and add one so numbers run from 1 - 12
  let endYear = endNum.getFullYear(); //get year from date
  if (startYear === endYear) {
    // if the years are the same, we can just add the month numbers into the array using 1 for loop
    let j = 0;
    for (let i = startMonth; i <= endMonth; i++) {
      recipeSeasons[j++] = i;
    }
  } else {
    // if the years aren't the same we need 1 for loops for each year
    let j = 0;
    for (let i = startMonth; i <= 12; i++) {
      // for loop for the start month til 12 (December)
      recipeSeasons[j++] = i;
    }
    for (let i = 1; i <= endMonth; i++) {
      //for lop from 1 (January) til end month
      recipeSeasons[j++] = i;
    }
  }
  return recipeSeasons; // returns an array with all the months the recipe is in season for as integers
}
function addToBasket(itemID) {
  let foundObj = localRecipes.filter(findObjectByRecipeName(itemID));
  let index = basket.findIndex(findObjectByRecipeName(itemID)); // get the index
  if (basket.length > 0 && index >= 0) {
    // if the object is already in the basket array
    basket.splice(index, 1); // remove it
  } else {
    basket = basket.concat(foundObj); // else add object to basket array
  }
}
function findObjectByRecipeName(recipeToFind) {
  return function (recipeObject) {
    return recipeObject.name.includes(recipeToFind);
  };
}
const sorts = {
  //sort functions in an array so they can be returned as objects
  sortAZ: (dx, dy) => {
    let DX = dx.name.toUpperCase();
    let DY = dy.name.toUpperCase();
    if (DX > DY) return 1;
    else if (DX < DY) return -1;
    else return 0;
  },
  sortZA: (dx, dy) => {
    let DX = dx.name.toUpperCase();
    let DY = dy.name.toUpperCase();
    if (DX < DY) return 1;
    else if (DX > DY) return -1;
    else return 0;
  }
};

const filters = {
  // filter functions in an array so they can be returned as objects
  checkNow: function (object) {
    //
    // if the array returned using the getSeason function includes current month return object
    if (
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(curMonth)
    ) {
      return object.name;
    }
  },
  checkSpring: function (object) {
    // if the array returned using the getSeason function includes 3 or 4 or 5 (Mar, Apr, May) return recipe object
    if (
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(3) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(4) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(5)
    ) {
      return object.name;
    }
  },
  checkSummer: function (object) {
    // if the array returned using the getSeason function includes 6 or 7 or 8 (Jun, Jul, Aug) return recipe object
    if (
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(6) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(7) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(8)
    ) {
      return object.name;
    }
  },
  checkAutumn: function (object) {
    // if the array returned using the getSeason function includes 9 or 10 or 11 (Sep, Oct, Nov) return recipe object
    if (
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(9) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(10) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(11)
    ) {
      return object.name;
    }
  },
  checkWinter: function (object) {
    // if the array returned using the getSeason function includes 12 or 1 or 2 (Dec, Jan, Feb) return recipe object
    if (
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(12) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(1) ||
      getSeason(getRecipeStart(object), getRecipeEnd(object)).includes(2)
    ) {
      return object.name;
    }
  }
};

function renderRecipeFunction(j, i, toggleFunction, toggleRecipes) {
  return (
    // if togglerecipes array has nothing inside or if index includes then display buttons.
    // For nothing display all, otherwise display value of i from our togglefunction
    (toggleRecipes.length === 0 || toggleRecipes.includes(i)) && (
      // creating a parent div with relative position so children cab be styled with absolute positioning
      // and we have seperate sizings for the recipe images if it is rendering all(length===0)
      // or if it is a single recipe then display a stretched image
      <div
        className={toggleRecipes.length === 0 ? "recipeCard" : "singleRecipe"}
      >
        <button
          // button for recipe images with togglefunction being passed in
          className={
            toggleRecipes.length === 0 ? "recipeButton" : "singleRecipeButton"
          }
          onClick={() => toggleFunction(i)}
        >
          <div class="gfg">
            <h2 class="title">
              <b>{j.name}</b>
            </h2>
          </div>
          <img class="imageButton" alt="recipe" src={j.imageURL} />
          <button
            // button for heart favourite with the name property being passed into addToBasket
            // Both buttons having seperate classes to have unique css styling
            class="favouriteButton"
            onClick={(e) => {
              // stops button click bubbling to next button
              e.stopPropagation();
              addToBasket(j.name);
            }}
          >
            <img class="favImage" alt="recipe" src={heart} />
          </button>
        </button>

        {toggleRecipes.includes(i) && (
          // if togglerecipes array includes i then display ingredients and steps but no other recipes
          <div>
            <div class="ingredientsTitle">
              <h3>
                <b> Ingredients </b>
              </h3>
            </div>
            <ul class="ingredients">
              {j.ingredients.map((b, index) => (
                <li class="ingredientListItem" key={index}>
                  {b.quantity} &nbsp;
                  {b.name}
                </li>
                // Map function to display ingredients quantity and name in an unordered list when the image is pressed
              ))}
            </ul>
            <div class="ingredientsTitle">
              <h3>
                <b> Steps </b>
              </h3>
            </div>
            {j.steps.map((m, mindex) => (
              <li class="steps" key={mindex}>
                {m}
              </li>
              // Map function to display the steps when image is pressed in a list format
              // Seperate classnames so we can style independently
            ))}
          </div>
        )}
      </div>
    )
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeArray: localRecipes,
      menu: "Home",
      toggleRecipes: [],
      searchTerm1: "",
      len: 0,
      sortChoice: null,
      filterChoice: "checkNow"
    };
    this.buttonHomeAction = this.buttonHomeAction.bind(this);
    this.onSearchBarChange = this.onSearchBarChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.favouritesAction = this.favouritesAction.bind(this);
  }
  // for each handler we reset toggleRecipes so we can return from a recipe to home etc.
  // so our conditional rendering in renderRecipe displays all of the recipes again allowing us to come out of a full recipe page
  onSearchBarChange(event) {
    this.setState({ searchTerm1: event.target.value, toggleRecipes: [] }); //set searchTerm and reset toggleRecipes
    let sTerm = event.target.value;
    let numChars = sTerm.length; // get length
    this.setState({ len: numChars }); //update len to length
  }
  handleSortChange(event) {
    this.setState({ sortChoice: event.target.value, toggleRecipes: [] });
    // updates sortChoice from dropdown and resets toggleRecipes
  }
  handleFilterChange(event) {
    this.setState({ filterChoice: event.target.value, toggleRecipes: [] });
    //updates filterChoice and resets toggleRecipes
  }

  buttonHomeAction() {
    this.setState({
      menu: "Home", //so you can change between home and favourites
      toggleRecipes: [], // resets togglerecipes so singleRecipe isnt displayed
      filterChoice: "checkNow" // resets filter to current date
    });
  }
  favouritesAction() {
    this.setState({ menu: "Favourite", toggleRecipes: [] });
    //change to favourites menu and resets toggleRecipes
  }

  render() {
    return (
      <div className="App">
        {this.state.menu === "Home" && (
          <SearchBar
            searchTerm1={this.state.searchTerm1}
            onChange={this.onSearchBarChange}
          />
        )}
        {this.state.menu === "Home" && (
          <table class="sortTable">
            <tr>
              <td>
                <form>
                  <select onChange={this.handleSortChange}>
                    {<option value="null">SORT BY</option>}
                    <option value="sortAZ">A - Z</option>
                    <option value="sortZA">Z - A</option>
                  </select>
                </form>
              </td>
              <td>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp;
              </td>
              <td>
                <form>
                  <select onChange={this.handleFilterChange}>
                    <option value="checkNow">NOW</option>
                    <option value="checkSpring">SPRING</option>
                    <option value="checkSummer">SUMMER</option>
                    <option value="checkAutumn">AUTUMN</option>
                    <option value="checkWinter">WINTER</option>
                  </select>
                </form>
              </td>
            </tr>
          </table>
        )}
        {this.state.len >= 0 && (
          <SearchResult
            searchTerm1={this.state.searchTerm1}
            recipeArray={this.state.recipeArray}
            // changed toggle function to push value i into an array(togglerecipes)
            // and instead of splicing like in the addtobasket() we filter out if pressed again
            toggleFunction={(i) => {
              let toggleContains = this.state.toggleRecipes.includes(i);
              if (toggleContains) {
                this.setState({
                  toggleRecipes: this.state.toggleRecipes.filter((a) => a !== i)
                });
              } else {
                let tempState = this.state.toggleRecipes;
                tempState.push(i);
                this.setState({
                  toggleRecipes: tempState
                });
              }
            }}
            toggleRecipes={this.state.toggleRecipes}
          />
        )}
        {this.state.len === 0 && this.state.menu === "Home" && (
          // if nothing is being searched and we are on home then display recipe component that will take in our props
          <RecipeComponent
            season={filters[this.state.filterChoice]} //value passed from dropdown to filterChoice, selected from filters array
            sort={sorts[this.state.sortChoice]} //value passed from dropdown to sortChoice, selected from sorts array
            toggleFunction={(i) => {
              let toggleContains = this.state.toggleRecipes.includes(i);
              if (toggleContains) {
                this.setState({
                  toggleRecipes: this.state.toggleRecipes.filter((a) => a !== i)
                });
              } else {
                let tempState = this.state.toggleRecipes;
                tempState.push(i);
                this.setState({
                  toggleRecipes: tempState
                });
              }
            }}
            toggleRecipes={this.state.toggleRecipes}
          />
        )}
        {this.state.menu === "Favourite" && (
          // If favourite is selected we display the favourite component instead whichs renders the basket array
          <FavouriteComponent
            toggleFunction={(i) => {
              // create a boolean to work with our object(i) in our toggleRecipes array
              let toggleContains = this.state.toggleRecipes.includes(i);
              // if it contains the value already then filter it out by setting state of toggleRecipes to not equal that value
              if (toggleContains) {
                this.setState({
                  toggleRecipes: this.state.toggleRecipes.filter((a) => a !== i)
                });
                // otherwise push value of (i) into a temp array and setState of toggleRecipes to hold that value
              } else {
                let tempState = this.state.toggleRecipes;
                tempState.push(i);
                this.setState({
                  toggleRecipes: tempState
                });
              }
            }}
            // now we pass the toggleRecipes property through to renderRecipe
            toggleRecipes={this.state.toggleRecipes}
          />
        )}
        <div class="clear"></div>
        <div class="footer">
          <div class="footer-content">
            <button class="hbtn-svg" id="home-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="grey"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={this.buttonHomeAction}
              >
                <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9" />
                <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6" />
              </svg>
            </button>
            &nbsp; &nbsp;
            <button class="fbtn-svg" id="favourites-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="grey"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={this.favouritesAction}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
class SearchBar extends Component {
  render() {
    const searchTerm1FromProps = this.props.searchTerm1;
    const onChangeFromProps = this.props.onChange;

    return (
      <div className="SearchBar">
        <form>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm1FromProps}
            onChange={onChangeFromProps}
          />
        </form>
      </div>
    );
  }
}

class SearchResult extends Component {
  recipeFilterFunction(searchTerm1) {
    return function (recipeObject) {
      let array = JSON.stringify(recipeObject).toLowerCase(); //converts all recipes into strings so we can search everything
      return (
        searchTerm1 !== "" && //if search is not emty
        searchTerm1.length >= 3 && // and length greater than 3
        array.includes(searchTerm1.toLowerCase()) //returns all recipes that inlcudes search term
      );
    };
  }
  render() {
    const arrayPassedAsParameter = this.props.recipeArray;
    const searchTerm1FromProps = this.props.searchTerm1;

    return (
      <div className="SearchResult">
        <div class="columns">
          {arrayPassedAsParameter
            .filter(this.recipeFilterFunction(searchTerm1FromProps)) //filter array to display objects returned by function above
            .map((j, i) =>
              renderRecipeFunction(
                j,
                i,
                this.props.toggleFunction,
                this.props.toggleRecipes
              )
            )}
        </div>
      </div>
    );
  }
}

class RecipeComponent extends Component {
  render() {
    // j, i being passed through each component to be mapped
    return (
      // Classname columns for css so we can order the recipe images in columns of 2
      // LocalRecipes array is sorted, filtered and then sent in to be mapped by which is rendered by renderRecipeFunction
      // Array passed through j, the index value is i, and then we pass in our two properties
      <div className={this.props.season}>
        <div class="columns">
          {localRecipes
            .sort(this.props.sort)
            .filter(this.props.season)
            .map((j, i) =>
              renderRecipeFunction(
                j,
                i,
                this.props.toggleFunction,
                this.props.toggleRecipes
              )
            )}
        </div>
      </div>
    );
  }
}
class FavouriteComponent extends Component {
  render() {
    return (
      // Same as recipeComponent except this time we use basket array
      <div className={this.props.season}>
        <h3>FAVOURITES</h3>
        <div class="columns">
          {basket.map((j, i) =>
            renderRecipeFunction(
              j,
              i,
              this.props.toggleFunction,
              this.props.toggleRecipes
            )
          )}
        </div>
      </div>
    );
  }
}

export default App;
