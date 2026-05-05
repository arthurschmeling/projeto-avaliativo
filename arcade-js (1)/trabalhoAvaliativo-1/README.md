# 🕹️ Arcade JS — Portal de Jogos Clássicos

**Colégio ULBRA São Lucas · Curso Técnico em Informática**
*Projeto desenvolvido para o módulo de Lógica e Programação Web.*

---

## 📖 Sobre o Projeto

O **Arcade JS** é um portal com três jogos clássicos desenvolvidos inteiramente com **HTML5, CSS3 e JavaScript puro**, sem frameworks ou bibliotecas externas. O objetivo é demonstrar conceitos fundamentais de lógica de programação, manipulação do DOM e criação de interfaces interativas e responsivas.

---

## 🎮 Jogos Disponíveis

| # | Jogo | Descrição |
|---|------|-----------|
| 01 | ✊✋✌️ **Jokenpô** | Pedra, Papel ou Tesoura contra a IA com placar dinâmico |
| 02 | 🎲 **Batalha de Dados** | Lance dados animados e veja quem tira o maior número |
| 03 | 🪙 **Cara ou Coroa** | Moeda com animação 3D flip e taxa de acerto |

---

## ✨ Funcionalidades Gerais

- ✅ Interface visual totalmente com HTML5 + CSS3 (sem `alert()` / `prompt()`)
- ✅ Atualização do DOM em tempo real sem recarregar a página
- ✅ Placar dinâmico em todos os jogos
- ✅ Responsivo para desktop, tablet e celular
- ✅ Design estilo Arcade com tema dark, neon e animações CSS
- ✅ Código organizado em funções modulares e comentado

---

## 🗂️ Estrutura de Arquivos

```
arcade-js/
├── index.html          ← Portal principal (escolha o jogo)
├── jokenpo.html        ← Jogo 1: Pedra, Papel ou Tesoura
├── dados.html          ← Jogo 2: Batalha de Dados
├── caraocoroa.html     ← Jogo 3: Cara ou Coroa
└── README.md           ← Este arquivo
```

---

## 🕹️ Jogo 1 — Jokenpô (Pedra, Papel ou Tesoura)

### Como Jogar
1. Acesse `jokenpo.html` ou clique no card do portal.
2. Clique em **Pedra**, **Papel** ou **Tesoura**.
3. O computador faz sua escolha instantaneamente via `Math.random()`.
4. O resultado aparece no banner colorido: 🏆 Vitória / 💀 Derrota / 🤝 Empate.
5. O placar (Vitórias · Empates · Derrotas) atualiza automaticamente.
6. Clique em **↺ ZERAR PLACAR** para reiniciar a contagem.

### Funções JavaScript
| Função | Responsabilidade |
|--------|-----------------|
| `escolhaDaIA()` | Gera jogada aleatória com `Math.random()` |
| `verificarVencedor(jogador, cpu)` | Compara escolhas e retorna `'win'`, `'loss'` ou `'draw'` |
| `exibirEscolhas(jogador, cpu)` | Atualiza emojis e nomes na arena via DOM |
| `exibirResultado(resultado)` | Atualiza o banner com classe CSS e mensagem |
| `atualizarPlacar()` | Reflete o estado do objeto `placar` no DOM |
| `resetarPlacar()` | Zera contadores e restaura a interface |
| `jogar(escolha)` | **Função principal** — orquestra uma rodada completa |

---

## 🎲 Jogo 2 — Batalha de Dados

### Como Jogar
1. Acesse `dados.html` ou clique no card do portal.
2. Pressione **🎲 LANÇAR DADOS**.
3. Os dados "rolam" com animação visual por ~600ms.
4. O resultado é comparado: quem tirou o maior número vence.
5. Placar separado para Jogador · Empates · CPU · Rodadas.
6. Clique em **↺ REINICIAR** para zerar tudo.

### Funções JavaScript
| Função | Responsabilidade |
|--------|-----------------|
| `rolarDado()` | Retorna inteiro aleatório de 1 a 6 |
| `renderizarDado(svgId, valor, cor)` | Desenha pontos do dado no SVG via DOM dinâmico |
| `animarRolagem()` | Promise que exibe rolagem animada por 8 ticks de 80ms |
| `verificarResultado(vPlayer, vCpu)` | Compara valores e retorna resultado |
| `atualizarPlacar()` | Sincroniza objeto `placar` com o DOM |
| `lancarDados()` | **Função principal** `async` — orquestra uma rodada |
| `resetar()` | Zera estado e restaura interface ao estado inicial |

---

## 🪙 Jogo 3 — Cara ou Coroa

### Como Jogar
1. Acesse `caraocoroa.html` ou clique no card do portal.
2. Clique em **👑 CARA** ou **🦅 COROA** para fazer sua aposta.
3. A moeda gira com animação CSS 3D (flip 360°).
4. O resultado é revelado com cores: 🏆 Verde (acertou) / 💀 Rosa (errou).
5. A **taxa de acerto** é calculada e exibida ao longo das rodadas.
6. Clique em **↺ ZERAR PLACAR** para reiniciar.

### Funções JavaScript
| Função | Responsabilidade |
|--------|-----------------|
| `sortearMoeda()` | Retorna `'cara'` ou `'coroa'` com 50% de chance cada |
| `animarMoeda(resultado)` | Promise com animação CSS `rotateY` até ângulo correspondente |
| `setBotoes(estado)` | Habilita/desabilita botões durante a animação |
| `atualizarPlacar()` | Sincroniza objeto `placar` com o DOM |
| `escolher(escolha)` | **Função principal** `async` — executa sorteio completo |
| `resetar()` | Zera estado e restaura interface |

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — Estrutura semântica e SVG inline (dado animado)
- **CSS3** — Animações `@keyframes`, `perspective`, `transform 3D`, variáveis CSS, Grid, Flexbox, Media Queries
- **JavaScript ES6+** — `async/await`, `Promise`, `const`/`let`, arrow functions, manipulação de DOM, `Math.random()`
- **Google Fonts** — Press Start 2P (fonte pixel art) + Orbitron

---

## ⚙️ Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SeuUsuario/arcade-js.git

# 2. Entre na pasta
cd arcade-js

# 3. Abra o portal no navegador
# Basta abrir o arquivo index.html — sem necessidade de servidor!
open index.html
# ou arraste o arquivo para o seu navegador
```

> **Nota:** O projeto usa apenas HTML, CSS e JS puro — **nenhuma dependência externa**, nenhum `npm install` necessário.

---

## 📸 Demonstração Visual

> *(Substitua os placeholders abaixo pelos GIFs ou prints do seu jogo funcionando)*

### Portal Principal
![Portal Arcade JS](prints/index.png)

### Jokenpô
![Jokenpô funcionando](prints/jokenpo.gif)

### Batalha de Dados
![Batalha de Dados](prints/dados.gif)

### Cara ou Coroa
![Cara ou Coroa](prints/caraocoroa.gif)

> 💡 **Dica:** Grave GIFs com [ScreenToGif](https://www.screentogif.com/) (Windows) ou [Kap](https://getkap.co/) (Mac).

---

## 🚀 Live Demo

🔗 **[Acesse o Arcade JS aqui](https://seuusuario.github.io/arcade-js/)**

> *Publique no GitHub Pages: Settings → Pages → Branch: main → / (root)*

---

## 📊 Critérios de Avaliação Atendidos

| Critério | Como foi implementado |
|----------|-----------------------|
| **Lógica** | `Math.random()` em todos os jogos; condicionais e objetos de mapeamento |
| **DOM** | `querySelector`, `getElementById`, `textContent`, manipulação de classes CSS |
| **Organização** | Funções separadas e comentadas com JSDoc; estado centralizado em objeto `placar` |
| **Design** | Tema Arcade neon dark, animações CSS, responsivo com Grid + Flexbox |
| **GitHub** | README completo com tabelas, instruções, estrutura de arquivos e prints |

---

## 👨‍💻 Autor

**[Seu Nome Aqui]**
Técnico em Informática · Colégio ULBRA São Lucas
🔗 GitHub: [@seuusuario](https://github.com/seuusuario)

---

*Projeto educacional — 2025*
