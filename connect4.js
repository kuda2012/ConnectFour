/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    const newRow = [];
    board[y] = newRow;
    for (let x = 0; x < WIDTH; x++) {
      newRow[x] = null;
    }
  }
  return board;
}
// TODO: set "board" to empty HEIGHT x WIDTH matrix array

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // TODO: add comment for this code
  //Creates the row that pieces are dropped in from.
  //and adds a a click event listener for when a piece is dropped in by a player.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // Sets an ID that stylizes the created table data spots, appends the td, to the top row
  //created above and then appends the top row to  the board.
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
  const colorByTurn = Array.from(
    document.getElementById("column-top").children
  );

  for (let i = 0; i < colorByTurn.length; i++) {
    colorByTurn[i].addEventListener("onmouseover", () => {
      currPlayer === 2
        ? (colorByTurn[i].style.backgroundColor = "red")
        : (colorByTurn[i].style.backgroundColor = "blue");
    });
  }

  // TODO: add comment for this code
  //Creates all of the spaces in on the board, populating columns in each row,
  //then moving to the next row to repeat the same process. When done, columnizing a
  // a given row, it appends the row to the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = 0; i < board.length; i++) {
    if (board[board.length - 1 - i][x] === null) {
      return board.length - 1 - i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell

  const divPiece = document.createElement("div");
  const givenCell = document.getElementById(`${y}-${x}`);
  givenCell.append(divPiece);
  if (currPlayer % 2 != 0) {
    divPiece.classList.toggle("player1Red");
  } else {
    divPiece.classList.toggle("player2Blue");
  }
  divPiece.classList.toggle("piece");
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(() => alert(msg), 250);
  const removeClick = document.getElementById("column-top");
  removeClick.removeEventListener("click", handleClick);
  const resetGame = document.createElement("button");
  resetGame.innerText = "Reset Game!";
  resetGame.addEventListener("click", () => {
    window.location.reload();
  });
  const connect4logo = document.getElementById("connect4");
  connect4logo.parentNode.insertBefore(resetGame, connect4logo.nextSibling);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  currPlayer % 2 != 0 ? (currPlayer = 1) : currPlayer;

  board[y][x] = currPlayer;

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  board.every((val, index) => {
    if (val[index] === null) {
      return;
    } else {
      endGame();
    }
  });

  currPlayer = currPlayer + 1;
  // switch players
  // TODO: switch currPlayer 1 <-> 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      //checks passed in y and x from the arrays located in the 4 different directions that one
      //could win in (horiz, vert,diagonal Right and Diagonal Left). Checks to see if values in the coordinate pair
      //could actually belong to the coordinate points in the board, and if the coordinate pair belongs to the current player.
      //Returns false if any of the conditions are not true.
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      var horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      var vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      var diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      var diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      //for each possible spot on the board, pass in this spot, and 3 other spots that are diagonal, horizontal, or vertical to the given spot
      //and see if there are 4 in a row of the same color in those give directions.

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
