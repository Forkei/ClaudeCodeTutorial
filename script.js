class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.numberButtons = document.querySelectorAll('[data-number]');
        this.operatorButtons = document.querySelectorAll('[data-operation]');
        this.equalsButton = document.querySelector('[data-action="equals"]');
        this.clearButton = document.querySelector('[data-action="clear"]');
        this.deleteButton = document.querySelector('[data-action="delete"]');
        this.percentButton = document.querySelector('[data-action="percent"]');
        
        this.clear();
        this.attachEventListeners();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else if (this.shouldResetScreen) {
            this.currentOperand = number;
            this.shouldResetScreen = false;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = this.formatNumber(current / 100);
    }
    
    formatNumber(number) {
        if (number.toString().length > 12) {
            return number.toExponential(6);
        }
        return number.toString();
    }
    
    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }
    
    attachEventListeners() {
        this.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
            });
        });
        
        this.operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operation);
                this.updateDisplay();
            });
        });
        
        this.equalsButton.addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });
        
        this.clearButton.addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });
        
        this.deleteButton.addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });
        
        this.percentButton.addEventListener('click', () => {
            this.percentage();
            this.updateDisplay();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
                this.updateDisplay();
            }
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const operationMap = {
                    '+': '+',
                    '-': '−',
                    '*': '×',
                    '/': '÷'
                };
                this.chooseOperation(operationMap[e.key]);
                this.updateDisplay();
            }
            if (e.key === 'Enter' || e.key === '=') {
                this.compute();
                this.updateDisplay();
            }
            if (e.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            }
            if (e.key === 'Escape') {
                this.clear();
                this.updateDisplay();
            }
            if (e.key === '%') {
                this.percentage();
                this.updateDisplay();
            }
        });
    }
}

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeSwitch.checked = true;
    }
}

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    }
});

// Initialize calculator
const calculator = new Calculator();
calculator.updateDisplay();