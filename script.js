const buttons = document.querySelectorAll('.buttons button');

// 버튼 텍스트 디버깅용
buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log(button.textContent);
    });
});

// 요소 선택
const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.button.number');
const decimalButton = document.querySelector('.decimal');
const clearButton = document.querySelector('.button.function');
const operatorButtons = document.querySelectorAll('.button.operator');
const equalButton = document.querySelector('.button.equal');
const negateButton = document.querySelector('.button.negate');
const backspaceButton = document.querySelector('.button.backspace');

// 상태 변수
let currentInput = '0';
let firstOperand = null;
let operator = null;
let secondOperand = null;
let resultDisplayed = false;

// 디스플레이 업데이트
function updateDisplay() {
    display.textContent = currentInput;
}

// 결과 포맷팅 (소수점 제한)
function formatResult(result) {
    if (typeof result === 'number' && !Number.isInteger(result)) {
        return result.toFixed(6).replace(/\.?0+$/, '');
    }
    return result;
}

// 숫자 입력
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (resultDisplayed || currentInput === 'Error') {
            currentInput = value;
            resultDisplayed = false;
        } else {
            currentInput = currentInput === '0' ? value : currentInput + value;
        }

        updateDisplay();
    });
});

// 소수점
decimalButton.addEventListener('click', () => {
    if (resultDisplayed || currentInput === 'Error') {
        currentInput = '0.';
        resultDisplayed = false;
        updateDisplay();
        return;
    }

    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
});

// 초기화
clearButton.addEventListener('click', () => {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    secondOperand = null;
    resultDisplayed = false;
    updateDisplay();
});

// 연산자 입력
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const displayOperator = button.textContent;

        // 표시된 연산자를 실제 연산자로 매핑
        const operatorMap = {
            '÷': '/',
            '×': '*',
            '−': '-', // 유니코드 minus
            '+': '+'
        };

        const nextOperator = operatorMap[displayOperator];

        if (!nextOperator) return; // 잘못된 연산자 예외 처리

        // 연속 연산자 방지
        if (operator !== null) return;

        if (firstOperand === null) {
            firstOperand = currentInput;
        }

        operator = nextOperator;
        resultDisplayed = false;
        currentInput = '0';

        console.log("firstOperand:", firstOperand);
        console.log("operator:", operator);
    });
});

// 계산 함수
function calculate(a, op, b) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === '*') return num1 * num2;
    if (op === '/') return num2 !== 0 ? num1 / num2 : 'Error';

    return b;
}

// = 버튼 처리
equalButton.addEventListener('click', () => {
    if (!firstOperand || !operator) return;

    secondOperand = currentInput;

    const result = calculate(firstOperand, operator, secondOperand);
    if (result === 'Error') {
        currentInput = 'Error';
    } else {
        currentInput = String(formatResult(result));
    }

    updateDisplay();

    // 상태 초기화
    firstOperand = null;
    secondOperand = null;
    operator = null;
    resultDisplayed = true;
});

// ± 부호 반전
negateButton.addEventListener('click', () => {
    if (currentInput === '0' || currentInput === 'Error') return;

    currentInput = currentInput.startsWith('-')
        ? currentInput.slice(1)
        : '-' + currentInput;
    updateDisplay();
});

// ⌫ 백스페이스
backspaceButton.addEventListener('click', () => {
    if (resultDisplayed || currentInput === 'Error') return;

    currentInput = currentInput.length > 1
        ? currentInput.slice(0, -1)
        : '0';
    updateDisplay();
});

// 키보드 입력
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key)) {
        document.querySelector(`.button.number[data-key="${key}"]`)?.click();
    } else if (['+', '-', '*', '/'].includes(key)) {
        document.querySelector(`.button.operator[data-key="${key}"]`)?.click();
    } else if (key === '.') {
        decimalButton.click();
    } else if (key === 'Enter') {
        equalButton.click();
    } else if (key === 'Escape') {
        clearButton.click();
    } else if (key === 'Backspace') {
        backspaceButton.click();
    }
});
