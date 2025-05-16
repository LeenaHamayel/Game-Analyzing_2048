document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const resultDisplay = document.getElementById("result");
  let squares = [];
  const width = 4;
  let score = 0;

  let storedData = localStorage.getItem("gameSessions");
  let sessionsData = storedData ? JSON.parse(storedData) : [];

  let startTime;
  let moveLog = [];

  function createBoard() {
    startTime = new Date();
    moveLog = [];
    squares = [];
    gridDisplay.innerHTML = "";

    for (let i = 0; i < width * width; i++) {
      let square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  function generate() {
    let randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2;
      checkForGameOver();
    } else generate();
  }

  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          parseInt(squares[i].innerHTML),
          parseInt(squares[i + 1].innerHTML),
          parseInt(squares[i + 2].innerHTML),
          parseInt(squares[i + 3].innerHTML),
        ];
        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);
        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          parseInt(squares[i].innerHTML),
          parseInt(squares[i + 1].innerHTML),
          parseInt(squares[i + 2].innerHTML),
          parseInt(squares[i + 3].innerHTML),
        ];
        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);
        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML),
      ];
      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);
      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML),
      ];
      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);
      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) +
          parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function control(e) {
    if (e.keyCode === 37) {
      moveLog.push("left");
      keyLeft();
    } else if (e.keyCode === 38) {
      moveLog.push("up");
      keyUp();
    } else if (e.keyCode === 39) {
      moveLog.push("right");
      keyRight();
    } else if (e.keyCode === 40) {
      moveLog.push("down");
      keyDown();
    }
  }
  document.addEventListener("keyup", control);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 256) {
        resultDisplay.innerHTML = "You WIN";
        logSession("win");
        document.removeEventListener("keyup", control);
        setTimeout(() => clear(), 3000);
      }
    }
  }

  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++;
      }
    }
    if (zeros === 0) {
      resultDisplay.innerHTML = "You LOSE";
      logSession("lose");
      document.removeEventListener("keyup", control);
      setTimeout(() => clear(), 3000);
    }
  }

  function clear() {
    clearInterval(myTimer);
  }

  function logSession(result) {
    let endTime = new Date();
    let totalTime = (endTime - startTime) / 1000;

    let session = {
      result: result,
      movesCount: moveLog.length,
      moves: moveLog.slice(),
      durationSeconds: totalTime,
      timestamp: startTime.toISOString(),
    };

    sessionsData.push(session);
    localStorage.setItem("gameSessions", JSON.stringify(sessionsData));

    console.log("📊 ملخص الجلسة:", session);

    if (session.movesCount < 40) {
      alert("💡 نصيحة: حاول التنويع بالحركات! لا تعتمد فقط على اليمين واليسار.");
    }
  }

  document.getElementById("download-data").addEventListener("click", () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sessionsData, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "game_sessions_data.json");
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  });

  document.getElementById("clear-data").addEventListener("click", () => {
    localStorage.removeItem("gameSessions");
    sessionsData = [];
    alert("تم مسح بيانات اللعب.");
  });

  function addColours() {
    for (let i = 0; i < squares.length; i++) {
      let val = squares[i].innerHTML;
      if (val == 0) {
        squares[i].style.backgroundColor = "#fce4ec";
        squares[i].style.color = "#000000";
      } else if (val == 2) {
        squares[i].style.backgroundColor = "#f8bbd0";
        squares[i].style.color = "#000000";
      } else if (val == 4) {
        squares[i].style.backgroundColor = "#f48fb1";
        squares[i].style.color = "#000000";
      } else if (val == 8) {
        squares[i].style.backgroundColor = "#f06292";
        squares[i].style.color = "#000000";
      } else if (val == 16) {
        squares[i].style.backgroundColor = "#ec407a";
        squares[i].style.color = "#ffffff";
      } else if (val == 32) {
        squares[i].style.backgroundColor = "#e91e63";
        squares[i].style.color = "#ffffff";
      } else if (val == 64) {
        squares[i].style.backgroundColor = "#d81b60";
        squares[i].style.color = "#ffffff";
      } else if (val == 128) {
        squares[i].style.backgroundColor = "#c2185b";
        squares[i].style.color = "#ffffff";
      } else if (val == 256) {
        squares[i].style.backgroundColor = "#ad1457";
        squares[i].style.color = "#ffffff";
      } else if (val == 512) {
        squares[i].style.backgroundColor = "#880e4f";
        squares[i].style.color = "#ffffff";
      } else if (val == 1024) {
        squares[i].style.backgroundColor = "#f48fb1";
        squares[i].style.color = "#ffffff";
      } else if (val == 2048) {
        squares[i].style.backgroundColor = "#fce4ec";
        squares[i].style.color = "#000000";
      } else {
        squares[i].style.backgroundColor = "#880e4f";
        squares[i].style.color = "#ffffff";
      }
    }
  }

  addColours();
  var myTimer = setInterval(addColours, 50);
});