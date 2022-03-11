const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
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

const List_Level = [
    {level: 1, kecepatan: MOVE_INTERVAL, },
    {level: 2, kecepatan: MOVE_INTERVAL-30, },
    {level: 3, kecepatan: MOVE_INTERVAL-60, },
    {level: 4, kecepatan: MOVE_INTERVAL-90, },
    {level: 5, kecepatan: MOVE_INTERVAL-110, },
];

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

let snake = {
    color: "purple",
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    level: 1
}
let apple1 = {
    color: "red",
    position: initPosition(),
}
let apple2 = {
    color: "yellow",
    position: initPosition(),
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    
    if (snake.color == snake.color) {
        scoreCanvas = document.getElementById("score1Board");
    } else {
        scoreCanvas = document.getElementById("score2Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText("Score : "+snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLevel(snakeScore){
    let levelCanvas = document.getElementById("levelBoard");
    let ctx = levelCanvas.getContext("2d");

    if(snakeScore == 0){
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = snake.color;
        ctx.font = "18px Arial";
        ctx.fillText("Level : "+snake.level, 10, levelCanvas.scrollHeight / 2);
    }else if((snakeScore % 5) === 0){
        snake.level += 1;
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = snake.color;
        ctx.font = "16px Arial";
        ctx.fillText("Level : "+snake.level, 10, levelCanvas.scrollHeight / 2);
    }
    
    for(var i = 0; i<List_Level.length; i++){
        if(snake.level == List_Level[i].level){
            MOVE_INTERVAL = List_Level[i].kecepatan;
        }
    }
}

function draw() {
    drawLevel(snake.score)
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake.head.x, snake.head.y, snake.color);
        //loop
        for (let i = 1; i < snake.body.length; i++) {
            drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
        }
        drawCell(ctx, apple1.position.x, apple1.position.y, apple1.color);
        drawCell(ctx, apple2.position.x, apple2.position.y, apple2.color);

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

function eat(snake, apple) {
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
        apple.position = initPosition();
        snake.score++;
        snake.body.push({x: snake.head.x, y: snake.head.y});
        drawLevel(snake.score);
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2)
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2)
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2)
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple1);
    eat(snake, apple2)
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
    setTimeout(function() {
        move(snake);
    }, MOVE_INTERVAL);
}

//this
function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        snake.direction = DIRECTION.LEFT;
    } else if (event.key === "ArrowRight") {
        snake.direction = DIRECTION.RIGHT;
    } else if (event.key === "ArrowUp") {
        snake.direction = DIRECTION.UP;
    } else if (event.key === "ArrowDown") {
        snake.direction = DIRECTION.DOWN;
    }
})

move(snake);
