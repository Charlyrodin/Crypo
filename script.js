// Clase para cada usuario en la matriz
class User {
  constructor(id, address, referrer = null) {
    this.id = id; // ID único del usuario
    this.address = address; // Dirección del usuario (wallet)
    this.referrer = referrer; // Usuario que lo refirió
    this.children = []; // Lista de referidos directos
  }

  // Método para agregar un referido
  addChild(user) {
    if (this.children.length < 2) {
      this.children.push(user);
      return true;
    }
    return false; // No se puede agregar más de 2 referidos directos
  }
}

// Clase para manejar la matriz forzada 2x20
class ForcedMatrix {
  constructor() {
    this.users = []; // Lista de todos los usuarios
    this.levels = {}; // Niveles de la matriz
  }

  // Método para agregar un usuario
  addUser(userId, address, referrerId = null) {
    const newUser = new User(userId, address, referrerId);

    if (this.users.length === 0) {
      // Si no hay usuarios, este es el primero (admin o raíz)
      this.users.push(newUser);
      this.levels[1] = [newUser]; // Primer nivel
      return newUser;
    }

    // Buscar lugar en la matriz
    for (const user of this.users) {
      if (user.addChild(newUser)) {
        this.users.push(newUser);
        this._addToLevel(newUser);
        return newUser;
      }
    }
    throw new Error("No space available in the matrix");
  }

  // Agregar usuario a un nivel específico
  _addToLevel(user) {
    const level = this.getLevel(user);
    if (!this.levels[level]) {
      this.levels[level] = [];
    }
    this.levels[level].push(user);
  }

  // Obtener el nivel de un usuario
  getLevel(user) {
    let level = 1;
    let current = user.referrer;
    while (current) {
      level++;
      current = this.users.find(u => u.id === current); // Encontrar al referrer en la lista de usuarios
    }
    return level;
  }

  // Mostrar la matriz completa en la consola
  displayMatrix() {
    console.log("Matrix Levels:");
    for (const [level, users] of Object.entries(this.levels)) {
      console.log(`Level ${level}:`, users.map(u => u.id));
    }
  }
}

// Inicialización y lógica del DOM
document.addEventListener("DOMContentLoaded", () => {
  const matrix = new ForcedMatrix();

  // Agregar usuarios de ejemplo
  matrix.addUser(1, "0xF991f...0E632"); // Usuario raíz (Admin)
  matrix.addUser(2, "0xf77e1...cbE8E", 1); // Referido por el usuario 1
  matrix.addUser(3, "0x575C8...26Be8", 1); // Referido por el usuario 1
  matrix.addUser(4, "0xd0A57...182a4", 2); // Referido por el usuario 2
  matrix.addUser(5, "0xA698e...FBe0f", 2); // Referido por el usuario 2
  matrix.addUser(6, "0x15437...D287A", 3); // Referido por el usuario 3

  // Mostrar tabla de downline
  renderDownlineTable(matrix);

  // Mostrar resumen de ingresos
  renderIncomeSummary();

  // Mostrar enlaces de referidos
  renderReferralLinks();
});

// Función para mostrar la tabla de referidos (Downline)
function renderDownlineTable(matrix) {
  const tableBody = document.querySelector("#downline-table tbody");
  tableBody.innerHTML = ""; // Limpiar contenido previo

  matrix.users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.id}</td>
      <td>${user.address}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Función para mostrar el resumen de ingresos
function renderIncomeSummary() {
  document.querySelector("#referral-income").textContent = "0.008 BNB";
  document.querySelector("#level-income").textContent = "0.024 BNB";
  document.querySelector("#community-size").textContent = "23";
  document.querySelector("#direct-referrals").textContent = "2";
}

// Función para mostrar los enlaces de referidos
function renderReferralLinks() {
  document.querySelector("#referral-link-trust").value =
    "https://r2r.pro/dashboard?ref=1872457";
  document.querySelector("#referral-link-safepal").value =
    "https://bnbfactory.cloud/dashboard?ref=1872457";
}

// Función para copiar enlaces de referidos
function copyLink(elementId) {
  const input = document.getElementById(elementId);
  input.select();
  input.setSelectionRange(0, 99999); // Para dispositivos móviles
  navigator.clipboard.writeText(input.value);
  alert("Copied the link: " + input.value);
}
