const opcoes = ['pedra', 'papel', 'tesoura'];
const emojis = { pedra: '✊', papel: '✋', tesoura: '✌️' };
const nomes = { pedra: 'PEDRA', papel: 'PAPEL', tesoura: 'TESOURA' };
const vence = { pedra: 'tesoura', papel: 'pedra', tesoura: 'papel' };
let placar = { wins: 0, losses: 0, draws: 0 };

function escolhaDaIA() {
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

function verificarVencedor(jogador, cpu) {
  if (jogador === cpu) return 'draw';
  if (vence[jogador] === cpu) return 'win';
  return 'loss';
}

function atualizarPlacar() {
  document.getElementById('wins').textContent = placar.wins;
  document.getElementById('losses').textContent = placar.losses;
  document.getElementById('draws').textContent = placar.draws;
}

function exibirEscolhas(jogador, cpu) {
  document.getElementById('player-choice').textContent = emojis[jogador];
  document.getElementById('cpu-choice').textContent = emojis[cpu];
  document.getElementById('player-name').textContent = nomes[jogador];
  document.getElementById('cpu-name').textContent = nomes[cpu];
  const playerEl = document.getElementById('player-choice');
  const cpuEl = document.getElementById('cpu-choice');
  playerEl.classList.remove('bounce');
  cpuEl.classList.remove('bounce');
  void playerEl.offsetWidth;
  void cpuEl.offsetWidth;
  playerEl.classList.add('bounce');
  cpuEl.classList.add('bounce');
}

function exibirResultado(resultado) {
  const banner = document.getElementById('result-banner');
  banner.className = `result-banner ${resultado}`;
  const mensagens = {
    win: '🏆 VOCÊ VENCEU!',
    loss: '💀 VOCÊ PERDEU!',
    draw: '🤝 EMPATE!'
  };
  banner.textContent = mensagens[resultado];
}

function limparSelecao() {
  document.querySelectorAll('.choice-btn').forEach(button => button.classList.remove('selected'));
}

function jogar(escolhaJogador) {
  if (!opcoes.includes(escolhaJogador)) return;
  limparSelecao();
  document.querySelector(`[data-choice="${escolhaJogador}"]`).classList.add('selected');
  const escolhaCPU = escolhaDaIA();
  const resultado = verificarVencedor(escolhaJogador, escolhaCPU);
  if (resultado === 'win') placar.wins += 1;
  if (resultado === 'loss') placar.losses += 1;
  if (resultado === 'draw') placar.draws += 1;
  exibirEscolhas(escolhaJogador, escolhaCPU);
  exibirResultado(resultado);
  atualizarPlacar();
}

function resetarPlacar() {
  placar = { wins: 0, losses: 0, draws: 0 };
  atualizarPlacar();
  document.getElementById('player-choice').textContent = '❓';
  document.getElementById('cpu-choice').textContent = '❓';
  document.getElementById('player-name').textContent = '';
  document.getElementById('cpu-name').textContent = '';
  const banner = document.getElementById('result-banner');
  banner.className = 'result-banner idle';
  banner.textContent = 'ESCOLHA SUA JOGADA ABAIXO';
  limparSelecao();
}

document.querySelectorAll('.choice-btn').forEach(button => {
  button.addEventListener('click', () => jogar(button.dataset.choice));
});
document.getElementById('reset-button').addEventListener('click', resetarPlacar);
