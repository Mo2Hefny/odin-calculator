const MAX_NUMBER = 10000000000000000;
const MAX_DECIMALS = 3;
const history = document.querySelector("#history");
const screen = document.querySelector("#screen");
const buttons = document.querySelector(".buttons");
const screenNumber = document.getElementById("screen-number");
const screenEquation = document.getElementById("screen-equation");
let equation = [0];
let equationText = ["0"];
let error = false;
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
  if (error) { clearAll(); }
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
  
  if (ID == "switch" && number) { 
    number = -number;
    equation[editingNumber] = number;
    equation[editingNumber] = number.toLocaleString("en-US");
  }
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
  let commas = number.toLocaleString("en-US");
  equation[editingNumber] = number;
  equationText[editingNumber] = commas;
  screenNumber.textContent = commas;
}

function subtractNumber() {
  let number = parseFloat(screenNumber.textContent.replace(/,/g, ""));
  if (newEntry) {
    number = 0;
    decimal = false;
    newEntry = false;
  }
  else if (decimal) {
    if (decimalDigits) {
      decimalDigits--;
      number = Math.floor(number * 10 ** decimalDigits);
      number /= 10 ** decimalDigits;
    }
    if (decimalDigits === 0) decimal = false;
  }
  else if (!decimal && number) {
    number = Math.floor(number / 10);
  }
  screenNumber.textContent = number.toLocaleString("en-US");
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
    case "backspace" : subtractNumber(); break;
    case "percentage" : percentage(); break;
    case "divisor" : divisor(); break;
    case "power" : power(); break;
    case "root" : squareRoot(); break;
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
    equationText[2] = screenNumber.textContent.toLocaleString("en-US");
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
    screenEquation.textContent = equationText[0] + " =";
    screenNumber.textContent = equation[0];
    return addToHistory();
  }
  screenEquation.textContent = equationText[0] + " " + equation[1] + " " + equationText[2] + " =";
  switch (equation[1]) {
    case "/": equation[0] = div(equation[0], equation[2]); break;
    case "*": equation[0] = mul(equation[0], equation[2]); break;
    case "+": equation[0] = add(equation[0], equation[2]); break;
    case "-": equation[0] = sub(equation[0], equation[2]); break;
  }
  if (equation[0] === undefined) return;
  equationText[0] = equation[0];
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
  if (a === undefined || b === undefined) { error = true; return undefined;}
  const MAX_NUMBER_TO_MULTIPLY = MAX_NUMBER / Math.max(Math.abs(a), Math.abs(b));
  if (MAX_NUMBER_TO_MULTIPLY < Math.min(Math.abs(a), Math.abs(b))) {
    screenNumber.textContent = "Exceeds the maximum allowed number.";
    error = true;
    return undefined;
  }
  return a * b;
}

function div(a, b) {
  if (a === undefined || b === undefined) return undefined;
  if (b === 0) {
    screenNumber.textContent = "Can't divide by zero.";
    error = true;
    return undefined;
  }
  const MAX_NUMBER_TO_MULTIPLY = MAX_NUMBER / Math.abs(a);
  if (MAX_NUMBER_TO_MULTIPLY < Math.abs(1 / b)) {
    screenNumber.textContent = "Exceeds the maximum allowed number.";
    error = true;
    return undefined;
  }
  return a / b;
}

function add(a, b) {
  if (a === undefined || b === undefined) return undefined;
  if (MAX_NUMBER < Math.abs(a + b)) {
    screenNumber.textContent = "Exceeds the maximum allowed number.";
    error = true;
    return undefined;
  }
  return a + b;
}

function sub(a, b) {
  if (a === undefined || b === undefined) return undefined;
  if (MAX_NUMBER < Math.abs(a - b)) {
    screenNumber.textContent = "Exceeds the maximum allowed number.";
    error = true;
    return undefined;
  }
  return a - b;
}

function divisor() {
  if (equation[editingNumber] === 0) {
    screenNumber.textContent = "Can't divide by zero.";
    error = true;
    return;
  }
  equationText[editingNumber] = `1/(${equation[editingNumber]})`;
  equation[editingNumber] = 1 / equation[editingNumber];
  solveEquation();
}

function squareRoot() {
  if (equation[editingNumber] < 0) {
    screenNumber.textContent = "Invalid input.";
    error = true;
    return;
  }
  equationText[editingNumber] = `sqrt(${equation[editingNumber]})`;
  equation[editingNumber] = Math.sqrt(equation[editingNumber]);
  solveEquation();
}

function power() {
  const MAX_NUMBER_SQRT = Math.sqrt(MAX_NUMBER);
  if (equation[editingNumber] > MAX_NUMBER_SQRT) {
    screenNumber.textContent = "Exceeds the maximum allowed number.";
    error = true;
    return;
  }
  equationText[editingNumber] = `pow(${equation[editingNumber]})`;
  equation[editingNumber] = Math.pow(equation[editingNumber], 2);
  solveEquation();
}

function percentage() {
  equationText[editingNumber] = equation[editingNumber] /= 100;
  solveEquation();
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
  error = false;
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
  equationText = section.firstChild.textContent.split(" ");
  equation[0] = parseFloat(screenNumber.textContent.replace(/,/g, ""));
  equationText[0] = equation[0];
  equation[1] = (equationText[1] === '=') ? undefined : equationText[1];
  equation[2] = extractNumber(equationText[2]);
  equationText.pop();
  selectedOperator = "";
  newEntry = true;
  editingNumber = 0;
  decimal = false;
}

function extractNumber(string) {
  if (string === undefined) return 0;
  if (string[0] >= '0' && string[0] <= '9') return parseFloat(string.replace(/,/g, ""));
  return parseFloat(string.substring(string.indexOf('(') + 1, string.indexOf(')')).replace(/,/g, ""));
}