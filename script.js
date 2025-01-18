// Clase para cada usuario en la matriz
class User {
    constructor(id, referrer = null) {
      this.id = id; // ID único del usuario
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
    addUser(userId, referrerId = null) {
      const newUser = new User(userId, referrerId);
  
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
  
  // Inicialización del DOM y prueba de la matriz
  document.addEventListener('DOMContentLoaded', () => {
    const matrix = new ForcedMatrix();
  
    // Agregar usuarios de ejemplo
    const user1 = matrix.addUser(1); // Usuario raíz (Admin)
    const user2 = matrix.addUser(2, user1); // Referido por el usuario 1
    const user3 = matrix.addUser(3, user1); // Referido por el usuario 1
    const user4 = matrix.addUser(4, user2); // Referido por el usuario 2
    const user5 = matrix.addUser(5, user2); // Referido por el usuario 2
    const user6 = matrix.addUser(6, user3); // Referido por el usuario 3
  
    // Mostrar la matriz en la consola
    matrix.displayMatrix();
  
    // Mostrar la matriz en la interfaz
    renderMatrix(matrix);
  });
  
  // Función para mostrar la matriz en la interfaz
  function renderMatrix(matrix) {
    const container = document.querySelector('.user-info');
    container.innerHTML = ""; // Limpiar contenido previo
  
    for (const [level, users] of Object.entries(matrix.levels)) {
      const levelDiv = document.createElement('div');
      levelDiv.classList.add('matrix-level');
      levelDiv.innerHTML = `<h3>Level ${level}</h3>`;
  
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');
        userDiv.textContent = `User ID: ${user.id}`;
        levelDiv.appendChild(userDiv);
      });
  
      container.appendChild(levelDiv);
    }
  }
  