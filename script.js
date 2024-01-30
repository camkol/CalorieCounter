// Get references to DOM elements
const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
let isError = false;

// Function to remove special characters from a string
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

// Function to check if input string contains invalid format
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Function to add an entry based on user input
function addEntry() {
  // Select the target input container based on the dropdown value
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );

  // Calculate the entry number by counting existing input fields
  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  // Create HTML string for the new entry
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input
      type="number"
      min="0"
      id="${entryDropdown.value}-${entryNumber}-calories"
      placeholder="Calories"
    />`;

  // Append the new entry to the target input container
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// Function to calculate calories and update the output
function calculateCalories(e) {
  // Prevent the default form submission behavior
  e.preventDefault();
  isError = false;

  // Get input fields for different meals and exercise
  const breakfastNumberInputs = document.querySelectorAll(
    "#breakfast input[type=number]"
  );
  const lunchNumberInputs = document.querySelectorAll(
    "#lunch input[type=number]"
  );
  const dinnerNumberInputs = document.querySelectorAll(
    "#dinner input[type=number]"
  );
  const snacksNumberInputs = document.querySelectorAll(
    "#snacks input[type=number]"
  );
  const exerciseNumberInputs = document.querySelectorAll(
    "#exercise input[type=number]"
  );

  // Get calories for each meal and exercise
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

  // Get the budgeted calories
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  // Check for errors
  if (isError) {
    return;
  }

  // Calculate consumed calories, remaining calories, and surplus/deficit
  const consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

  // Update the output with the calculated information
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
    remainingCalories
  )} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;

  // Show the output
  output.classList.remove("hide");
}

// Function to clear the form and reset values
function clearForm() {
  // Get all input containers
  const inputContainers = Array.from(
    document.querySelectorAll(".input-container")
  );

  // Clear the content of each input container
  for (let i = 0; i < inputContainers.length; i++) {
    inputContainers[i].innerHTML = "";
  }

  // Clear the budget input and output
  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add("hide");
}

// Event listeners for buttons
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
