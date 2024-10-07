const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const highScoresDisplay = document.getElementById("high-scores");

let score = 0;
let timeLeft = 60; // Tiempo de 60 segundos
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

        // Si la hormiga llegó a su destino en x e y, generar un nuevo destino
        if (x === targetX && y === targetY) {
            clearInterval(moveInterval); // Detener la hormiga si llegó a su destino

            // Luego de alcanzar el punto, hacer que la hormiga se mueva a un nuevo destino
            moveAnt(ant); // Llamar de nuevo a la función para moverla a otro punto
        }
    }, 7); // Movimiento progresivo cada 10ms (suave y fluido)

    // Eliminar la hormiga después de 3 segundos si no ha sido aplastada
    setTimeout(() => {
        clearInterval(moveInterval);
        if (ant.parentElement) {
            ant.remove();
        }
    }, 5000); // Hormigas desaparecen después de 3 segundos
}



// Función para crear una hormiga
function createAnt() {
    const ant = document.createElement("img");
    ant.classList.add("ant");

    // Usar el GIF de la hormiga
    ant.src = './antwalk.gif'; // Asegúrate de que el archivo esté en el mismo directorio o ajusta la ruta
    ant.alt = "Ant"; // Texto alternativo

    // Posicionar la hormiga en un lugar aleatorio dentro del contenedor
    let x = Math.random() * (gameContainer.offsetWidth - 60);
    let y = Math.random() * (gameContainer.offsetHeight - 60);
    ant.style.left = `${x}px`;
    ant.style.top = `${y}px`;

    // Añadir evento de clic
    ant.addEventListener("click", function() {
        score+=5;
        scoreDisplay.textContent = score;

        // Reproducir sonido al aplastar
        const splatSound = new Audio('./golpe.wav');
        splatSound.play();

        ant.remove(); // Eliminar la hormiga

        const splash = document.createElement("div");
    splash.classList.add("splash");

    // Posicionar el splash exactamente donde está la hormiga
    splash.style.left = ant.style.left;
    splash.style.top = ant.style.top;

    // Añadir el splash al contenedor del juego
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
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;

    // Crear hormigas cada 1.5 segundos
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

// Función para terminar el juego
function endGame() {
    clearInterval(gameInterval); // Detener el temporizador
    clearInterval(antInterval); // Detener la creación de hormigas
    saveHighScore(); // Guardar el puntaje actual
    showHighScores(); // Mostrar la tabla de mejores puntajes
    setTimeout(startGame, 3000); // Reiniciar el juego después de 3 segundos
}

// Función para guardar el puntaje en la lista de mejores puntajes
function saveHighScore() {
    highScores.push(score);
    highScores.sort((a, b) => b - a); // Ordenar de mayor a menor
    if (highScores.length > 10) {
        highScores.pop(); // Mantener solo los 10 mejores puntajes
    }
}

// Función para mostrar la tabla de mejores puntajes
function showHighScores() {
    highScoresDisplay.innerHTML = "<h2>Mejores Puntajes</h2>";
    highScores.forEach((score, index) => {
        highScoresDisplay.innerHTML += `<p>${index + 1}. ${score}</p>`;
    });
}



// Iniciar el juego cuando la página esté lista
window.onload = startGame;
