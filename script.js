const searchBox = document.querySelector('.searchBox'); 
const searchButton = document.querySelector('.searchbutton'); 
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeDetails = document.querySelector('.recipe-details');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Fetch recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const response = await data.json();

  recipeContainer.innerHTML = '';//clear prev

  if (response.meals) {
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>Area: ${meal.strArea}</p>
        <p>Category: ${meal.strCategory}</p>
      `;

      const button = document.createElement('button');
      button.textContent = "View Recipe";
      button.addEventListener('click', () => {
        openRecipePopup(meal);
      });

      recipeDiv.appendChild(button);
      recipeContainer.appendChild(recipeDiv);
    });
  } else {
    recipeContainer.innerHTML = `<p>No recipes found for "${query}".</p>`;
  }
};

// Fetch ingredients
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) { //apply loop 1 to 20 coz 20 item max presnt in each
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// Open popup
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <div class="section">
      <h3>Ingredients</h3>
      <ul class="ingredient-list">${fetchIngredients(meal)}</ul>
    </div>
    <div class="section instructions-section">
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
  recipeDetails.style.display = "block";
};

// Close popup
recipeCloseBtn.addEventListener('click', () => {
  recipeDetails.style.display = "none";
});

// Search
searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput !== "") {
    fetchRecipes(searchInput);
  }
});
