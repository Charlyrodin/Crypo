let web3;

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

// Clase para cada usuario en la matriz
class User {
  constructor(id, address, referrer = null) {
    this.id = id;
    this.address = address;
    this.referrer = referrer;
    this.children = [];
  }

  addChild(user) {
    if (this.children.length < 2) {
      this.children.push(user);
      return true;
    }
    return false;
  }
}

// Clase para manejar la matriz
class ForcedMatrix {
  constructor() {
    this.users = [];
    this.levels = {};
  }

  addUser(userId, address, referrerId = null) {
    const newUser = new User(userId, address, referrerId);
    if (this.users.length === 0) {
      this.users.push(newUser);
      this.levels[1] = [newUser];
      return newUser;
    }
    for (const user of this.users) {
      if (user.addChild(newUser)) {
        this.users.push(newUser);
        this._addToLevel(newUser);
        return newUser;
      }
    }
    throw new Error("No space available in the matrix");
  }

  _addToLevel(user) {
    const level = this.getLevel(user);
    if (!this.levels[level]) {
      this.levels[level] = [];
    }
    this.levels[level].push(user);
  }

  getLevel(user) {
    let level = 1;
    let current = user.referrer;
    while (current) {
      level++;
      current = this.users.find(u => u.id === current);
    }
    return level;
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const matrix = new ForcedMatrix();
  matrix.addUser(1, "0xF991f...0E632");
  matrix.addUser(2, "0xf77e1...cbE8E", 1);
  matrix.addUser(3, "0x575C8...26Be8", 1);
  renderDownlineTable(matrix);
  renderIncomeSummary();
  renderReferralLinks();
});

// Vistas dinámicas
function showDashboard() {
  document.getElementById("content").innerHTML = `
    <h2>Dashboard</h2>
    <p>Welcome to your dashboard!</p>
  `;
}

function showDownline() {
  document.getElementById("content").innerHTML = `
    <h2>Downline</h2>
    <table id="downline-table">
      <thead>
        <tr>
          <th>SNo.</th>
          <th>ID</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        <!-- Aquí se inyectarán los datos de la tabla -->
      </tbody>
    </table>
  `;
  renderDownlineTable(matrix);
}

function showGame() {
  document.getElementById("content").innerHTML = `
    <div id="game-container">
      <h2>Tap Emerald</h2>
      <div id="game-display">
        <p id="big-score">0</p>
        <div id="emoji-tap" onclick="increaseScore()">💎</div>
      </div>
    </div>
  `;
}

// Juego Tap Emerald
let score = 0;

function increaseScore() {
  score++;
  document.getElementById("big-score").textContent = score;

  // Animar el emoji manualmente
  const emoji = document.getElementById("emoji-tap");
  emoji.classList.add("active");
  setTimeout(() => {
    emoji.classList.remove("active");
  }, 200);

  // Guardar puntuación en localStorage
  const walletAddress = document.getElementById("wallet-address").textContent.split(": ")[1];
  if (walletAddress !== "Not Connected") {
    localStorage.setItem(walletAddress, score);
  }
}
