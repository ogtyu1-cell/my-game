const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// サイズ自動調整（スマホ画面対応）
function resizeCanvas() {
  const scale = Math.min(window.innerWidth / 480, window.innerHeight / 320);
  canvas.style.width = 480 * scale + "px";
  canvas.style.height = 320 * scale + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ボール設定
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 8;

// パドル設定
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// 入力フラグ
let rightPressed = false;
let leftPressed = false;

// タッチ操作用
let touchX = null;

// ブロック設定
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, visible: true };
  }
}

// PC操作イベント
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// タッチ操作イベント
canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);
canvas.addEventListener("touchend", touchEndHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// タッチ開始
function touchStartHandler(e) {
  const rect = canvas.getBoundingClientRect();
  touchX = e.touches[0].clientX - rect.left;
}

// タッチ移動
function touchMoveHandler(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  paddleX = x - paddleWidth / 2;
  e.preventDefault();
}

// タッチ終了
function touchEndHandler() {
  touchX = null;
}

// 衝突判定
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.visible) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          dy = -dy;
          b.visible = false;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("🎉 クリア！おめでとう！");
            document.location.reload();
          }
        }
      }
    }
  }
}

// 描画関数群
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#00ff88";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].visible) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff6600";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 8, 20);
}

// メインループ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // 壁との衝突
  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
  if (ballY + dy < ballRadius) dy = -dy;
  else if (ballY + dy > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("💥 ゲームオーバー！");
      document.location.reload();
    }
  }

  // パドル操作
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
  else if (leftPressed && paddleX > 0) paddleX -= 7;

  // ボール移動
  ballX += dx;
  ballY += dy;

  requestAnimationFrame(draw);
}

draw();
