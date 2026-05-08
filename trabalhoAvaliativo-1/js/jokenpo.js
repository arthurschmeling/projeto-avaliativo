// ============================================
// CONFIGURAÇÕES - VALORES FACILMENTE EDITÁVEIS
// ============================================

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
        wins: 0,
        draws: 0,
        losses: 0,
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
    winsHeader: document.getElementById('wins-header'),
    drawsHeader: document.getElementById('draws-header'),
    lossesHeader: document.getElementById('losses-header'),
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

function getCpuChoice() {
    const options = ['pedra', 'papel', 'tesoura'];
    return options[Math.floor(Math.random() * options.length)];
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
        elements.resultValue.textContent = `+R$ ${(betAmount * 2).toFixed(2)}`;
        elements.resultValue.style.color = '#eb1818';
    } else if (result === 'draw') {
        elements.resultValue.textContent = 'Aposta devolvida';
        elements.resultValue.style.color = '#cccccc';
    } else {
        elements.resultValue.textContent = `-R$ ${betAmount.toFixed(2)}`;
        elements.resultValue.style.color = '#999999';
    }

    elements.resultContainer.classList.add('show');
    elements.playAgainBtn.classList.add('show');
}

// ============================================
// ATUALIZAÇÃO DE UI
// ============================================

function updateBalance() {
    elements.balance.textContent = `R$ ${gameState.balance.toFixed(2)}`;
}

function updateCurrentBet() {
    elements.currentBet.textContent = `R$ ${gameState.currentBet.toFixed(2)}`;
}

function updateStats() {
    elements.winsHeader.textContent = gameState.stats.wins;
    elements.drawsHeader.textContent = gameState.stats.draws;
    elements.lossesHeader.textContent = gameState.stats.losses;
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
    elements.playAgainBtn.classList.remove('show');

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

    // Muda imagem no meio da animação (400ms)
    const cpuChoice = getCpuChoice();
    setTimeout(() => {
        elements.cpuHandImg.src = choiceImages[cpuChoice].cpu;
        elements.playerHandImg.src = choiceImages[playerChoice].player;
    }, 400);

    // Remove animação e calcula resultado após 800ms (duração da animação)
    setTimeout(() => {
        elements.playerHand.classList.remove('shake');
        elements.cpuHand.classList.remove('shake');

        const result = getWinner(playerChoice, cpuChoice);
        
        if (result === 'win') {
            gameState.stats.wins += 1;
            gameState.balance += betAmount * 2;
        } else if (result === 'draw') {
            gameState.stats.draws += 1;
            gameState.balance += betAmount;
        } else {
            gameState.stats.losses += 1;
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
