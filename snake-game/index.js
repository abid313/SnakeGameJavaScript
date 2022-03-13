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
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
    }
}

let snake = initSnake("green");

let apple1 = {
    color: "yellow",
    position: initPosition(),
}
let apple2 = {
    color: "yellow",
    position: initPosition(),
}

let lifes = [
    {
    color: "red",
    position: initPosition(),
    lifes: 3,
    },
];

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawlifes(lifes){
    let lifesCanvas;
    if (lifes.color == lifes.color) {
        lifesCanvas = document.getElementById("score3Board");
    } 
    let lifesCtx = lifesCanvas.getContext("2d");

    lifesCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    lifesCtx.font = "25px Arial";
    lifesCtx.fillStyle = lifes.color
    lifesCtx.fillText("Life: \n" + lifes[0].lifes, 10, lifesCanvas.scrollHeight / 2);
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
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake.head.x, snake.head.y, snake.color);
        //loop
        for (let i = 1; i < snake.body.length; i++) {
            drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
        }

        // loop untuk menampilkan life jika dibilangan prima
        let pembagi = 0;
        for(let i = 0; i <= snake.score; i++){
            if(snake.score % i == 0){
                pembagi++;
            }
        }
        if (pembagi == 2){
            for (let i = 0; i < lifes.length; i++) {
                let life = lifes[i];
          
                var img = document.getElementById("lifes");
                ctx.drawImage(img, life.position.x * CELL_SIZE, life.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              }
        }

        drawCell(ctx, apple1.position.x, apple1.position.y, apple1.color);
        drawCell(ctx, apple2.position.x, apple2.position.y, apple2.color);
        
        drawScore(snake);
        drawlifes(lifes);
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

function eat(snake, apple1, apple2, lifes) {
    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
        //this
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
    if (snake.head.x == apple2.position.x && snake.head.y == apple2.position.y) {
        apple2.position = initPosition();
        snake.score++;
        //this
        snake.body.push({x: snake.head.x, y: snake.head.y});
    }
    for (let i = 0; i < lifes.length; i++) {
        let life = lifes[i];
        if (snake.head.x == life.position.x && snake.head.y == life.position.y) {
            life.position = initPosition();
            life.lifes++;
            snake.score++;
        }
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple1, apple2, lifes);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple1, apple2, lifes);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple1, apple2, lifes);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple1, apple2, lifes);
}

function EatSelf(snake){
    let isEatSelf = false;
    
    for(var i = 0; i < snake.length; i++){
        for(var o = 0; o < snake.length; o++){
            for(var p = 1; p < snake[o].body.length; p++){
                if (snake[i].head.x == snake[o].body[p].x && snake[i].head.y == snake[o].body[p].y) {
                    isEatSelf = true;
                }
            }
        }
    }
    if(isEatSelf == true){
        lifes[0].lifes -= 1;
        return isEatSelf = false;
    } else if(lifes[0].lifes <= 0){
        alert("Game over");
		window.location.reload();
    }
    return isEatSelf;
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
    if(!EatSelf([snake])){
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