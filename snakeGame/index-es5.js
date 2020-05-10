"use strict";

// 画布边框及背景颜色
var CANVAS_BORDER_COLOR = 'black';
var CANVAS_BACKGRUOUN_COLOR = '#1AAC67'; // 蛇身颜色

var SNAKE_COLOR = 'lightgreen';
var SNAKE_BORDER_COLOR = 'blue'; // 食物颜色

var FOOD_COLOR = 'red';
var FOOD_BORDER_COLOR = 'darked';
var moveSpeed = 0; // 获取所需元素dom

var startBtn = document.getElementsByClassName('start-btn')[0];
var gameStartPop = document.getElementsByClassName('game-start-pop')[0];
var gameOverPop = document.getElementsByClassName('game-over-pop')[0];
var container = document.getElementsByClassName('container')[0];
var topScoreBox = document.getElementsByClassName('topScoreBox')[0];
var replay = document.getElementById('replayBtn');
var cancel = document.getElementById('cancelBtn');
var topScoreInfo = document.getElementById('topScoreInfo');
var snake = []; // 横向移动速度

var dx = 10; // 纵向移动速度

var dy = 0; // 设置食物初始坐标

var foodX = 0;
var foodY = 0;

// 玩家分数
var score = 0;
// 最高分
var topScore = 0;
var timer = null;
var switchStop = false; // 停止
// 未ture时表示蛇正在改变方向

var isChangeDirection = false;
var gameCanvas = document.getElementById('gameCanvas');
var ctx = gameCanvas.getContext('2d');
document.addEventListener('keydown', changeDirection);
document.addEventListener('keydown', switchStartOrStop); // 开始游戏

startBtn.addEventListener('click', function () {
  var val = GetRadioValue('speed');
  moveSpeed = val;
  gameInit();
  main();
  gameStartPop.style.display = 'none';
  container.style.display = 'block';
});

// 再来一次
replay.addEventListener('click', function () {
  gameOverPop.style.display = 'none';
  gameInit();
  main();
});
// 退出游戏
cancel.addEventListener('click', function () {
  gameOverPop.style.display = 'none';
  gameStartPop.style.display = 'block';
  container.style.display = 'none'; // main();
}); 

// 获取input radio选中的值
function GetRadioValue(RadioName) {
  var obj;
  obj = document.getElementsByName(RadioName);

  if (obj != null) {
    var i;
    for (i = 0; i < obj.length; i++) {
      if (obj[i].checked) {
        return obj[i].value;
      }
    }
  }

  return null;
}

function main() {
  timer = setInterval(function () {
    if (didGameEnd()) return;
    isChangeDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
  }, moveSpeed);
}

// 初始化
function gameInit() {
  dx = 10;
  dy = 0;
  score = 0;
  snake = [{
    x: 150,
    y: 150
  }, {
    x: 140,
    y: 150
  }, {
    x: 130,
    y: 150
  }, {
    x: 120,
    y: 150
  }, {
    x: 110,
    y: 150
  }];
  createFood();
  setGameScore();
  getTopScore();
}

// 清空画布
function clearCanvas() {
  ctx.fillStyle = CANVAS_BACKGRUOUN_COLOR;
  ctx.strokeStyle = CANVAS_BORDER_COLOR;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.strokeStyle = SNAKE_BORDER_COLOR;
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// 画蛇
function drawSnake() {
  snake.forEach(function (item) {
    drawSnakePart(item);
  });
}

// 移动
function advanceSnake() {
  var head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };
  snake.unshift(head);
  var didEatFood = snake[0].x === foodX && snake[0].y === foodY;

  if (didEatFood) {
    score += 10;
    setGameScore();
    createFood();
  } else {
    snake.pop();
  }
}

// 按下方向键改变蛇的移动方向
function changeDirection(e) {
  var keyPressed = e.keyCode;
  var UP_KEY = 38; // 上
  var DOWN_KEY = 40; // 下
  var LEFT_KEY = 37; // 左
  var RIGHT_KEY = 39; // 右
  var goingUp = dy === -10;
  var goingDown = dy === 10;
  var goingLeft = dx === -10;
  var goingRight = dx === 10;
  if (isChangeDirection) return;
  isChangeDirection = true;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

// 随机产生食物
function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    var foodIsOnSnake = part.x === foodX && part.y === foodY;

    if (foodIsOnSnake) {
      createFood();
    }
  });
}

// 画食物
function drawFood() {
  ctx.fillStyle = FOOD_COLOR;
  ctx.strokeStyle = FOOD_BORDER_COLOR;
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

// 游戏分数
function setGameScore() {
  document.getElementById('score').innerHTML = score;
}
// 获取最高分
function getTopScore() {

  // 检测是否支持Storage
  if (window.localStorage) {
    // try {
    //   topScore = localStorage.getItem('topScore');
    // } catch (error) {
    //   topScore = score
    // }   
    topScore = localStorage.getItem('topScore') || score;
    topScoreInfo.innerHTML = topScore
  } else {
    topScoreBox.style.display = 'none'
  }

}

// 设置最高分
function setTopScore() {
  console.log('set')
  if (score === 0 && topScore === 0) {
    localStorage.setItem('topScore', topScore);
  } else if (score > topScore) {
    topScore = score;
    console.log('打破纪录！')
    localStorage.setItem('topScore', topScore);
  }
    topScoreInfo.innerHTML = topScore
}
// 结束游戏
function didGameEnd() {
  // 碰到身体其他部分游戏结束
  for (var i = 4; i < snake.length; i++) {
    var didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

    if (didCollide) {
      clearInterval(timer);
      gameOverPop.style.display = 'flex';
      clearCanvas();
      setTopScore();
      return true;
    }
  }

  // 撞上画布游戏结束
  var hitLeftWall = snake[0].x < 0;
  var hitRightWall = snake[0].x > gameCanvas.width - 10;
  var hitTopWall = snake[0].y < 0;
  var hitBottomWall = snake[0].y > gameCanvas.height - 10;
  var isEnd = hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;

  if (isEnd) {
    clearInterval(timer);
    gameOverPop.style.display = 'flex';
    clearCanvas();
    setTopScore();
    return true;
  }
}

// 开始暂停
function switchStartOrStop(e) {
  var keyPressed = e.keyCode;
  var SPACE_KEY = 32; // 空格

  if (keyPressed === SPACE_KEY) {
    if (switchStop) {
      main();
      console.log('走', switchStop);
      switchStop = false;
    } else {
      clearInterval(timer);
      console.log('停', switchStop);
      switchStop = true;
    }
  }
}