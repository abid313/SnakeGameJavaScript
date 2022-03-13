const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
let MOVE_INTERVAL = 150;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color){
    return {
        ...initHeadAndBody(),
        direction: initDirection()
    }
}

function initProperty() {
    return {
        life: 3,
        level: 1,
        score: 0,
        counter: 0,
    }
}

let snake = initSnake("green");
let prop = initProperty();

let apples = [{
    position: initPosition(),
},
{
    position: initPosition(),
}]

let lifes = {
    position: initPosition(),
    visible: true,
    visibleCount: 0,
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawHead(ctx, x, y) {
    let snakeHead = document.getElementById('snakeHead');
    ctx.drawImage(snakeHead,  x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

function drawBody(ctx, x, y) {
    let snakeBody = document.getElementById('snakeBody');
    ctx.drawImage(snakeBody,  x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

function drawlevel() {
    let scoreCanvas;
    if (snake.color == snake.color) {
        scoreCanvas = document.getElementById("levelberapa");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = "black"
    scoreCtx.fillText("Snake Game - Level: "+prop.level, 10, scoreCanvas.scrollHeight / 2);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake.color) {
        scoreCanvas = document.getElementById("score1Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = "black"
    scoreCtx.fillText("Score: \n" +prop.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawkeceptan() {
    let kecepetanCanvas;
    kecepetanCanvas = document.getElementById("score2Board");
    let keceptanCtx = kecepetanCanvas.getContext("2d");

    keceptanCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    keceptanCtx.font = "20px Arial";
    keceptanCtx.fillStyle = "black"
    keceptanCtx.fillText("Speed: "+MOVE_INTERVAL + " .ms", 10, kecepetanCanvas.scrollHeight / 2);
}

function drawExtraLife(ctx) {
    while (lifes.position.y == 0 || wallCollision(lifes.position.x, lifes.position.y)) {
        lifes.position = initPosition();
    }
    if (lifes.visible) {
        var img = document.getElementById("life");
        ctx.drawImage(img, lifes.position.x * CELL_SIZE, lifes.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        lifes.visibleCount++;
        if (lifes.visibleCount == 10) {
            lifes.visible = false;
        }
    } else {
        drawCell(ctx, lifes.position.x, lifes.position.y, "rgb(255,255,255,0)")
        lifes.visibleCount--;
        if (lifes.visibleCount == 0) {
            lifes.visible = true;
        }
    }
}

function checkPrime() {
    let isPrime = true;
    if (prop.score > 1) {
        for (let i = 2; i < prop.score; i++) {
            if (prop.score % i == 0) {
                isPrime = false;
                break;
            }
        }
        return isPrime;
    }
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.strokeStyle = "brown";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1 * CELL_SIZE, y1 * CELL_SIZE);
    ctx.lineTo(x2 * CELL_SIZE, y2 * CELL_SIZE);
    ctx.stroke();
}

let walls = []

function levelUp() {
    if (prop.score == 5 && prop.counter == 0) {
        var audio = new Audio('assets/NaikLevel.mp3');
        alert("Level 1 Complete");
        audio.play();
        prop.level = 2;  
        MOVE_INTERVAL = 120;   
        walls[0] = {x1: 15,y1: 5,x2: 15,y2: 25};
        prop.counter++;
    } else if (prop.score == 10 && prop.counter == 1) {
        var audio = new Audio('assets/NaikLevel.mp3');
        alert("Level 2 Complete");
        audio.play();
        prop.level = 3;
        MOVE_INTERVAL = 100;
        walls[0] = {x1: 5,y1: 10,x2: 25,y2: 10};  
        walls[1] = {x1: 5,y1: 20,x2: 25,y2: 20};  
        prop.counter++;
    } else if (prop.score == 15 && prop.counter == 2) {
        var audio = new Audio('assets/NaikLevel.mp3');
        alert("Level 3 Complete");
        audio.play();
        prop.level = 4;
        MOVE_INTERVAL = 85;
        walls[0] = {x1: 5,y1: 5,x2: 25,y2: 5};  
        walls[1] = {x1: 5,y1: 15,x2: 25,y2: 15}; 
        walls[2] = {x1: 5,y1: 25,x2: 25,y2: 25};
        prop.counter++;
    } else if (prop.score == 20 && prop.counter == 3) {
        var audio = new Audio('assets/NaikLevel.mp3');
        alert("Level 4 Complete");
        audio.play();
        prop.level = 5;
        MOVE_INTERVAL = 75;
        walls[0] = {x1: 10,y1: 5,x2: 20,y2: 5};  
        walls[1] = {x1: 5,y1: 10,x2: 5,y2: 20}; 
        walls[2] = {x1: 10,y1: 25,x2: 20,y2: 25};
        walls[3] = {x1: 25,y1: 10,x2: 25,y2: 20};
        prop.counter++;
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawHead(ctx, snake.head.x, snake.head.y);
        for (let i = 1; i < snake.body.length; i++) {
            drawBody(ctx, snake.body[i].x, snake.body[i].y);
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            while (apple.position.y == 0 || wallCollision(apple.position.x, apple.position.y)) {
                apple.position = initPosition();
            }
            // Soal no 3: DrawImage apple dan gunakan image id:
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        for (let i = 0; i < prop.life; i++) {
            var img = document.getElementById("life");
            ctx.drawImage(img, i * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
        }

        if (checkPrime()){
            drawExtraLife(ctx);
        }

        if (prop.level > 1) {
            for (i = 0; i < prop.level - 1; i++) {
                    drawLine(ctx, walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
                }
        }
        drawlevel(snake);
        drawkeceptan(snake);
        drawScore(snake);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            apple.position = initPosition();
            prop.score++;
            snake.body.push({x: snake.head.x, y: snake.head.y});
        }
    }
    levelUp();
    eatExtraLife();
}

function eatExtraLife() {
    if (snake.head.x == lifes.position.x && snake.head.y == lifes.position.y) {
        lifes.position = initPosition();
        prop.life++;
        prop.score++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        levelUp();
    }
}

function wallCollision(x, y) {
    let isCollide = false;

    if (prop.level > 1) {
        for (let i = 0; i < prop.level - 1; i++) {
            if (x == walls[i].x1 && y >= walls[i].y1 && y < walls[i].y2 || y == walls[i].y1 && x >= walls[i].x1 && x < walls[i].x2 ) {
                isCollide = true;
            }
        }
    }
    return isCollide;
}

function selfCollision(snakes){
    let isCollide = false;
    
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                isCollide = true;
                }
            }
        }
    }
    if (wallCollision(snake.head.x, snake.head.y)) {
        isCollide = true;
    }
    if (isCollide) {
        snake = initSnake("purple");
        prop.life--;
        if (prop.life == 0) {
            var audio = new Audio('assets/game-over.wav');
            audio.play();
            alert("Game Over");
            
            snake = initSnake();
            prop = initProperty();
            MOVE_INTERVAL = 120;
        }
    }
    return isCollide;
}


function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if(!selfCollision([snake])){
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    }else{
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake, DIRECTION.LEFT)
    } else if (event.key === "ArrowRight") {
        turn(snake, DIRECTION.RIGHT)
    } else if (event.key === "ArrowUp") {
        turn(snake, DIRECTION.UP)
    } else if (event.key === "ArrowDown") {
        turn(snake, DIRECTION.DOWN)
    }
})

function initGame() {
    move(snake);
}

move(snake);