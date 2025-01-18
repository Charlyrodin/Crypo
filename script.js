let web3;
let score = 0;
let energyActive = false;

// Detectar Web3 (SafePal o cualquier wallet compatible)
document.getElementById("connect-wallet").addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];
      document.getElementById("wallet-address").textContent = `Wallet Address: ${walletAddress}`;

      // Cargar puntuación del usuario
      const savedScore = localStorage.getItem(walletAddress) || 0;
      score = parseInt(savedScore, 10);
      console.log(`Score loaded for ${walletAddress}: ${score}`);
    } catch (error) {
      console.error("User denied wallet connection", error);
    }
  } else {
    alert("No Web3 wallet detected. Please install MetaMask or SafePal.");
  }
});

// Incrementar puntaje
function increaseScore() {
  score++;
  if (energyActive) score++; // x2 Taps si la energía está activa
  document.getElementById("big-score").textContent = score;

  const emoji = document.getElementById("emoji-tap");
  emoji.classList.add("tapped");
  setTimeout(() => emoji.classList.remove("tapped"), 200);

  const walletAddress = document.getElementById("wallet-address").textContent.split(": ")[1];
  if (walletAddress !== "Not Connected") {
    localStorage.setItem(walletAddress, score);
  }
}

// Clasificación
function showLeaderboard() {
  const leaderboard = [
    { rank: 1, name: "Player1", score: 1200 },
    { rank: 2, name: "Player2", score: 1100 },
    { rank: 3, name: "Player3", score: 1050 },
  ];
  let leaderboardHtml = `<h2>Clasificación Mundial</h2><ol>`;
  leaderboard.forEach(player => {
    leaderboardHtml += `<li>${player.rank}. ${player.name} - ${player.score} puntos</li>`;
  });
  leaderboardHtml += `</ol><button onclick="showGame()" class="action-btn">Volver</button>`;
  document.getElementById("content").innerHTML = leaderboardHtml;
}

// Mejoras
function showUpgrades() {
  const upgradesHtml = `
    <h2>Mejoras</h2>
    <p>Compra mejoras para hacer tap más eficiente:</p>
    <ul>
      <li>💎 +1 Tap por clic - 100 puntos</li>
      <li>💎 +5 Taps por clic - 500 puntos</li>
      <li>💎 +10 Taps por clic - 1000 puntos</li>
    </ul>
    <button onclick="showGame()" class="action-btn">Volver</button>
  `;
  document.getElementById("content").innerHTML = upgradesHtml;
}

// Energía
function activateEnergy() {
  if (energyActive) {
    alert("Energía ya está activa.");
    return;
  }
  energyActive = true;
  alert("¡Energía activada! Taps x2 por 30 segundos.");
  setTimeout(() => {
    energyActive = false;
    alert("Energía finalizada.");
  }, 30000);
}

// Cargar el juego
function showGame() {
  const gameHtml = `
    <div id="game-container">
      <h2>Tap Emerald</h2>
      <div id="game-display">
        <p id="big-score">${score}</p>
        <div id="emoji-tap" onclick="increaseScore()">💎</div>
      </div>
      <div id="game-actions">
        <button class="action-btn" onclick="showLeaderboard()">Clasificación</button>
        <button class="action-btn" onclick="showUpgrades()">Mejoras</button>
        <button class="action-btn" onclick="activateEnergy()">Energía</button>
      </div>
    </div>
  `;
  document.getElementById("content").innerHTML = gameHtml;
}

// Cargar el dashboard inicial
function showDashboard() {
  const dashboardHtml = `
    <h2>Dashboard</h2>
    <p>Bienvenido al Dashboard.</p>
  `;
  document.getElementById("content").innerHTML = dashboardHtml;
}
