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

let snake = {
  color: "purple",
  ...initHeadAndBody(),
  direction: initDirection(),
  score: 0,
};
let apple1 = {
  color: "red",
  position: initPosition(),
};
let apple2 = {
  color: "red",
  position: initPosition(),
};

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
  scoreCtx.font = "30px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    var img = document.getElementById("snakeHead");
    ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    //loop
    for (let i = 1; i < snake.body.length; i++) {
      var body = snake.body[i];

      var img = document.getElementById("snakeBody")
      ctx.drawImage(img, body.x * CELL_SIZE, body.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
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

function eat(snake, apple1, apple2) {
  if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
    apple1.position = initPosition();
    snake.score++;
    //this
    snake.body.push({ x: snake.head.x, y: snake.head.y });
  }
  if (snake.head.x == apple2.position.x && snake.head.y == apple2.position.y) {
    apple2.position = initPosition();
    snake.score++;
    //this
    snake.body.push({ x: snake.head.x, y: snake.head.y });
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple1, apple2);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple1, apple2);
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
  setTimeout(function () {
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
});

move(snake);
