let state = {
  balance: 500,
  wins: 0,
  losses: 0,
  total: 0,
  animating: false,
};

function sortearMoeda() {
  return Math.random() < 0.5 ? 'cara' : 'coroa';
}

function atualizarPlacar() {
  document.getElementById('sc-balance').textContent = state.balance.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
  document.getElementById('sc-total').textContent = state.total;
}

function atualizarAcoes() {
  const bet = Number(document.getElementById('bet-amount').value) || 0;
  document.getElementById('btn-cara').disabled = state.animating || bet < 10;
  document.getElementById('btn-coroa').disabled = state.animating || bet < 10;
}

function exibirHint(text) {
  document.getElementById('hint-text').textContent = text;
}

function animarMoeda(resultado) {
  return new Promise(resolve => {
    const coin = document.getElementById('coin');
    const angFinal = resultado === 'cara' ? 1440 : 1620;
    coin.style.transition = 'none';
    coin.style.transform = 'rotateY(0deg)';
    void coin.offsetWidth;
    coin.style.transition = 'transform 1.2s ease-out';
    coin.style.transform = `rotateY(${angFinal}deg)`;
    setTimeout(resolve, 1300);
  });
}

async function escolher(escolha) {
  const betInput = document.getElementById('bet-amount');
  const bet = Number(betInput.value);

  if (state.animating) return;
  if (bet < 10) {
    exibirHint('A aposta mínima é de 10 créditos.');
    return;
  }

  state.animating = true;
  atualizarAcoes();
  document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`btn-${escolha}`).classList.add('selected');

  const banner = document.getElementById('result-banner');
  banner.className = 'result-banner idle';
  banner.textContent = 'A MOEDA ESTÁ NO AR...';
  exibirHint(`Você escolheu: ${escolha.toUpperCase()}. Boa sorte!`);

  state.balance -= bet;
  const resultado = sortearMoeda();
  await animarMoeda(resultado);

  const acertou = escolha === resultado;
  state.total += 1;
  if (acertou) {
    state.wins += 1;
    state.balance += bet * 2;
  } else {
    state.losses += 1;
  }

  atualizarPlacar();
  if (acertou) {
    banner.className = 'result-banner win';
    banner.textContent = `ACERTOU! SAIU ${resultado.toUpperCase()}! Você ganhou ${bet} créditos.`;
  } else {
    banner.className = 'result-banner loss';
    banner.textContent = `ERROU! SAIU ${resultado.toUpperCase()}! Você perdeu ${bet} créditos.`;
  }

  const accuracy = state.total ? Math.round((state.wins / state.total) * 100) : 0;
  exibirHint(`Taxa de acerto: ${accuracy}% (${state.wins}/${state.total}).`);

  setTimeout(() => {
    document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
  }, 800);

  state.animating = false;
  atualizarAcoes();
}

function resetar() {
  state = {
    balance: 500,
    wins: 0,
    losses: 0,
    total: 0,
    animating: false,
  };

  atualizarPlacar();
  const coin = document.getElementById('coin');
  coin.style.transition = 'transform 0.3s';
  coin.style.transform = 'rotateY(0deg)';
  const banner = document.getElementById('result-banner');
  banner.className = 'result-banner idle';
  banner.textContent = 'Defina sua aposta e escolha Cara ou Coroa.';
  exibirHint('Saldo negativo é permitido. Ajuste a aposta e jogue.');
  document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
  atualizarAcoes();
}

document.getElementById('btn-cara').addEventListener('click', () => escolher('cara'));
document.getElementById('btn-coroa').addEventListener('click', () => escolher('coroa'));
document.getElementById('btn-reset').addEventListener('click', resetar);
document.getElementById('bet-amount').addEventListener('input', atualizarAcoes);
document.getElementById('bet-decrease').addEventListener('click', () => {
  const betInput = document.getElementById('bet-amount');
  let value = Number(betInput.value) || 0;
  value = Math.max(10, value - 10);
  betInput.value = value;
  atualizarAcoes();
});
document.getElementById('bet-increase').addEventListener('click', () => {
  const betInput = document.getElementById('bet-amount');
  let value = Number(betInput.value) || 0;
  value += 10;
  betInput.value = value;
  atualizarAcoes();
});

atualizarPlacar();
atualizarAcoes();
