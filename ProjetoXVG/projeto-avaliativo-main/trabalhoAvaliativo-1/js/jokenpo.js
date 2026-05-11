// ============================================
// CONFIGURAÇÕES - VALORES FACILMENTE EDITÁVEIS
// ============================================
import { app } from "trabalhoAvaliativo-1/js/firebase.js"; // importa o app do firebase para garantir que ele seja inicializado antes de usar qualquer funcionalidade do Firebase (ex: Firestore, Auth, etc). O arquivo firebase.js deve exportar o app corretamente para evitar erros de importação.

const CONFIG = {
    startingBalance: 1000,
    defaultBet: 50,
    betOptions: [10, 50, 100, 250, 500],
    shakeDuration: 900,
    resultDelay: 200,
};

// ============================================
// ESTADO DO JOGO
// ============================================

const gameState = {
    balance: CONFIG.startingBalance,
    currentBet: CONFIG.defaultBet,
    isAllIn: false,
    isPlaying: false,
    stats: {
        ganhos: 0.00,
        perdas: 0.00,
    },
};

// ============================================
// ELEMENTOS DO DOM
// ============================================

const elements = {
    balance: document.getElementById('balance'),
    currentBet: document.getElementById('current-bet'),
    betOptions: document.querySelectorAll('.bet-option'),
    allInBtn: document.getElementById('all-in-btn'),
    betControls: document.getElementById('bet-controls'),
    quickBetBtns: document.querySelectorAll('.quick-bet-btn'),
    betInput: document.getElementById('bet-input'),
    betAllButton: document.getElementById('bet-all-button'),
    chosenBetText: document.getElementById('chosen-bet-text'),
    playerChoices: document.getElementById('player-choices'),
    choiceBtns: document.querySelectorAll('.choice-btn'),
    cpuHand: document.getElementById('cpu-hand'),
    playerHand: document.getElementById('player-hand'),
    cpuHandImg: document.getElementById('cpu-hand-img'),
    playerHandImg: document.getElementById('player-hand-img'),
    resultContainer: document.getElementById('result-container'),
    resultText: document.getElementById('result-text'),
    resultValue: document.getElementById('result-value'),
    playAgainBtn: document.getElementById('play-again-btn'),
    ganhosHeader: document.getElementById('ganhos'),
    perdasHeader: document.getElementById('perdas'),
};

// ============================================
// MAPEAMENTO DE IMAGENS
// ============================================

const choiceImages = {
    pedra: {
        player: 'assets/img/pedraPlayer.png',
        cpu: 'assets/img/pedraCPU.png',
    },
    papel: {
        player: 'assets/img/papelPlayer.png',
        cpu: 'assets/img/papelCPU.png',
    },
    tesoura: {
        player: 'assets/img/tesouraPlayer.png',
        cpu: 'assets/img/tesouraCPU.png',
    },
};

// ============================================
// LÓGICA DO JOGO
// ============================================

// CPU choice with bias to make player victories less likely
function getCpuChoice(playerChoice) {
    // If no playerChoice provided, fallback to uniform
    if (!playerChoice) {
        const options = ['pedra', 'papel', 'tesoura'];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Determine winning/losing moves relative to player
    const beats = { pedra: 'tesoura', papel: 'pedra', tesoura: 'papel' };
    const losesTo = { pedra: 'papel', papel: 'tesoura', tesoura: 'pedra' };

    const winChoice = losesTo[playerChoice]; // move that beats player's choice (CPU wins)
    const drawChoice = playerChoice;
    const loseChoice = beats[playerChoice]; // move that loses to player's choice (CPU loses)

    // Weighted random: CPU more likely to pick winChoice, less likely to pick loseChoice
    // Example weights: win 0.55, draw 0.25, lose 0.20
    const r = Math.random();
    if (r < 0.55) return winChoice;
    if (r < 0.80) return drawChoice;
    return loseChoice;
}

function getWinner(playerChoice, cpuChoice) {
    if (playerChoice === cpuChoice) return 'draw';

    const winRules = {
        pedra: 'tesoura',
        papel: 'pedra',
        tesoura: 'papel',
    };

    return winRules[playerChoice] === cpuChoice ? 'win' : 'lose';
}

// ============================================
// ANIMAÇÕES
// ============================================

function triggerConfetti(result) {
    if (typeof confetti !== 'undefined') {
        const config = {
            particleCount: result === 'win' ? 120 : 40,
            spread: result === 'win' ? 65 : 45,
            origin: { y: 0.6 },
            colors: result === 'win' ? ['#eb1818', '#ffffff', '#434343'] : ['#999999', '#ffffff'],
        };
        confetti(config);
    }
}

function showResult(result, betAmount) {
    const resultLabels = {
        win: 'VITÓRIA!',
        lose: 'DERROTA',
        draw: 'EMPATE',
    };

    elements.resultText.textContent = resultLabels[result];
    elements.resultText.style.color = result === 'win' ? '#eb1818' : result === 'draw' ? '#cccccc' : '#999999';

    if (result === 'win') {
        elements.resultValue.textContent = `+R$ ${((betAmount * 2)).toFixed(2)}`;
        elements.resultValue.style.color = '#2ecc71';
    } else if (result === 'draw') {
        elements.resultValue.textContent = 'Aposta devolvida';
        elements.resultValue.style.color = '#cccccc';
    } else {
        elements.resultValue.textContent = `-R$ ${betAmount.toFixed(2)}`;
        elements.resultValue.style.color = '#eb1818';
    }

    elements.resultContainer.classList.add('show');
    // show floating message instead of a 'play again' button
    const float = document.getElementById('floating-msg');
    if (float) {
        float.textContent = elements.resultText.textContent + (result === 'win' ? `  +R$ ${ (betAmount).toFixed(2)}` : result === 'draw' ? '  Aposta devolvida' : `  -R$ ${betAmount.toFixed(2)}`);
        float.classList.remove('success','error','neutral');
        float.classList.add(result === 'win' ? 'success' : result === 'draw' ? 'neutral' : 'error');
        float.classList.add('show');
        float.setAttribute('aria-hidden','false');
        setTimeout(() => {
            float.classList.remove('show');
            float.setAttribute('aria-hidden','true');
        }, 1800);
    }
}

// ============================================
// ATUALIZAÇÃO DE UI
// ============================================

function updateBalance() {
    elements.balance.textContent = `R$ ${gameState.balance.toFixed(2)}`;
}

function updateCurrentBet() {
    elements.currentBet.textContent = `R$ ${gameState.currentBet.toFixed(2)}`;
    if (elements.chosenBetText) elements.chosenBetText.textContent = `R$ ${gameState.currentBet.toFixed(2)}`;
}

function updateStats() {
    // Formata ganhos com + e cor verde
    const ganhosEl = elements.ganhosHeader;
    const perdasEl = elements.perdasHeader;
    ganhosEl.textContent = `+${gameState.stats.ganhos.toFixed(2)}`;
    ganhosEl.style.color = '#2ecc71';
    perdasEl.textContent = `-${gameState.stats.perdas.toFixed(2)}`;
    perdasEl.style.color = '#e74c3c';
}

function updateBetButtons() {
    elements.betOptions.forEach(btn => {
        const amount = parseInt(btn.dataset.amount, 10);
        btn.disabled = amount > gameState.balance || gameState.isPlaying;
        btn.classList.toggle('active', amount === gameState.currentBet && !gameState.isAllIn);
    });

    elements.allInBtn.disabled = gameState.balance < 10 || gameState.isPlaying;
    elements.allInBtn.classList.toggle('active', gameState.isAllIn);
    elements.choiceBtns.forEach(btn => {
        btn.disabled = gameState.balance < gameState.currentBet || gameState.isPlaying;
    });
}

function setPlayingState(isPlaying) {
    gameState.isPlaying = isPlaying;
    elements.choiceBtns.forEach(btn => (btn.disabled = isPlaying));
    elements.allInBtn.disabled = isPlaying || gameState.balance < 10;
    elements.betOptions.forEach(btn => (btn.disabled = isPlaying || parseInt(btn.dataset.amount, 10) > gameState.balance));
}

// ============================================
// JOGO
// ============================================

function playGame(playerChoice) {
    if (gameState.isPlaying || gameState.balance < gameState.currentBet) return;

    setPlayingState(true);
    const betAmount = gameState.currentBet;
    gameState.balance -= betAmount;
    updateBalance();
    updateBetButtons();

    elements.resultContainer.classList.remove('show');
    const float = document.getElementById('floating-msg');
    if (float) { float.classList.remove('show'); float.setAttribute('aria-hidden','true'); }

    // Remove animação anterior para permitir que ela rode novamente
    elements.playerHand.classList.remove('shake');
    elements.cpuHand.classList.remove('shake');
    
    // Force reflow para reiniciar a animação
    void elements.playerHand.offsetWidth;
    void elements.cpuHand.offsetWidth;

    // Começa com pedra em ambas as mãos
    elements.playerHandImg.src = 'assets/img/pedraPlayer.png';
    elements.cpuHandImg.src = 'assets/img/pedraCPU.png';

    // Inicia animação
    elements.playerHand.classList.add('shake');
    elements.cpuHand.classList.add('shake');

    // Muda imagem no meio da animação (400ms) e aplica um shake curto logo após
    const cpuChoice = getCpuChoice(playerChoice);
    setTimeout(() => {
        elements.cpuHandImg.src = choiceImages[cpuChoice].cpu;
        elements.playerHandImg.src = choiceImages[playerChoice].player;
        // short shake to emphasize the reveal
        elements.playerHand.classList.add('quick-shake');
        elements.cpuHand.classList.add('quick-shake');
        setTimeout(() => {
            elements.playerHand.classList.remove('quick-shake');
            elements.cpuHand.classList.remove('quick-shake');
        }, 260);
    }, 400);

    // Remove animação e calcula resultado após 800ms (duração da animação)
    setTimeout(() => {
        elements.playerHand.classList.remove('shake');
        elements.cpuHand.classList.remove('shake');

        const result = getWinner(playerChoice, cpuChoice);
        
        if (result === 'win') {
            // jogador ganha: recebe o dobro da aposta (já subtraída antes), lucro = betAmount
            gameState.stats.ganhos += betAmount;
            gameState.balance += betAmount * 2;
        } else if (result === 'draw') {
            // empate: aposta devolvida
            gameState.balance += betAmount;
        } else {
            // derrota: perde a aposta
            gameState.stats.perdas += betAmount;
        }

        updateBalance();
        updateStats();
        updateBetButtons();
        triggerConfetti(result);
        showResult(result, betAmount);
        setPlayingState(false);
    }, 800);
}

function resetGame() {
    if (gameState.isPlaying) return;
    elements.resultContainer.classList.remove('show');
    elements.playAgainBtn.classList.remove('show');
    elements.playerHandImg.src = choiceImages.pedra.player;
    elements.cpuHandImg.src = choiceImages.pedra.cpu;
    gameState.isAllIn = false;
    elements.allInBtn.classList.remove('active');
    updateBetButtons();
}

// ============================================
// EVENT LISTENERS
// ============================================

elements.choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const choice = btn.dataset.choice;
        playGame(choice);
    });
});

elements.betOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        if (gameState.isPlaying) return;
        const amount = parseInt(btn.dataset.amount, 10);
        if (amount <= gameState.balance) {
            gameState.currentBet = amount;
            gameState.isAllIn = false;
            updateCurrentBet();
            updateBetButtons();
        }
    });
});

// QUICK-BET BUTTONS (painel direito e quick-bets)
if (elements.quickBetBtns) {
    elements.quickBetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (gameState.isPlaying) return;
            const amount = parseFloat(btn.dataset.amount);
            if (!isNaN(amount) && amount <= gameState.balance) {
                gameState.currentBet = amount;
                gameState.isAllIn = false;
                updateCurrentBet();
                updateBetButtons();
            } else if (btn.id === 'bet-all-button') {
                // handled elsewhere
            }
        });
    });
}

// BET INPUT
if (elements.betInput) {
    elements.betInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (isNaN(val) || val <= 0) return;
        gameState.currentBet = Math.min(val, gameState.balance);
        gameState.isAllIn = gameState.currentBet === gameState.balance;
        updateCurrentBet();
        updateBetButtons();
    });
}

// BET ALL (botão específico)
if (elements.betAllButton) {
    elements.betAllButton.addEventListener('click', () => {
        if (gameState.isPlaying || gameState.balance <= 0) return;
        gameState.currentBet = gameState.balance;
        gameState.isAllIn = true;
        updateCurrentBet();
        updateBetButtons();
    });
}

elements.allInBtn.addEventListener('click', () => {
    if (gameState.isPlaying || gameState.balance < 10) return;
    gameState.currentBet = gameState.balance;
    gameState.isAllIn = true;
    updateCurrentBet();
    updateBetButtons();
});

elements.playAgainBtn.addEventListener('click', resetGame);

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    updateBalance();
    updateCurrentBet();
    updateStats();
    updateBetButtons();
    elements.playerHandImg.src = choiceImages.pedra.player;
    elements.cpuHandImg.src = choiceImages.pedra.cpu;
}

init();
