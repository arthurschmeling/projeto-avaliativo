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
    emprestimo: false,
    rodadas: 0,
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
    agiotaOverlay: document.getElementById('agiota-overlay'),
    agiotaImage: document.getElementById('agiota-image'),
    agiotaDialogue: document.getElementById('agiota-dialogue'),
    agiotaOptions: document.getElementById('agiota-options'),
    agiotaAccept: document.getElementById('agiota-accept'),
    agiotaReject: document.getElementById('agiota-reject'),
    gameOverOverlay: document.getElementById('game-over-overlay'),
    restartBtn: document.getElementById('restart-btn'),
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
// FUNÇÕES AUXILIARES PARA AGIOTA
// ============================================

function loadFromStorage() {
    const balance = localStorage.getItem('saldo');
    const emprestimo = localStorage.getItem('emprestimo') === 'true';
    const rodadas = parseInt(localStorage.getItem('rodadas')) || 0;
    const stats = JSON.parse(localStorage.getItem('stats')) || { wins: 0, draws: 0, losses: 0 };
    if (balance !== null) gameState.balance = parseFloat(balance);
    gameState.emprestimo = emprestimo;
    gameState.rodadas = rodadas;
    gameState.stats = stats;
}

function saveToStorage() {
    localStorage.setItem('saldo', gameState.balance);
    localStorage.setItem('emprestimo', gameState.emprestimo);
    localStorage.setItem('rodadas', gameState.rodadas);
    localStorage.setItem('stats', JSON.stringify(gameState.stats));
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
    elements.agiotaImage.src = imageSrc;
    elements.agiotaOverlay.classList.add('show');
    typewriterEffect(elements.agiotaDialogue, dialogue);
    if (options) {
        elements.agiotaOptions.style.display = 'flex';
    } else {
        elements.agiotaOptions.style.display = 'none';
    }
}

function hideAgiota() {
    elements.agiotaOverlay.classList.remove('show');
}

function showGameOver() {
    elements.gameOverOverlay.classList.add('show');
}

function checkAgiota() {
    if (gameState.balance <= 0 && !gameState.emprestimo) {
        // Oferta de empréstimo
        showAgiota('assets/img/arthurDinherio.png', 'O meu acabou o dinheiro ai cupixa?, eu te empresto uma graninha se tu quiser');
    } else if (gameState.emprestimo && gameState.rodadas >= 10) {
        // Cobrança
        showAgiota('assets/img/arthurDinherio.png', 'Eai cupixa ta com meu dinheiro?');
        elements.agiotaAccept.textContent = 'Dar o Dinheiro';
        elements.agiotaReject.textContent = 'Não Dar o Dinheiro';
    }
}

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

        gameState.rodadas += 1;
        saveToStorage();
        updateBalance();
        updateStats();
        updateBetButtons();
        triggerConfetti(result);
        showResult(result, betAmount);
        setPlayingState(false);

        // Verificar agiota após o jogo
        setTimeout(checkAgiota, 1000);
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

// Event listeners para agiota
elements.agiotaAccept.addEventListener('click', () => {
    hideAgiota();
    if (!gameState.emprestimo) {
        // Aceitar empréstimo
        showAgiota('assets/img/arthurDinherio.png', 'Toma aqui entao cupixa, mas o seguinte hein é melhor tu me pagar arrombado se nao.....', false);
        setTimeout(() => {
            hideAgiota();
            gameState.emprestimo = true;
            gameState.balance += 1000;
            gameState.rodadas = 0;
            saveToStorage();
            updateBalance();
            updateBetButtons();
        }, 3000);
    } else {
        // Pagar dívida
        if (gameState.balance >= 1000) {
            gameState.balance -= 1000;
            gameState.emprestimo = false;
            saveToStorage();
            updateBalance();
            showAgiota('assets/img/arthurDinherio.png', 'Ai sim cupixa valeu', false);
            setTimeout(hideAgiota, 2000);
        } else {
            // Não tem dinheiro, game over
            hideAgiota();
            setTimeout(() => {
                showAgiota('assets/img/arthurArma.png', '', false);
                setTimeout(() => {
                    hideAgiota();
                    // Mostrar tiro
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

elements.agiotaReject.addEventListener('click', () => {
    hideAgiota();
    if (!gameState.emprestimo) {
        // Recusar empréstimo, tudo normal
    } else {
        // Não pagar, game over
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

elements.restartBtn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    loadFromStorage();
    updateBalance();
    updateCurrentBet();
    updateStats();
    updateBetButtons();
    elements.playerHandImg.src = choiceImages.pedra.player;
    elements.cpuHandImg.src = choiceImages.pedra.cpu;
    // Verificar agiota no início
    checkAgiota();
}

init();
