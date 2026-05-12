const diceImages = [
    "assets/img/png1.com.png",
    "assets/img/png2.com.png",
    "assets/img/png3.com.png",
    "assets/img/png4.com.png",
    "assets/img/png5.com.png",
    "assets/img/png6.com.png"
];


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
const agiotaOverlay = document.getElementById("agiota-overlay");
const agiotaImage = document.getElementById("agiota-image");
const agiotaDialogue = document.getElementById("agiota-dialogue");
const agiotaOptions = document.getElementById("agiota-options");
const agiotaAccept = document.getElementById("agiota-accept");
const agiotaReject = document.getElementById("agiota-reject");
const gameOverOverlay = document.getElementById("game-over-overlay");
const restartBtn = document.getElementById("restart-btn");


let saldo = 1000;
let chosenNumber = null;
let betAmount = 0;
let emprestimo = false;
let rodadas = 0;


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

function loadFromStorage() {
    const balance = localStorage.getItem('saldo');
    const emp = localStorage.getItem('emprestimo') === 'true';
    const rod = parseInt(localStorage.getItem('rodadas')) || 0;
    if (balance !== null) saldo = parseFloat(balance);
    emprestimo = emp;
    rodadas = rod;
}

function saveToStorage() {
    localStorage.setItem('saldo', saldo);
    localStorage.setItem('emprestimo', emprestimo);
    localStorage.setItem('rodadas', rodadas);
}

function typewriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

function showAgiota(imageSrc, dialogue, options = true) {
    agiotaImage.src = imageSrc;
    agiotaOverlay.classList.add('show');
    typewriterEffect(agiotaDialogue, dialogue);
    if (options) {
        agiotaOptions.style.display = 'flex';
    } else {
        agiotaOptions.style.display = 'none';
    }
}

function hideAgiota() {
    agiotaOverlay.classList.remove('show');
}

function showGameOver() {
    gameOverOverlay.classList.add('show');
}

function checkAgiota() {
    if (saldo <= 0 && !emprestimo) {
        showAgiota('assets/img/arthurDinherio.png', 'O meu acabou o dinheiro ai cupixa?, eu te empresto uma graninha se tu quiser');
    } else if (emprestimo && rodadas >= 10) {
        showAgiota('assets/img/arthurDinherio.png', 'Eai cupixa ta com meu dinheiro?');
        agiotaAccept.textContent = 'Dar o Dinheiro';
        agiotaReject.textContent = 'Não Dar o Dinheiro';
    }
}


numberButtons.forEach(button => {
    button.addEventListener("click", function() {
    
        numberButtons.forEach(btn => btn.classList.remove("selected"));
        
       
        this.classList.add("selected");
        
    
        chosenNumber = parseInt(this.dataset.number);
        chosenNumberDisplay.textContent = `Número escolhido: ${chosenNumber}`;
    });
});


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


function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}


function updateDiceImages(imgElement, value) {
    imgElement.src = diceImages[value - 1];
    imgElement.alt = `Dado mostrando ${value}`;
}


function playRound() {

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
    
  
    rollButton.disabled = true;
    numberButtons.forEach(btn => btn.disabled = true);
    betInput.disabled = true;
    betAllButton.disabled = true;
    

    playerImg.classList.add("rolling");

 
    const rollInterval = setInterval(() => {
        updateDiceImages(playerImg, rollDie());
    }, 100);

   
    setTimeout(() => {
        clearInterval(rollInterval);
        
        const rolledValue = rollDie();
        
      
        playerImg.classList.remove("rolling");
        
    
        playerImg.classList.remove("winner", "loser");
        
        updateDiceImages(playerImg, rolledValue);

       
        if (rolledValue === chosenNumber) {
           
            saldo = saldo + betAmount * 2.3;
            playerImg.classList.add("winner");
            statusPlayer.textContent = `Você acertou! +R$ ${betAmount}`;
            message.textContent = `🎉 Parabéns! Você ganhou R$ ${betAmount}`;
            addHistoryEntry(chosenNumber, rolledValue, betAmount, true);
        } else {
           
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
        
        rodadas += 1;
        saveToStorage();
        updateSaldoDisplay();
        
        
        rollButton.disabled = false;
        numberButtons.forEach(btn => btn.disabled = false);
        betInput.disabled = false;
        betAllButton.disabled = false;
        
       
        quickBetButtons.forEach(btn => btn.classList.remove("active"));
        
        
        betInput.value = "";
        
     
        setTimeout(checkAgiota, 1000);
    }, 800);
}

rollButton.addEventListener("click", playRound);


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


if (depositButton) {
    depositButton.addEventListener("click", function() {
        depositModal.classList.add("open");
        depositAmountInput.value = "";
        updateTotalAmount();
    });
}


closeModal.addEventListener("click", function() {
    depositModal.classList.remove("open");
    modalMessage.classList.remove("success", "error");
    modalMessage.textContent = "";
});


depositModal.addEventListener("click", function(e) {
    if (e.target === depositModal) {
        depositModal.classList.remove("open");
        modalMessage.classList.remove("success", "error");
    }
});


methodButtons.forEach(button => {
    button.addEventListener("click", function() {
        methodButtons.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        selectedMethod = this.dataset.method;
    });
});


quickAmountButtons.forEach(button => {
    button.addEventListener("click", function() {
        const amount = parseFloat(this.dataset.amount);
        depositAmountInput.value = amount.toFixed(2);
        
        quickAmountButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        
        updateTotalAmount();
    });
});


function updateTotalAmount() {
    const amount = parseFloat(depositAmountInput.value) || 0;
    totalAmountDisplay.textContent = amount.toFixed(2);
}


depositAmountInput.addEventListener("input", function() {
    quickAmountButtons.forEach(btn => btn.classList.remove("active"));
    updateTotalAmount();
});


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


agiotaAccept.addEventListener('click', () => {
    hideAgiota();
    if (!emprestimo) {
        
        showAgiota('assets/img/arthurDinherio.png', 'Toma aqui entao cupixa, mas o seguinte hein é melhor tu me pagar arrombado se nao.....', false);
        setTimeout(() => {
            hideAgiota();
            emprestimo = true;
            saldo += 1000;
            rodadas = 0;
            saveToStorage();
            updateSaldoDisplay();
        }, 3000);
    } else {
       
        if (saldo >= 1000) {
            saldo -= 1000;
            emprestimo = false;
            saveToStorage();
            updateSaldoDisplay();
            showAgiota('assets/img/arthurDinherio.png', 'Ai sim cupixa valeu', false);
            setTimeout(hideAgiota, 2000);
        } else {
            
            hideAgiota();
            setTimeout(() => {
                showAgiota('assets/img/arthurArma.png', '', false);
                setTimeout(() => {
                    hideAgiota();
                    const tiroImg = document.createElement('img');
                    tiroImg.src = 'assets/img/9418.jpg';
                    tiroImg.style.position = 'fixed';
                    tiroImg.style.top = '50%';
                    tiroImg.style.left = '50%';
                    tiroImg.style.transform = 'translate(-50%, -50%)';
                    tiroImg.style.width = '300px';
                    tiroImg.style.zIndex = '1002';
                    document.body.appendChild(tiroImg);
                    setTimeout(() => {
                        document.body.removeChild(tiroImg);
                        showGameOver();
                    }, 1000);
                }, 1000);
            }, 500);
        }
    }
});

agiotaReject.addEventListener('click', () => {
    hideAgiota();
    if (!emprestimo) {
  
    } else {
    
        hideAgiota();
        setTimeout(() => {
            showAgiota('assets/img/arthurArma.png', '', false);
            setTimeout(() => {
                hideAgiota();
                const tiroImg = document.createElement('img');
                tiroImg.src = 'assets/img/9418.png';
                tiroImg.style.position = 'fixed';
                tiroImg.style.top = '50%';
                tiroImg.style.left = '50%';
                tiroImg.style.transform = 'translate(-50%, -50%)';
                tiroImg.style.width = '300px';
                tiroImg.style.zIndex = '1002';
                document.body.appendChild(tiroImg);
                setTimeout(() => {
                    document.body.removeChild(tiroImg);
                    showGameOver();
                }, 1000);
            }, 1000);
        }, 500);
    }
});

restartBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});


loadFromStorage();
updateSaldoDisplay();
checkAgiota();
