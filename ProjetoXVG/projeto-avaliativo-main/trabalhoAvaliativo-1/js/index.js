const balanceEl = document.getElementById('balance');
let balance = 1250.00;

const fmt = v => v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

function setBalance(v){
  balance = Math.max(0, v);
  balanceEl.textContent = fmt(balance);
  balanceEl.parentElement.animate(
    [{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],
    {duration:300}
  );
}

document.querySelectorAll('.btn-play').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const game = btn.dataset.game;
    if(balance < 10){
      alert('Saldo insuficiente! Faça um depósito para continuar.');
      return;
    }
    const bet = 10;
    const win = Math.random() < 0.45;
    const payout = win ? bet * (1 + Math.random()*3) : 0;
    setBalance(balance - bet + payout);
    setTimeout(()=>{
      if(win) alert(`🎉 ${game}: Você ganhou R$ ${fmt(payout)}!`);
      else alert(`${game}: Não foi dessa vez. Tente novamente!`);
    },50);
  });
});

document.getElementById('deposit').addEventListener('click',()=>{
  const v = prompt('Quanto deseja depositar? (R$)','100');
  const num = parseFloat((v||'').replace(',','.'));
  if(!isNaN(num) && num>0) setBalance(balance + num);
});
