import { app } from "trabalhoAvaliativo-1/js/firebase.js";
const diceImages = [
    "assets/img/png1.com.png",
    "assets/img/png2.com.png",
    "assets/img/png3.com.png",
    "assets/img/png4.com.png",
    "assets/img/png5.com.png",
    "assets/img/png6.com.png"
];

// DOM Elements
const playerImg = document.getElementById("dice-player");
const statusPlayer = document.getElementById("status-player");
const message = document.getElementById("message");
const rollButton = document.getElementById("roll-button");
const numberButtons = document.querySelectorAll(".number-btn");
const chosenNumberDisplay = document.getElementById("chosen-number");
const betInput = document.getElementById("bet-input");
const betAllButton = document.getElementById("bet-all-button");
const quickBetButtons = document.querySelectorAll(".quick-bet-btn:not(#bet-all-button)");
const saldoDisplay = document.getElementById("saldo");
const historyList = document.getElementById("history-list");

// Game State
let saldo = 1000;
let chosenNumber = null;
let betAmount = 0;

// Update saldo display
function updateSaldoDisplay() {
    saldoDisplay.textContent = saldo;
    betInput.max = saldo;
}

function addHistoryEntry(chosenNumber, rolledValue, betAmount, won) {
    if (!historyList) return;

    const emptyText = historyList.querySelector(".empty-state");
    if (emptyText) {
        emptyText.remove();
    }

    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.innerHTML = `
        <div class="history-entry-top ${won ? "win" : "loss"}">
            <span>${won ? "Vitória" : "Derrota"}</span>
            <span class="history-amount">R$ ${betAmount}</span>
        </div>
        <p>Escolhido: <strong>${chosenNumber}</strong> · Número sorteado: <strong>${rolledValue}</strong></p>
    `;
    historyList.prepend(entry);
}

// Number selection
numberButtons.forEach(button => {
    button.addEventListener("click", function() {
        // Remove selected class from all buttons
        numberButtons.forEach(btn => btn.classList.remove("selected"));
        
        // Add selected class to clicked button
        this.classList.add("selected");
        
        // Update chosen number
        chosenNumber = parseInt(this.dataset.number);
        chosenNumberDisplay.textContent = `Número escolhido: ${chosenNumber}`;
    });
});

// Bet all button
quickBetButtons.forEach(button => {
    button.addEventListener("click", function() {
        const amount = parseInt(this.dataset.amount);
        if (amount) {
            betInput.value = amount;
            quickBetButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        }
    });
});

betAllButton.addEventListener("click", function() {
    betInput.value = saldo;
    quickBetButtons.forEach(btn => btn.classList.remove("active"));
});

// Roll die function
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Update dice images
function updateDiceImages(imgElement, value) {
    imgElement.src = diceImages[value - 1];
    imgElement.alt = `Dado mostrando ${value}`;
}

// Play round
function playRound() {
    // Validate inputs
    if (chosenNumber === null) {
        message.textContent = "Escolha um número de 1 a 6!";
        return;
    }
    
    betAmount = parseFloat(betInput.value);
    
    if (!betAmount || betAmount <= 0) {
        message.textContent = "Digite um valor para apostar!";
        return;
    }
    
    if (betAmount > saldo) {
        message.textContent = "Você não tem saldo suficiente!";
        return;
    }
    
    // Disable button during rolling
    rollButton.disabled = true;
    numberButtons.forEach(btn => btn.disabled = true);
    betInput.disabled = true;
    betAllButton.disabled = true;
    
    // Start rolling animation
    playerImg.classList.add("rolling");

    // Alternate dice faces during animation
    const rollInterval = setInterval(() => {
        updateDiceImages(playerImg, rollDie());
    }, 100);

    // Simulate rolling time
    setTimeout(() => {
        clearInterval(rollInterval);
        
        const rolledValue = rollDie();
        
        // Stop animation
        playerImg.classList.remove("rolling");
        
        // Reset classes
        playerImg.classList.remove("winner", "loser");
        
        updateDiceImages(playerImg, rolledValue);

        // Check if player guessed correctly
        if (rolledValue === chosenNumber) {
            // Player won
            saldo = saldo + betAmount * 2.3;
            playerImg.classList.add("winner");
            statusPlayer.textContent = `Você acertou! +R$ ${betAmount}`;
            message.textContent = `🎉 Parabéns! Você ganhou R$ ${betAmount}`;
            addHistoryEntry(chosenNumber, rolledValue, betAmount, true);
        } else {
            // Player lost
            saldo = saldo - betAmount;
            playerImg.classList.add("loser");
            statusPlayer.textContent = `Errou! -R$ ${betAmount}. Número: ${rolledValue}`;
            addHistoryEntry(chosenNumber, rolledValue, betAmount, false);
            
            if (saldo <= 0) {
                saldo = 0;
                message.textContent = "💀 Seu saldo zerou. Deposite para continuar jogando.";
            } else {
                message.textContent = `😢 Você perdeu R$ ${betAmount}. O número foi ${rolledValue}`;
            }
        }
        
        updateSaldoDisplay();
        
        // Re-enable controls
        rollButton.disabled = false;
        numberButtons.forEach(btn => btn.disabled = false);
        betInput.disabled = false;
        betAllButton.disabled = false;
        
        // Reset quick bet selection
        quickBetButtons.forEach(btn => btn.classList.remove("active"));
        
        // Reset bet input
        betInput.value = "";
    }, 800);
}

rollButton.addEventListener("click", playRound);

// DEPOSIT FUNCTIONALITY
const depositButton = document.getElementById("deposit-button");
const depositModal = document.getElementById("deposit-modal");
const closeModal = document.getElementById("close-modal");
const methodButtons = document.querySelectorAll(".method-btn");
const depositAmountInput = document.getElementById("deposit-amount");
const quickAmountButtons = document.querySelectorAll(".quick-amount");
const confirmDepositBtn = document.getElementById("confirm-deposit");
const totalAmountDisplay = document.getElementById("total-amount");
const modalMessage = document.getElementById("modal-message");
let selectedMethod = "cartao";

// Open modal
if (depositButton) {
    depositButton.addEventListener("click", function() {
        depositModal.classList.add("open");
        depositAmountInput.value = "";
        updateTotalAmount();
    });
}

// Close modal
closeModal.addEventListener("click", function() {
    depositModal.classList.remove("open");
    modalMessage.classList.remove("success", "error");
    modalMessage.textContent = "";
});

// Close modal when clicking outside
depositModal.addEventListener("click", function(e) {
    if (e.target === depositModal) {
        depositModal.classList.remove("open");
        modalMessage.classList.remove("success", "error");
    }
});

// Select payment method
methodButtons.forEach(button => {
    button.addEventListener("click", function() {
        methodButtons.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        selectedMethod = this.dataset.method;
    });
});

// Quick amount buttons
quickAmountButtons.forEach(button => {
    button.addEventListener("click", function() {
        const amount = parseFloat(this.dataset.amount);
        depositAmountInput.value = amount.toFixed(2);
        
        quickAmountButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        
        updateTotalAmount();
    });
});

// Update total amount display
function updateTotalAmount() {
    const amount = parseFloat(depositAmountInput.value) || 0;
    totalAmountDisplay.textContent = amount.toFixed(2);
}

// Deposit amount input
depositAmountInput.addEventListener("input", function() {
    quickAmountButtons.forEach(btn => btn.classList.remove("active"));
    updateTotalAmount();
});

// Confirm deposit
confirmDepositBtn.addEventListener("click", function() {
    const amount = parseFloat(depositAmountInput.value);
    
    if (!amount || amount < 10) {
        showModalMessage("O depósito mínimo é R$ 10.00", "error");
        return;
    }
    
    if (amount > 10000) {
        showModalMessage("O depósito máximo é R$ 10.000.00", "error");
        return;
    }
    
    // Simulate deposit processing
    confirmDepositBtn.disabled = true;
    confirmDepositBtn.textContent = "Processando...";
    
    setTimeout(() => {
        saldo += amount;
        updateSaldoDisplay();
        
        showModalMessage(`✓ Depósito de R$ ${amount.toFixed(2)} realizado com sucesso!`, "success");
        
        setTimeout(() => {
            depositModal.classList.remove("open");
            depositAmountInput.value = "";
            totalAmountDisplay.textContent = "0.00";
            confirmDepositBtn.disabled = false;
            confirmDepositBtn.textContent = "Confirmar Depósito";
            modalMessage.classList.remove("success", "error");
            modalMessage.textContent = "";
        }, 1500);
    }, 1000);
});

function showModalMessage(text, type) {
    modalMessage.textContent = text;
    modalMessage.classList.remove("success", "error");
    modalMessage.classList.add(type);
}

// Initialize
updateSaldoDisplay();
