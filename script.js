const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const highScoresDisplay = document.getElementById("high-scores");

let score = 0;
let timeLeft = 30; // Tiempo de 30 segundos
let highScores = []; // Almacenar los 10 mejores puntajes
let gameInterval;
let antInterval;

// Función para mover la hormiga en pequeños pasos aleatorios
function moveAnt(ant) {
    let x = parseFloat(ant.style.left || 0);
    let y = parseFloat(ant.style.top || 0);

    const stepSize = 1; // Tamaño del "paso" progresivo (1 píxel a la vez)
    const targetX = x + (Math.random() - 0.5) * 160; // Punto de destino en x (hasta 80px en cualquier dirección)
    const targetY = y + (Math.random() - 0.5) * 160; // Punto de destino en y (hasta 80px en cualquier dirección)

    const moveInterval = setInterval(() => {
        // Determinar la dirección del movimiento en x
        if (x < targetX) {
            x = Math.min(x + stepSize, targetX); // Avanzar hacia la derecha
        } else if (x > targetX) {
            x = Math.max(x - stepSize, targetX); // Avanzar hacia la izquierda
        }

        // Determinar la dirección del movimiento en y
        if (y < targetY) {
            y = Math.min(y + stepSize, targetY); // Avanzar hacia abajo
        } else if (y > targetY) {
            y = Math.max(y - stepSize, targetY); // Avanzar hacia arriba
        }

        // Aplicar las nuevas posiciones a la hormiga
        ant.style.left = `${x}px`;
        ant.style.top = `${y}px`;

        // Si la hormiga llegó a su destino, generar un nuevo destino
        if (x === targetX && y === targetY) {
            clearInterval(moveInterval); // Detener el movimiento actual
            moveAnt(ant); // Mover la hormiga a otro punto
        }
    }, 7); // Movimiento progresivo cada 7ms (suave y fluido)

    // Eliminar la hormiga después de 5 segundos si no ha sido aplastada
    setTimeout(() => {
        clearInterval(moveInterval);
        if (ant.parentElement) {
            ant.remove();
        }
    }, 5000); // Las hormigas desaparecen después de 5 segundos
}

// Función para crear una hormiga
function createAnt() {
    const ant = document.createElement("img");
    ant.classList.add("ant");

    // Usar el GIF de la hormiga
    ant.src = './antwalk.gif'; // Asegúrate de que el archivo esté en el mismo directorio
    ant.alt = "Ant";

    // Posicionar la hormiga en un lugar aleatorio dentro del contenedor
    let x = Math.random() * (gameContainer.offsetWidth - 60);
    let y = Math.random() * (gameContainer.offsetHeight - 60);
    ant.style.left = `${x}px`;
    ant.style.top = `${y}px`;

    // Añadir evento de clic
    ant.addEventListener("click", function () {
        score += 5;
        scoreDisplay.textContent = score;

        // Reproducir sonido al aplastar
        const splatSound = new Audio('./golpe.wav');
        splatSound.play();

        // Mostrar un puntaje animado temporal
        const scorePopup = document.createElement("div");
        scorePopup.textContent = "+5";
        scorePopup.style.position = "absolute";
        scorePopup.style.left = ant.style.left;
        scorePopup.style.top = ant.style.top;
        scorePopup.style.color = "#00ff00"; // Color verde llamativo
        scorePopup.style.fontSize = "20px";
        scorePopup.style.fontWeight = "bold";
        scorePopup.style.transition = "all 0.5s ease"; // Animación de transición
        gameContainer.appendChild(scorePopup);

        // Animar el puntaje para que suba y desaparezca
        setTimeout(() => {
            scorePopup.style.top = `${parseFloat(scorePopup.style.top) - 20}px`; // Subir 20px
            scorePopup.style.opacity = "0"; // Hacer desaparecer
        }, 100);

        // Eliminar el puntaje después de 0.5 segundos
        setTimeout(() => {
            scorePopup.remove();
        }, 600);

        ant.remove(); // Eliminar la hormiga

        // Mostrar el splash de aplastado
        const splash = document.createElement("div");
        splash.classList.add("splash");
        splash.style.left = ant.style.left;
        splash.style.top = ant.style.top;
        gameContainer.appendChild(splash);

        // Eliminar el splash después de 0.5 segundos
        setTimeout(() => {
            splash.remove();
        }, 500);
    });

    gameContainer.appendChild(ant);
    moveAnt(ant); // Iniciar el movimiento de la hormiga
}

// Función para iniciar el juego
function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    timeLeft = 3;
    timerDisplay.textContent = timeLeft;

    // Crear hormigas cada 0.5 segundos
    antInterval = setInterval(createAnt, 500);

    // Temporizador de cuenta regresiva
    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000); // Disminuir cada segundo
}

// Función para guardar el puntaje en la lista de mejores puntajes
function saveHighScore(nickname) {
    highScores.push({ nickname: nickname, score: score }); // Guardar el nombre y el puntaje
    highScores.sort((a, b) => b.score - a.score); // Ordenar de mayor a menor
    if (highScores.length > 10) {
        highScores.pop(); // Mantener solo los 10 mejores puntajes
    }
}

// Función para terminar el juego
function endGame() {
    clearInterval(gameInterval); // Detener el temporizador
    clearInterval(antInterval); // Detener la creación de hormigas

    // Mostrar un mensaje de "Game Over"
    const gameOverMessage = document.createElement("div");
    gameOverMessage.textContent = "¡Tiempo agotado!";
    gameOverMessage.style.fontSize = "50px";
    gameOverMessage.style.color = "#ff4500";
    gameOverMessage.style.position = "absolute";
    gameOverMessage.style.left = "50%";
    gameOverMessage.style.top = "50%";
    gameOverMessage.style.transform = "translate(-50%, -50%)";
    gameContainer.appendChild(gameOverMessage);

    // Hacer que parpadee el mensaje de Game Over
    setInterval(() => {
        gameOverMessage.style.opacity = gameOverMessage.style.opacity === '0' ? '1' : '0';
    }, 500);

    // Si el puntaje es mayor o igual a 5, preguntar por el nickname
    if (score >= 5) {
        const nickname = prompt("¡Felicidades! Ingresa tu nombre para la tabla de puntuaciones:");
        if (nickname) {
            saveHighScore(nickname); // Guardar el puntaje con el nickname ingresado
        } else {
            saveHighScore("Jugador"); // Si no se ingresa nombre, se guarda como "Jugador"
        }
    }

    // Mostrar los mejores puntajes
    showHighScores();

    // Reiniciar el juego después de unos segundos
    setTimeout(() => {
        gameOverMessage.remove(); // Quitar el mensaje
        startGame(); // Reiniciar el juego
    }, 3000); // Reiniciar el juego después de 3 segundos
}


// Función para mostrar la tabla de mejores puntajes
function showHighScores() {
    highScoresDisplay.innerHTML = "<h2>Mejores Puntajes</h2>";
    highScores.forEach((entry, index) => {
        highScoresDisplay.innerHTML += `<p>${index + 1}. ${entry.nickname || 'Jugador'}: ${entry.score} puntos</p>`;
    });
}


// Iniciar el juego cuando la página esté lista
window.onload = startGame;
