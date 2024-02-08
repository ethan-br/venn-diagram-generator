/**
 * @author Ethan Braunstein
 *
 * @typedef {string[]} stringArray
 * @typedef {"&" | "|" | "-" | "*"} operator
 */

// Init global constants
const A = new Set();
A.add("a");
A.add("ab");
A.add("ac");
A.add("abc");
const B = new Set();
B.add("b");
B.add("ab");
B.add("bc");
B.add("abc");
const C = new Set();
C.add("c");
C.add("bc");
C.add("ac");
C.add("abc");
const OPERATORS = ["&", "|", "-", "*"];

/**
 * Checks if parentheses in a string are balanced.
 * @param {string} string
 */
function hasBalancedParentheses(string) {
	let stack = []; //Init stack
	for (const char of string) {
		// Loop through chars in string
		if (char === "(") {
			stack.push(char); // If "(", push to stack
		} else if (char === ")") {
			if (stack.length === 0) {
				// Edge case where there is a ")" before a "(" is found
				return false;
			}
			stack.pop(); // If ")", pop from stack
		}
	}
	return stack.length === 0;
}

/**
 * Checks if string contains parentheses.
 * @param {string} string
 */
function hasParentheses(string) {
	return string.includes("(") || string.includes(")");
}

/**
 * Counts number of parentheses pairs in a string.
 * @param {string} string
 */
function countParenthesesPairs(string) {
	let pairsCount = 0;
	let openCount = 0;
	for (let i = 0; i < string.length; i++) {
		if (string[i] === "(") {
			openCount++;
		} else if (string[i] === ")") {
			if (openCount > 0) {
				pairsCount++;
				openCount--;
			} else {
				console.log("Error: Unmatched closing parenthesis at index " + i);
			}
		}
	}
	return pairsCount;
}

/**
 * Separates highest depth operation into an array.
 * @param  {string}   expr
 * @return {stringArray} operation
 */
function findOperation(expr) {
	let stack = []; // Init stack
	for (let i = 0; i < expr.length; i++) {
		// Loop through index of expr
		if (expr[i] === "(") {
			stack.push("("); // If "(", push to stack
		} else if (expr[i] === ")") {
			stack.pop(); // If ")", push to stack
		} else {
			if (stack.length === 0 && OPERATORS.includes(expr[i])) {
				// Not in paretheses scope and operator is found
				console.log("Operation found:", [expr.slice(0, i), expr[i], expr.slice(i + 1)]);
				return [expr.slice(0, i), expr[i], expr.slice(i + 1)]; // operand1, operator, operand2
			}
		}
	}
	return null; // No outside operation is found
}

/**
 * Translates operation into corresponding Set() method
 * @param {string} operand1
 * @param {operator} operator Either an "&", "|", "-", or "*".
 * @param {string} operand2
 */
function translateOperation(operand1, operator, operand2) {
	console.log("Translating:", [operand1, operator, operand2]);
	// Concatenate with correct Set() method
	if (operator === "&") {
		return `${operand1}.union[${operand2}]`;
	} else if (operator === "|") {
		return `${operand1}.intersection[${operand2}]`;
	} else if (operator === "-") {
		return `${operand1}.difference[${operand2}]`;
	} else if (operator === "*") {
		return `${operand1}.symmetricDifference[${operand2}]`;
	} else {
		return ""; // Edge case
	}
}

/**
 * Processes text expression into valid Javascript code.
 * @param {string} expr
 */
function processExpr(expr) {
	expr = expr.replace(/\s+/g, ""); // Remove whitespace
	console.log("Processing:", expr);
	if (hasParentheses(expr)) {
		if (hasBalancedParentheses(expr)) {
			console.log("If Case");
			let [operand1, operator, operand2] = findOperation(expr); // Separate operation // this 'let' cost me 6 hours of debugging
			console.log("Operation:", operand1, operator, operand2);
			let translatedOperand1;
			let translatedOperand2;
            if (countParenthesesPairs(operand1) > 1) {
                translatedOperand1 = processExpr(operand1);
            } else if (hasParentheses(operand1)) {
				console.log("Operand1 has parentheses:", operand1.slice(1, operand1.length - 1));
				translatedOperand1 = processExpr(operand1.slice(1, operand1.length - 1));
			} else {
				translatedOperand1 = operand1;
			}
			if (countParenthesesPairs(operand1) > 1) {
                translatedOperand2 = processExpr(operand2);
			} else if (hasParentheses(operand2)) {
				console.log("Operand2 has parentheses:", operand2.slice(1, operand2.length - 1));
				translatedOperand2 = processExpr(operand2.slice(1, operand2.length - 1));
			} else {
				translatedOperand2 = operand2;
			}
			console.log("New operation:", translatedOperand1, operator, translatedOperand2);
			return translateOperation(translatedOperand1, operator, translatedOperand2);

			//
			// return translateOperation(
			// 	hasParentheses(operand1)
			// 		? (console.log(
			// 				"Operand1 has parentheses:",
			// 				operand1.slice(1, operand1.length - 1)
			// 		  ),
			// 		  processExpr(operand1.slice(1, operand1.length - 1)))
			// 		: operand1,
			// 	operator,
			// 	hasParentheses(operand2)
			// 		? (console.log(
			// 				"Operand2 has parentheses:",
			// 				operand2.slice(1, operand2.length - 1)
			// 		  ),
			// 		  processExpr(operand2.slice(1, operand2.length - 1)))
			// 		: operand2
			// );
		} else {
			console.log("Close all parentheses!");
			return;
		}
	} else {
		console.log("Else Case");
		[operand1, operator, operand2] = findOperation(expr); // Separate operation
		if (operand2.length > 1) {
			console.log("Remaining:", operand2.slice(1));
			return processExpr(
				translateOperation(operand1, operator, operand2[0]) + operand2.slice(1)
			);
		} else {
			return translateOperation(operand1, operator, operand2);
		}
	}
}

/**
 * Evaluates translated operation.
 * @param {string} expr
 * @returns {stringArray} values
 */
function evaluateOperation(operation_string) {
	operation_string = operation_string.replaceAll("[", "(");
	operation_string = operation_string.replaceAll("]", ")");
	return eval(operation_string + ".values()"); // Get values of JS expression
}

/**
 * Handles the oninput event for the textbox.
 */
function inputHandler() {
	resetSVG(); // Start modification with blank slate SVG
	const expr = document.getElementById("expression_input").value; // Get text expression from textbox
	console.log(expr);
	updateSVG(evaluateOperation(processExpr(expr))); // Translate text expression, get values, and fill region based on values
}

/**
 * Sets the correct regions of the SVG to fill="red".
 * @param {stringArray} regions
 */
function updateSVG(regions) {
	for (const id of regions) {
		// For each region
		document
			.getElementById("venn")
			.getSVGDocument()
			.getElementById(id.toUpperCase())
			.setAttribute("fill", "red"); // Set fill to "red"
	}
}

/**
 * Resets all regions of the SVG back to fill="none".
 */
function resetSVG() {
	const elements = document
		.getElementById("venn")
		.getSVGDocument()
		.getElementsByClassName("region"); // Get all possible regions
	for (const element of elements) {
		// For each region
		element.setAttribute("fill", "none"); // Set fill to "none"
	}
}

// #--------------TESTING--------------#

function runTests() {
	console.log("#------------TESTS------------#");
	console.log("----------------1", "(A & B) | C");
	test("(A & B) | C", "A.union(B).intersection(C)");
	console.log("----------------2", "A - (B | C)");
	test("A - (B | C)", "A.difference(B.intersection(C))");
	console.log("----------------3", "(A & (B | C)) * (C - A)");
	test(
		"(A & (B | C)) * (C - A)",
		"A.union(B.intersection(C)).symmetricDifference(C.difference(A))"
	);
	console.log("----------------4", "A & B - C");
	test("A & B - C", "A.union(B).difference(C)");
	console.log("----------------5", "(A & B) * (C - A) | (A | B)");
	test(
		"(A & B) * (C - A) | (A | B)",
		"(A.union(B).symmetricDifference(C.difference(A))).intersection(A.intersection(B)"
	);
	console.log("----------------6", "(A * B) | (C | A) & (B - C)");
	test(
		"(A * B) | (C | A) & (B - C)",
		"(A.symmetricDifference(B).intersection(C.intersection(A)).union(B.difference(C))"
	);
	console.log("----------------7", "(A * B) | (C & A) | ((A | B) * (C * A) | (B - C))");
	test(
		"(A * B) | (C & A) | ((A | B) * (C * A) | (B - C))",
		"A.symmetricDifference(B).intersection(C.union(A)).intersection(A.union(B).symmetricDifference(C.symmetricDifference(A)).intersection(B.difference(C))"
	);
	console.log("#----------END TESTS----------#");
}

function test(expr, expected_result) {
	let result = processExpr(expr);
	result = result.replaceAll("[", "(");
	result = result.replaceAll("]", ")");
	if (result === expected_result) {
		console.log("----------------Passed!");
	} else {
		console.log(`Expected: ${expected_result}`);
		console.log(`Got: ${result}`);
		console.log("----------------Failed!");
	}
}

runTests();
