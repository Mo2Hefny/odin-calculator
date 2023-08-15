const MAX_NUMBER = 10000000000000000;
const MAX_DECIMALS = 3;
const history = document.querySelector("#history");
const screen = document.querySelector("#screen");
const buttons = document.querySelector(".buttons");
const screenNumber = document.getElementById("screen-number");
const screenEquation = document.getElementById("screen-equation");
let equation = [0];
let selectedOperator = "";
let editingNumber = 0;
let decimal = false;
let newEntry = false;
let decimalDigits = 0;

buttons.addEventListener("click", handleUserInput);
history.addEventListener("click", loadFromHistory);

console.log(screenEquation.textContent);
console.log(screenNumber.textContent);

function handleUserInput(event) {
  const button = event.target.closest("button");
  if (button.classList.contains("num-btn")) {
    handleNumberChange(button);
  }
  else {
    handleFunctions(button);
  }
  console.log(button);
}

function handleNumberChange(button) {
  const ID = button.getAttribute("id");
  if (newEntry && ID != "switch") {
    if (editingNumber === 0)  clearAll();
    screenNumber.textContent = 0;
    newEntry = false;
  }
  let number = parseFloat(screenNumber.textContent.replace(/,/g, ""));
  
  if (ID == "switch") number = -number;
  else if (ID == "decimal") {
    return toggleDecimalNumber();
  }
  else {
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
  }
  else {
    number = Number(number + digit);
  }
  if (Math.abs(number) > MAX_NUMBER) return;
  equation[editingNumber] = number;
  let commas = number.toLocaleString("en-US");
  screenNumber.textContent = commas;
}

function handleFunctions(button) {
  const ID = button.getAttribute("id");
  switch (ID) {
    case "divide": handleOperations("/"); break;
    case "multiply": handleOperations("*"); break;
    case "add": handleOperations("+"); break;
    case "subtract": handleOperations("-"); break;
    case "result" : solveEquation(); break;
    case "clearEntry" : clearEntry(); break;
    case "clearAll" : clearAll(); break;
    case "backspace" : clearAll(); break;
    case "percentage" : clearAll(); break;
    case "divisor" : clearAll(); break;
    case "power" : clearAll(); break;
    case "root" : clearAll(); break;
  }
}

function handleOperations(operation) {
  if (selectedOperator === operation) return;
  selectedOperator = operation;
  equation[1] = operation;
  if (equation[2] != Number(screenNumber.textContent))
  {
    newEntry = true;
    decimal = false;
    equation[2] = Number(screenNumber.textContent);
  }
  editingNumber = 2;
  let commas = equation[0].toLocaleString("en-US") + " " + equation[1];
  screenEquation.textContent = commas;
}

function solveEquation() {
  decimal = false;
  newEntry = true;
  editingNumber = 0;
  if (equation[1] == undefined) {
    screenEquation.textContent = equation[0] + " =";
    screenNumber.textContent = equation[0];
    return addToHistory();
  }
  screenEquation.textContent = equation[0].toLocaleString("en-US") + " " + equation[1] + " " + equation[2].toLocaleString("en-US") + " =";
  switch (equation[1]) {
    case "/": equation[0] = div(equation[0], equation[2]); break;
    case "*": equation[0] = mul(equation[0], equation[2]); break;
    case "+": equation[0] = add(equation[0], equation[2]); break;
    case "-": equation[0] = sub(equation[0], equation[2]); break;
  }
  if (equation[0] === undefined) return clearAll();
  selectedOperator = "";
  screenNumber.textContent = equation[0].toLocaleString("en-US");
  addToHistory();
}

function addToHistory() {
  const section = document.createElement('div');
  const equation = document.createElement('p');
  const number = document.createElement('h1');

  section.classList.add('section');
  equation.classList.add('equation');
  equation.textContent = screenEquation.textContent;
  number.classList.add('number');
  number.textContent = screenNumber.textContent;
  section.append(equation);
  section.append(number);
  history.prepend(section);
}

function mul(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return a * b;
}

function div(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return a / b;
}

function add(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return a + b;
}

function sub(a, b) {
  if (a === undefined || b === undefined) return undefined;
  return a - b;
}

function clearAll() {
  screenEquation.textContent = "";
  screenNumber.textContent = 0;
  equation = [0, undefined, undefined];
  selectedOperator = "";
  editingNumber = 0;
  decimal = false;
  decimalDigits = 0;
  newEntry = false;
}

function clearEntry() {
  if (screenEquation.textContent === "") return;
  if (screenEquation.textContent[-1] === "=") return clearAll();
  screenNumber.textContent = 0;
  decimal = false;
  decimalDigits = 0;
  newEntry = false;
}

function loadFromHistory(event) {
  const section = event.target.closest('.section');
  if (section === undefined) return;
  screenEquation.textContent = section.firstChild.textContent;
  screenNumber.textContent = section.lastChild.textContent;
  equation = section.firstChild.textContent.split(" ");
  equation[0] = parseFloat(screenNumber.textContent.replace(/,/g, ""));
  equation[2] = parseFloat(equation[2].replace(/,/g, ""));
  equation.pop();
  selectedOperator = "";
  newEntry = true;
  editingNumber = 0;
  decimal = false;
}