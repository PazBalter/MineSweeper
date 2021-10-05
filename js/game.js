

var gBoard ;
var gLevel = { SIZE: 4, MINES:2 };
var gGame ;
var gTimer =0
var gIdCell = 0 ;
var gStop = 0;
var gTime = 0; 
var gTimerInterval = 0;


const MINE = '💣'
const FLAG = '🚩'
 

function changeDifficulty(difficulty) {
  
    console.log(difficulty)
   
 
    if (difficulty === 1) {
        gLevel = { SIZE: 4, MINES:2 };
    } else if (difficulty === 2) {
        gLevel = { SIZE: 8, MINES:12 };
    } else if (difficulty === 3){
        gLevel = { SIZE: 12, MINES:30 };
    }
    initGame()
return;
}
function createCell(board){
    var cell = {
        id : gIdCell++,
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell;
}
function initGame(){
gTime=0;
document.getElementById("timer").innerText = gTime;


hide()
gBoard = buildBoard()

for(var i = 0 ; i < gLevel.MINES ; i++){
    var col = getRandomIntInt(0,gLevel.SIZE)
    var row = getRandomIntInt(0,gLevel.SIZE)
    if(gBoard[col][row].isMine !== true){
        gBoard[col][row].isMine = true
        gBoard[col][row].minesAroundCount = -1
    }
}
renderBoard()

}

function renderBoard(){
    printMat(gBoard, '.board-container')
    setMinesNegsCount(gBoard)
    for(var i = 0 ; i < gLevel.SIZE ; i++){
        for (var j = 0; j < gLevel.SIZE; j++) {
            var elCell =  document.querySelector(`.cell${i}-${j}`)
            elCell.innerText =' '  
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
function cellMarked(elCell,id){
        
    if(gTimer === 0){
        gTimer = 1
        startTimer() 
    }

    var markedCell = getCellObjectById(id)
    if(markedCell.isShown === false){
        if(markedCell.isMarked === false){
            markedCell.isMarked = true;
            elCell.innerText = FLAG;
        }else{
            markedCell.isMarked = false;
            elCell.innerText = ' ';
        }
    }

    checkGameOver()
    return;
}
function cellClicked(elCell, i, j){

    if(gTimer === 0){
        gTimer = 1
        startTimer()
        
    }

    clickedCell = getCellObjectById(elCell)

    if(clickedCell.isShown === false){
        if(clickedCell.isMine === false){
        var cellTurnGreen = document.querySelector(`.cell${i}-${j}`);
        cellTurnGreen.style.backgroundColor ='green'
        clickedCell.isShown = true;
        renderCell(clickedCell.minesAroundCount,i,j)
        }else{
            clickedCell.isShown = true
            var cellTurnRed = document.querySelector(`.cell${i}-${j}`);
            cellTurnRed.style.backgroundColor ='red'
            renderCell(MINE,i,j)
            GameOver()
        }

    }
checkGameOver()
}
function renderCell(value,i,j) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if(value>0){
        elCell.innerText = value;
    }else if (value === MINE){
        elCell.innerText= MINE;
    }else{
        elCell.innerText= ' ';
        // expandShown(gBoard, elCell, i, j) 
        openSquareAround(i,j)
        renderIsShown()
    }
   
}
function getCellObjectById(id){
    for(var i = 0 ; i < gBoard.length ; i++){
        for(var j = 0 ; j < gBoard.length ; j++){
        if(gBoard[i][j].id === id) {
            return gBoard[i][j];
        }
        }   
    }

}
function checkGameOver(){
    for(var i = 0 ; i < gBoard.length ; i++){
        for(var j = 0 ; j < gBoard.length ; j++){
            if(gBoard[i][j].isMine === true){
                if(gBoard[i][j].isShown === true){
                    GameOver()
                    return;
                }
            }else{
                if(gBoard[i][j].isShown === false){
                    return;
                }
            }
        }
    }
    youWin()
}
function GameOver(){
    gStop = 1
    stop()
    for(var i = 0 ; i < gBoard.length ; i++){
        for(var j = 0 ; j < gBoard.length ; j++){
            if(gBoard[i][j].isMine === true){
               gBoard[i][j].isShown = true;
               renderCell(MINE,i,j)
            }
        }
    }
    var elDecision = document.getElementById("gameDecision");
    elDecision.innerText = "GAME-OVER"
    unHide()
}
function youWin(){

    gStop = 1
    stop()
    
    var elDecision = document.getElementById("gameDecision")
    elDecision.innerText = "YOU-WIN"
    unHide()
    
}
function renderIsShown(){
    for(var i = 0 ; i< gLevel.SIZE ; i++){
        for(var j = 0 ; j< gLevel.SIZE ; j++){
            if(gBoard[i][j].isMine === true){
                continue;
            }else if(gBoard[i][j].isShown === true){
                if(gBoard[i][j].minesAroundCount > 0){
                    var elCell = document.querySelector(`.cell${i}-${j}`);
                    elCell.innerText = gBoard[i][j].minesAroundCount;
                    elCell.style.backgroundColor ='green'
                }else{
                    var elCell = document.querySelector(`.cell${i}-${j}`);
                    elCell.innerText = ' ';
                    elCell.style.backgroundColor ='green'
                }
            }
        }

    }
}
function startTimer()
{
if(stop() === false ){
        gTimerInterval = setInterval(function(){
        ++gTime;
        document.getElementById("timer").innerText = gTime;
    
    },1000) 
}
}
function stop(){
    // debugger;
    if(gStop === 0){
       return false 
    }else{
        clearInterval(gTimerInterval)
        gTimerInterval = 0
        return true;
    }
}
function openSquareAround(i,j){
    // debugger;
    console.log('i: '+i+' j: '+j)
    if(i-1 >= 0){
        if(gBoard[i-1][j].isShown === false && gBoard[i-1][j].isMine=== false){
            if(gBoard[i-1][j].minesAroundCount === 0){
            gBoard[i-1][j].isShown = true;
            openSquareAround(i-1,j)
            }else{  
            gBoard[i-1][j].isShown = true
            } 
        } 
    }   
    if(i-1 >= 0 && j-1 >= 0){
        if(gBoard[i-1][j-1].isShown === false && gBoard[i-1][j-1].isMine=== false){
            if(gBoard[i-1][j-1].minesAroundCount === 0){
                gBoard[i-1][j-1].isShown = true;
                openSquareAround(i-1,j-1)
            }else{  
                gBoard[i-1][j-1].isShown = true
            }
        }
    } 
    if(j-1 >= 0){
        if(gBoard[i][j-1].isShown === false && gBoard[i][j-1].isMine=== false){
            if(gBoard[i][j-1].minesAroundCount === 0){
                gBoard[i][j-1].isShown = true;
                openSquareAround(i,j-1)
            }else{  
                gBoard[i][j-1].isShown = true
            }
        }    
    }
    if(i+1 < gLevel.SIZE && j-1 >= 0){
        if(gBoard[i+1][j-1].isShown === false && gBoard[i+1][j-1].isMine=== false){
            if(gBoard[i+1][j-1].minesAroundCount === 0){
                gBoard[i+1][j-1].isShown = true;
                openSquareAround(i+1,j-1)
            }else{  
                gBoard[i+1][j-1].isShown = true
            }
        }
    }
    if(i+1 < gLevel.SIZE){
        if(gBoard[i+1][j].isShown === false && gBoard[i+1][j].isMine=== false){
            if(gBoard[i+1][j].minesAroundCount === 0){
            gBoard[i+1][j].isShown = true;
            openSquareAround(i+1,j)
            }else{  
            gBoard[i+1][j].isShown = true
            } 
        }    
    }
    if(i+1 < gLevel.SIZE && j+1 < gLevel.SIZE){
        if(gBoard[i+1][j+1].isShown === false && gBoard[i+1][j+1].isMine=== false){
            if(gBoard[i+1][j+1].minesAroundCount === 0){
                gBoard[i+1][j+1].isShown = true;
                openSquareAround(i+1,j+1)
            }else{  
                gBoard[i+1][j+1].isShown = true
            }
        }
    }
    if(j+1 < gLevel.SIZE){
        if(gBoard[i][j+1].isShown === false && gBoard[i][j+1].isMine=== false){
            if(gBoard[i][j+1].minesAroundCount === 0){
                gBoard[i][j+1].isShown = true;
                openSquareAround(i,j+1)
            }else{  
                gBoard[i][j+1].isShown = true
            }
        }
    }
    if(i-1 >= 0 && j+1 < gLevel.SIZE){
        if(gBoard[i-1][j+1].isShown === false && gBoard[i-1][j+1].isMine=== false){
            if(gBoard[i-1][j+1].minesAroundCount === 0){
                gBoard[i-1][j+1].isShown = true;
                openSquareAround(i-1,j+1)
            }else{  
                gBoard[i-1][j+1].isShown = true
            }
        }
    }

    return;
}
function expandShown(board, elCell, i, j){
    if(i-1 >= 0 ){                 //upper case
        if(j -1 >= 0 ){
            paintsquare(i-1,j-1)
        }
        if(j + 1 < gLevel.SIZE){
            paintsquare(i-1,j+1)
        }
        paintsquare(i-1,j)
    }
    if(i+1 < gLevel.SIZE ){          //bottom case
        if(j-1 >= 0 ){
            paintsquare(i+1,j-1)
        }
        if(j +1 < gLevel.SIZE){
            paintsquare(i+1,j+1)
        }
        paintsquare(i+1,j)

    }
    if(j-1 >= 0){   
        paintsquare(i,j-1)         // left case
    }
    if(j < gLevel.SIZE){         // right case
        paintsquare(i,j+1)
    }
}
function paintsquare(i,j){
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.style.backgroundColor = 'green'
    if(gBoard[i][j].minesAroundCount !== 0){
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
}
