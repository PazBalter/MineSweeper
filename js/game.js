var gBoard ;
var gLevel = { SIZE: 4, MINES: 2 };
var gGame ;
var gIdCell = 0

const MINE = '💣'
 






function createCell(board){
    var cell = {
        id : gIdCell++,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true
    }
    return cell;
}

function initGame(){

gBoard = buildBoard()
console.log(gBoard)
printMat(gBoard, '.board-container')
gBoard[0][0].isMine = true
gBoard[0][1].isMine = true

setMinesNegsCount(gBoard)
renderBoard()

}

function buildBoard(){
    var board = [];
    for(var i = 0 ; i < gLevel.SIZE ; i++){
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell(gBoard)
        }
    }
    return board;
}
function printMat(mat, selector) {
    var strHTML = '<table border="3"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td> <button onclick="cellClicked('+gBoard[i][j].id+','+i+','+j+')"class="' + className + '" id="'+gBoard[i][j].id +'"> ' +cell + '</td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';

    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
  
  function renderBoard() {
    for(var i = 0 ; i < gLevel.SIZE ; i++){
        for (var j = 0; j < gLevel.SIZE; j++) {
            if(gBoard[i][j].isMine === false){
                var elCell =  document.querySelector(`.cell${i}-${j}`)
               if(gBoard[i][j].minesAroundCount !== 0){
                elCell.innerHTML =' '
                // elCell.innerHTML = gBoard[i][j].minesAroundCount
               }else{
                 elCell.innerHTML =' '
               }
            }else{
                var elCell = document.querySelector(`.cell${i}-${j}`)
                 elCell.innerHTML = ' '
            }       
         }
    }
  }

  


function setMinesNegsCount(board){
    for(var i = 0 ; i < gLevel.SIZE ; i++){
        for (var j = 0; j < gLevel.SIZE; j++){
            var count = 0
            if(i !== 0 ){  //upper case
                if(j !== 0 ){
                    if(board[i-1][j-1].isMine === true){
                        count++
                    }
                }
                if(j !== gLevel.SIZE-1){
                    if(board[i-1][j+1].isMine === true){
                        count++
                    }
                }
                if(board[i-1][j].isMine === true){
                    count++
                }
            }
            if(i !== gLevel.SIZE-1 ){  //bottom case
                if(j !== 0 ){
                    if(board[i+1][j-1].isMine === true){
                        count++
                    }
                }
                if(j !== gLevel.SIZE-1){
                    if(board[i+1][j+1].isMine === true){
                        count++
                    }
                }
                if(board[i+1][j].isMine === true){
                    count++
                }
            }
            if(j!==0){            // left case
                if(board[i][j-1].isMine === true){
                    count++
                }
            }
            if(j !== gLevel.SIZE-1){   // right case
                if(board[i][j+1].isMine === true){
                    count++
                }
            }
        board[i][j].minesAroundCount = count; 
        }
    }
    return board;
}
function cellClicked(elCell, i, j){
    console.log(elCell)
    clickedCell = getCellById(elCell)
    console.log(clickedCell.innerHTML)
 
    if(clickedCell.isShown === false){
        if(clickedCell.isMine === false){
        clickedCell.isShown = true;
        renderCell(clickedCell.minesAroundCount,i,j)
        }else{
            renderCell(MINE,i,j)
        }

    }

}
function renderCell(value,i,j) {
    // Select the elCell and set the value
    var nothing = ' ';
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if(value>0){
        elCell.innerHTML = value;
    }else if (value === MINE){
        elCell.innerHTML = MINE;
    }else{
        elCell.innerHTML =' ';
    }
   
  }


function getCellById(id){
    for(var i = 0 ; i < gBoard.length ; i++){
        for(var j = 0 ; j < gBoard.length ; j++){
        if(gBoard[i][j].id === id) {
            return gBoard[i][j];
        }
        }   
    }

}





// cellMarked(elCell)
// checkGameOver()
// expandShown(board, elCell, i, j)


