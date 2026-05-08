const coinImages = {
    cara: "assets/img/cara1.png",
    coroa: "assets/img/coroa.png"
};

// DOM Elements
const playerImg = document.getElementById("coin-player");
const statusPlayer = document.getElementById("status-player");
const message = document.getElementById("message");
const rollButton = document.getElementById("roll-button");
const choiceButtons = document.querySelectorAll("[data-choice]");
const chosenChoiceDisplay = document.getElementById("chosen-number");
const betInput = document.getElementById("bet-input");
const betAllButton = document.getElementById("bet-all-button");
const quickBetButtons = document.querySelectorAll(".quick-bet-btn:not(#bet-all-button)");
const saldoDisplay = document.getElementById("saldo");
const ganhosDisplay = document.getElementById("ganhos");
const perdasDisplay = document.getElementById("perdas");
const historyList = document.getElementById("history-list");

// Game State
let saldo = 1000;
let ganhos = 0;
let perdas = 0;
let chosenSide = null;
let betAmount = 0;

// Update saldo display
function updateSaldoDisplay() {
    saldoDisplay.textContent = saldo.toFixed(2);
    ganhosDisplay.textContent = ganhos.toFixed(2);
    perdasDisplay.textContent = perdas.toFixed(2);
    betInput.max = Math.max(saldo, 0);
}

function addHistoryEntry(playerSide, resultSide, betAmount, won) {
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
            <span class="history-amount">R$ ${betAmount.toFixed(2)}</span>
        </div>
        <p>Escolhido: <strong>${playerSide.toUpperCase()}</strong> · Resultado: <strong>${resultSide.toUpperCase()}</strong></p>
    `;
    historyList.prepend(entry);
}

// Side selection
choiceButtons.forEach(button => {
    button.addEventListener("click", function() {
        choiceButtons.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        chosenSide = this.dataset.choice;
        chosenChoiceDisplay.textContent = `Lado escolhido: ${chosenSide.toUpperCase()}`;
    });
});

// Bet all button
quickBetButtons.forEach(button => {
    button.addEventListener("click", function() {
        const amount = parseFloat(this.dataset.amount);
        if (amount) {
            betInput.value = amount;
            quickBetButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        }
    });
});

betAllButton.addEventListener("click", function() {
    betInput.value = Math.max(saldo, 0);
    quickBetButtons.forEach(btn => btn.classList.remove("active"));
});

// Flip coin function with biased probability against the player
function sortearMoeda(chosenSide) {
    const chance = Math.random();
    if (chosenSide === 'cara') {
        return chance < 0.4 ? 'cara' : 'coroa';
    }
    if (chosenSide === 'coroa') {
        return chance < 0.4 ? 'coroa' : 'cara';
    }
    return Math.random() < 0.5 ? 'cara' : 'coroa';
}

// Update coin images
function updateCoinImage(imgElement, side) {
    imgElement.src = coinImages[side];
    imgElement.alt = `Moeda mostrando ${side}`;
}

// Play round
function playRound() {
    // Validate inputs
    if (chosenSide === null) {
        message.textContent = "Escolha um lado (Cara ou Coroa)!";
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
    choiceButtons.forEach(btn => btn.disabled = true);
    betInput.disabled = true;
    betAllButton.disabled = true;
    
    // Prepare coin display and start animation
    updateCoinImage(playerImg, chosenSide);
    playerImg.classList.add("rolling");

    const resultSide = sortearMoeda(chosenSide);

    // Simulate rolling time
    setTimeout(() => {
        // Stop animation
        playerImg.classList.remove("rolling");
        
        // Reset classes
        playerImg.classList.remove("winner", "loser");
        
        updateCoinImage(playerImg, resultSide);

        // Check if player guessed correctly
        if (chosenSide === resultSide) {
            // Player won
            saldo = saldo + betAmount;
            ganhos += betAmount;
            playerImg.classList.add("winner");
            statusPlayer.textContent = `Você acertou! +R$ ${betAmount.toFixed(2)}`;
            message.textContent = `🎉 Parabéns! Você ganhou R$ ${betAmount.toFixed(2)}. Resultado: ${resultSide.toUpperCase()}`;
            addHistoryEntry(chosenSide, resultSide, betAmount, true);
        } else {
            // Player lost
            saldo = saldo - betAmount;
            perdas += betAmount;
            playerImg.classList.add("loser");
            statusPlayer.textContent = `Errou! -R$ ${betAmount.toFixed(2)}. Resultado: ${resultSide.toUpperCase()}`;
            addHistoryEntry(chosenSide, resultSide, betAmount, false);
            
            if (saldo <= 0) {
                saldo = 0;
                message.textContent = "💀 Seu saldo zerou. Deposite para continuar jogando.";
            } else {
                message.textContent = `😢 Você perdeu R$ ${betAmount.toFixed(2)}. O resultado foi ${resultSide.toUpperCase()}`;
            }
        }
        
        updateSaldoDisplay();
        
        // Re-enable controls
        rollButton.disabled = false;
        choiceButtons.forEach(btn => btn.disabled = false);
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
depositButton.addEventListener("click", function() {
    depositModal.classList.add("open");
    depositAmountInput.value = "";
    updateTotalAmount();
});

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
