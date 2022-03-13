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
};
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
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function makeSnake(color){
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        level: 1,
    }
}

let snakeObj = makeSnake("green");

let apples = [
	{
		color: "red",
		position: initPosition(),
	},
	{
		color: "yellow",
		position: initPosition(),
	},
];

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
        lifesCanvas = document.getElementById("lifesBoard");
    } 
    let lifesCtx = lifesCanvas.getContext("2d");

    lifesCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    lifesCtx.font = "25px Arial";
    lifesCtx.fillStyle = "red"
    lifesCtx.fillText("Life: \n" + lifes[0].lifes, 10, lifesCanvas.scrollHeight / 2);
}

function drawScore(snake) {
    let scoreCanvas;

    scoreCanvas = document.getElementById("score1Board");
   
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "20px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText("Score : "+snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLevel(snakeScore){
    console.log(snakeScore);
    let levelCanvas = document.getElementById("levelBoard");
    let ctx = levelCanvas.getContext("2d");

    if(snakeScore == 0){
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = snakeObj.color;
        ctx.font = "18px Arial";
        ctx.fillText("Level : "+snakeObj.level, 10, levelCanvas.scrollHeight / 2);
    }else if((snakeScore % 5) == 0){
        snakeObj.level += 1;
        console.log(snakeObj.level);
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = snakeObj.color;
        ctx.font = "16px Arial";
        ctx.fillText("Level : "+snakeObj.level, 10, levelCanvas.scrollHeight / 2);
    }
    
    for(var i = 0; i<List_Level.length; i++){
        if(snakeObj.level == List_Level[i].level){
            MOVE_INTERVAL = List_Level[i].kecepatan;
        }
    }
}

function draw() {
    drawLevel(snakeObj.score)
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        var imgHead = document.getElementById("snakeHead");
        //drawCell(ctx, snake.head.x, snake.head.y, snake.color, "snakeHead");
        ctx.drawImage(imgHead, snakeObj.head.x * CELL_SIZE, snakeObj.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        //loop
        for (let i = 1; i < snakeObj.body.length; i++) {
            var body = snakeObj.body[i];
            var imgBody = document.getElementById("snakeBody");
            ctx.drawImage(imgBody, body.x * CELL_SIZE, body.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        for (let i = 0; i < apples.length; i++) {
			let apple = apples[i];

			var img = document.getElementById("apple");
			ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
		}

        // loop untuk menampilkan life jika dibilangan prima
        let pembagi = 0;
        for(let i = 0; i <= snakeObj.score; i++){
            if(snakeObj.score % i == 0){
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
        
        drawScore(snakeObj);
        drawlifes(lifes);
        initWalls(ctx);
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

function eat(snake, apples, lifes) {
    for (let i = 0; i < apples.length; i++) {
		let apple = apples[i];
		if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
			apple.position = initPosition();
			snake.score++;
			
			//this
			snake.body.push({ x: snake.head.x, y: snake.head.y });
			drawLevel(snake.score);
		}
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
    eat(snake, apples, lifes);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples, lifes);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples, lifes);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples, lifes);
}

function restartSnake(snake){
    return{
        color: snake.color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: snake.score,
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

let walls = [];

// add level
function levelUp() {
    switch (snakeObj.score) {
        case 5:
            snakeObj.level = 2;
            MOVE_INTERVAL = 100;   
            walls[0] = {x1: 15,y1: 5,x2: 15,y2: 25};     
            break;
        case 10:
            snakeObj.level = 3;
            MOVE_INTERVAL = 80;
            walls[0] = {x1: 5,y1: 10,x2: 25,y2: 10};  
            walls[1] = {x1: 5,y1: 20,x2: 25,y2: 20};  
            break;
        case 15:
            snakeObj.level = 4;
            MOVE_INTERVAL = 65;
            walls[0] = {x1: 5,y1: 5,x2: 25,y2: 5};  
            walls[1] = {x1: 5,y1: 15,x2: 25,y2: 15}; 
            walls[2] = {x1: 5,y1: 25,x2: 25,y2: 25};
            break;
        case 20:
            snakeObj.level = 5;
            MOVE_INTERVAL = 50;
            walls[0] = {x1: 10,y1: 5,x2: 20,y2: 5};  
            walls[1] = {x1: 5,y1: 10,x2: 5,y2: 20}; 
            walls[2] = {x1: 10,y1: 25,x2: 20,y2: 25};
            walls[3] = {x1: 25,y1: 10,x2: 25,y2: 20};
            break;
    }
}

function initWalls(ctx) {
    switch (snakeObj.level) {
        case 2:   
            drawLine(ctx, walls[0].x1, walls[0].y1, walls[0].x2, walls[0].y2);
            break;
        case 3:
            for (i = 0; i < snakeObj.level - 1; i++) {
                drawLine(ctx, walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
            }
            break;
        case 4:
            for (i = 0; i < snakeObj.level - 1; i++) {
                drawLine(ctx, walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
            }
            break;
        case 5:
            for (i = 0; i < snakeObj.level - 1; i++) {
                drawLine(ctx, walls[i].x1, walls[i].y1, walls[i].x2, walls[i].y2);
            }
            break;
    }
}

function wallCollision(snake) {
    let isCollide = false;

    if (snakeObj.level > 1) {
        for (let i = 0; i < snakeObj.level - 1; i++) {
            if (snake.head.x == walls[i].x1 && snake.head.y >= walls[i].y1 && snake.head.y < walls[i].y2 ) {
                isCollide = true;
            } else if (snake.head.y == walls[i].y1 && snake.head.x >= walls[i].x1 && snake.head.x < walls[i].x2 ) {
                isCollide = true;
            }
        }
    }
    return isCollide;
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

    if (wallCollision()) {
        isCollide = true;
    }

    if(isEatSelf == true){
        if(lifes[0].lifes == 0){
            alert("Game over");
            snakeObj = makeSnake("green");
            window.location.reload();
            // console.log(snakeObj.color);
            // lifes[0].lifes = 3;
        }
        else{
            lifes[0].lifes -= 1;
            restartSnake(snakeObj);
        }
        //return isEatSelf = false;
    } else if(lifes[0].lifes == 0){
        
        // ctx.fillText('Game over', 10, lifesCanvas.scrollHeight / 2);
    }
    // else if (lifes[0].lifes == 0 && EatSelf(snake, initHeadAndBody)) {
    //     clearInterval(MOVE_INTERVAL);
    // }
    // snake.unshift(initHeadAndBody);
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
            move(snakeObj);
        }, MOVE_INTERVAL);
    }else{
        move(snakeObj);
    }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    snakeObj.direction = DIRECTION.LEFT;
  } else if (event.key === "ArrowRight") {
    snakeObj.direction = DIRECTION.RIGHT;
  } else if (event.key === "ArrowUp") {
    snakeObj.direction = DIRECTION.UP;
  } else if (event.key === "ArrowDown") {
    snakeObj.direction = DIRECTION.DOWN;
  }
});

move(snakeObj);