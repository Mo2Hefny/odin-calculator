const MAX_NUMBER = 10000000000000000;
const MAX_DECIMALS = 3;
const history = document.querySelector("#history");
const screen = document.querySelector("#screen");
const buttons = document.querySelector(".buttons");
const screenNumber = document.getElementById("screen-number");
const screenEquation = document.getElementById("screen-equation");

let selectedOperator = "";
let ans = "";
let decimal = false;
let decimalDigits = 0;

buttons.addEventListener("click", handleUserInput);

console.log(screenEquation.textContent);
console.log(screenNumber.textContent);

function handleUserInput(event) {
  const button = event.target.closest("button");
  if (button.classList.contains("num-btn")) {
    handleNumberChange(button);
  }
  console.log(button);
}

function handleNumberChange(button) {
  const ID = button.getAttribute("id");
  let number = parseFloat(screenNumber.textContent.replace(/,/g, ""));
  if (ID == "switch") number = -number;
  else if (ID == "decimal" && !decimal) {
    return toggleDecimalNumber();
  } else {
    return appendNumber(number, button.textContent);
  }

  if (Math.abs(number) > MAX_NUMBER) return;
  let commas = number.toLocaleString("en-US");
  screenNumber.textContent = commas;
}

function toggleDecimalNumber() {
  if (decimal) return;
  decimal = true;
  if (screenNumber.textContent === "") screenNumber.textContent += "0";
  screenNumber.textContent += ".";
}

function appendNumber(number, digit) {
  if (Math.abs(number) > MAX_NUMBER) return;
  if (decimal && decimalDigits >= MAX_DECIMALS) return;
  if (decimal) {
    number = Number(screenNumber.textContent + digit);
    decimalDigits++;
  } else {
    number = Number(number + digit);
  }
  if (Math.abs(number) > MAX_NUMBER) return;
  let commas = number.toLocaleString("en-US");
  screenNumber.textContent = commas;
}
