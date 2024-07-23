// Получаем элементы холста и контекста для рисования
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Инициализация параметров игры
let bird = { x: 50, y: 150, width: 20, height: 20, dy: 0 }; // Начальные параметры птички
let pipes = []; // Массив труб
let score = 0; // Счет игры
let gravity = 0.12; // Уменьшенная гравитация
let jumpStrength = -4.2; // Увеличенная сила прыжка
let pipeSpeed = 2; // Скорость движения труб
let pipeFrequency = 150; // Частота создания новых труб (чем больше значение, тем реже)
let frameCount = 60; // Счетчик кадров для контроля создания труб
let gameOver = false; // Флаг завершения игры

// Функция для создания новых труб
function createPipe() {
    let gap = 90; // Расстояние между верхней и нижней трубой
    let minHeight = 30; // Минимальная высота трубы
    let maxHeight = canvas.height - gap - minHeight; // Максимальная высота трубы
    let height = Math.floor(Math.random() * maxHeight) + minHeight; // Генерация случайной высоты трубы

    // Создаем верхнюю и нижнюю трубы и добавляем их в массив труб
    pipes.push({ x: canvas.width, y: 0, width: 40, height: height }); // Верхняя труба
    pipes.push({ x: canvas.width, y: height + gap, width: 40, height: canvas.height - height - gap }); // Нижняя труба
}

// Функция для обновления состояния игры
function updateGame() {
    if (gameOver) return; // Если игра окончена, прекращаем обновления

    bird.dy += gravity; // Применяем гравитацию к птичке
    bird.y += bird.dy; // Обновляем позицию птички

    // Проверяем выход птички за пределы холста
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Обновляем каждую трубу и проверяем на столкновение
    for (let i = 0; i < pipes.length; i += 2) {
        let topPipe = pipes[i];
        let bottomPipe = pipes[i + 1];

        topPipe.x -= pipeSpeed; // Двигаем верхнюю трубу влево
        bottomPipe.x -= pipeSpeed; // Двигаем нижнюю трубу влево

        // Проверка на столкновение с птичкой
        if (
            (bird.x < topPipe.x + topPipe.width && bird.x + bird.width > topPipe.x &&
            bird.y < topPipe.y + topPipe.height && bird.y + bird.height > topPipe.y) ||
            (bird.x < bottomPipe.x + bottomPipe.width && bird.x + bird.width > bottomPipe.x &&
            bird.y < bottomPipe.y + bottomPipe.height && bird.y + bird.height > bottomPipe.y)
        ) {
            gameOver = true; // Устанавливаем флаг окончания игры при столкновении
        }

        // Удаляем трубы, которые вышли за левую границу экрана
        if (topPipe.x + topPipe.width < 0) {
            pipes.splice(i, 2); // Удаляем верхнюю и нижнюю трубы
            score++; // Увеличиваем счет за каждую пройденную пару труб
            i -= 2; // Уменьшаем индекс, чтобы корректно обработать следующий набор труб
        }
    }

    // Увеличиваем счетчик кадров
    frameCount++;

    // Создаем новые трубы в зависимости от частоты
    if (frameCount % pipeFrequency === 0) {
        createPipe();
    }
}

// Функция для отрисовки состояния игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед каждым кадром

    // Отрисовка птички
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Отрисовка труб
    ctx.fillStyle = '#008000';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    });

    // Отрисовка счета
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    // Отрисовка сообщения об окончании игры
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '32px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    }
}

// Основной игровой цикл
function gameLoop() {
    updateGame(); // Обновляем состояние игры
    drawGame(); // Отрисовываем текущий кадр
    requestAnimationFrame(gameLoop); // Запускаем следующий кадр
}

// Обработчик кликов по холсту
canvas.addEventListener('click', () => {
    if (gameOver) {
        // Если игра окончена, сбрасываем параметры игры
        bird = { x: 50, y: 150, width: 20, height: 20, dy: 0 };
        pipes = [];
        score = 0;
        gameOver = false;
        frameCount = 0; // Сброс счетчика кадров
    } else {
        // В противном случае, птичка подпрыгивает
        bird.dy = jumpStrength; // Применяем силу прыжка
    }
});

// Запускаем игровой цикл
gameLoop();

