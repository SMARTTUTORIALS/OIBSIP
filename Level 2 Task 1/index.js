
const expression = document.getElementById("input-expression");
const result = document.getElementById("result");
const numberbuttons = document.querySelectorAll(".btn-nmbr");
const operatorbuttons = document.querySelectorAll(".btn-oprtr");

let isNegativeFlag = false;
let ans=0;

expression.innerHTML = "";
result.innerHTML = 0;

numberbuttons.forEach(button => {
    button.addEventListener('click', () => numberButtonHandler(button));
});

operatorbuttons.forEach(button => {
    button.addEventListener('click', () => operatorButtonHandler(button));
});


function numberButtonHandler(element) {
    let exp = expression.innerHTML.toString();
    let currChar = element.innerHTML.toString();

    if (currChar === ".") {
        const lastNumIndex = findLastNumberIndex(exp);

        if (exp.length === 0 || !/[0-9.]/.test(exp.charAt(exp.length - 1))) {
            exp += "0" + currChar;
        } else if (hasDecimal(exp, lastNumIndex)) {
            //Do nothing
        } else {
            exp += currChar;
        }
    }
    else {
        exp += currChar;
    }
    expression.innerHTML = exp;
}

// Helper function to find the index of the last number in the expression
function findLastNumberIndex(expression) {
    for (let i = expression.length - 1; i >= 0; i--) {
        if (/[0-9.]/.test(expression[i])) {
            continue;
        } else {
            return i;
        }
    }
    return -1;
}
// Helper function to check if the number already has a decimal point
function hasDecimal(expression, startIndex) {
    for (let i = startIndex + 1; i < expression.length; i++) {
        if (expression[i] === ".") {
            return true;
        } else if (!/[0-9]/.test(expression[i])) {
            break;
        }
    }
    return false;
}

function operatorButtonHandler(element) {
    let exp = expression.innerHTML.toString();
    let currChar = element.innerHTML.toString();

    if (/[0-9()]/.test(exp.charAt(exp.length - 1))) {
        if (currChar === "±" && !isNegativeFlag) {
            let index = findLastNumberIndex(exp);
            exp = exp.substring(0, index + 1) + "-" + exp.substring(index + 1);
            isNegativeFlag = true;

        } else if (currChar === "±" && isNegativeFlag) {
            let index = findLastNumberIndex(exp);
            exp = exp.substring(0, index) + exp.substring(index + 1);
            isNegativeFlag = false;

        } else {
            exp += currChar;
            isNegativeFlag = false
        }

    } else if (!/[0-9()]/.test(exp.charAt(exp.length - 1)) && /[()√]/.test(currChar)) {
        exp += currChar;

    } else if(exp.charAt(exp.length-1) === '%' && /[()√+−÷×]/.test(currChar)){
        exp += currChar;
    }


    expression.innerHTML = exp;
}

function delButtonHandler() {
    let exp = expression.innerHTML.toString();
    exp = exp.slice(0, exp.length - 1);
    expression.innerHTML = exp;
}


function cleardisplay() {
    expression.innerHTML = "";
    result.innerHTML = "0";
}

function ansButtonHandler(){
    let exp = expression.innerHTML.toString();
    expression.innerHTML = exp+ans.toString();
}

function calculateResult() {
    let exp = expression.innerHTML.toString();
    try {
        exp = convertToMathExpression(exp);
        console.log(exp);
        let res= math.evaluate(exp);
        ans = res;
        
        result.innerHTML = res;
    } catch (error) {
        result.innerHTML = "Invalid Expression";
    }

}

//Helper function
function convertToMathExpression(inputExpression) {
    let correctedExpression = inputExpression
        .replace(/×/g, '*')
        .replace(/−/g, '-')
        .replace(/÷/g, '/');
    
    let match = /\d%\d/.exec(correctedExpression);
    while (match) {
        correctedExpression = correctedExpression.substring(0,match.index+1)+"%*"+correctedExpression.substring(match.index+2);
        
        match = /\d%\d/.exec(correctedExpression);
    } 

    correctedExpression = parseSqrt(correctedExpression);

    return correctedExpression;
}

//helper function to parse √ as sqrt()
function parseSqrt(inputExpression) {
    let outputExpression = '';
    let sqrtCount = 0;
    let insideSqrt = false;

    for (let i = 0; i < inputExpression.length; i++) {
       
        if (inputExpression[i] === '√') {
            if (!insideSqrt) {
                outputExpression += 'sqrt(';
                insideSqrt = true;
                sqrtCount++;
            } else {
                sqrtCount++;
                outputExpression += 'sqrt(';
            }
        } else if (insideSqrt && inputExpression[i] === '(') {
            sqrtCount++;
            outputExpression += '(';
        } else if (insideSqrt && inputExpression[i] === ')') {
            sqrtCount--;
            if (sqrtCount === 0) {
                insideSqrt = false;
                outputExpression += ')';
            } else {
                outputExpression += ')';
            }
        } else {
            outputExpression += inputExpression[i];
        }
    }

    while (sqrtCount > 0) {
        outputExpression += ')';
        sqrtCount--;
    }
    
    let match = /[0-9)%]sqrt/.exec(outputExpression);
    while(match){
        outputExpression = outputExpression.substring(0,match.index+1)+"*"+outputExpression.substring(match.index+1);
        match = /[0-9)%]sqrt/.exec(outputExpression);
    }
    return outputExpression;
}