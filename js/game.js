
var gBoard ;
var gLevel = { SIZE: 4, MINES:2 };
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gTimer = false
var gIdCell = 100 ;
var gStop = false;
var gTime = 0; 
var gTimerInterval = 0;
var gLives = 3 ;
var gStrLives = '❤️❤️❤️'
var gFromMineToSquare = 0; 
var gMineIn = false;
var gElRestartBtn = document.getElementById("restartBtn")

const MINE = '<img src="img/mine.jpg">'
const FLAG = '🚩'

document.addEventListener("contextmenu", (event)=> {
    event.preventDefault();
});

function changeDifficulty(difficulty) {
    if (difficulty === 1) {
        var elDiv = document.getElementById("theGame")
        elDiv.style.width = '350px'
        gLevel = { SIZE: 4, MINES:2 };
    } else if (difficulty === 2) {
        var elDiv = document.getElementById("theGame")
        elDiv.style.width = '450px'
        gLevel = { SIZE: 8, MINES:12 };
    } else if (difficulty === 3){
        var elDiv = document.getElementById("theGame")
        elDiv.style.width = '650px'
        gLevel = { SIZE: 12, MINES:30 };
    }
    gStop = true
    stop()
    initGame()
    return;
}
function createCell(){

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

    gStop = true;
    stop()
    gElRestartBtn.innerText = '😄'
    gMineIn = false;
    gStop = false;
    gTime=0;
    gTimer = false;
    gLives = 3;
    gStrLives = '❤️❤️❤️'
    document.getElementById("timer").innerText = gTime;
    document.getElementById("livesScore").innerText =`LIVES LEFT:${gStrLives}`;
    hide()
    gBoard = buildBoard()
    renderBoard()
}
function addMines(){
    var minecount = 0
    while(minecount <gLevel.MINES){
        var col = getRandomIntInt(0,gLevel.SIZE)
        var row = getRandomIntInt(0,gLevel.SIZE)
        if(gBoard[col][row].isMine !== true){
            if(gBoard[col][row].isShown !== true){
                gBoard[col][row].isMine = true
                gBoard[col][row].minesAroundCount = -1
                minecount++
            }
        }
    }
    return;
}
function renderBoard(){
    printMat(gBoard, '.board-container')
    setMinesNegsCount(gBoard)
    for(var i = 0 ; i < gLevel.SIZE ; i++){
        for (var j = 0; j < gLevel.SIZE; j++) {
            var elCell = document.querySelector(`.cell${i}-${j}`)
            // console.log(elCell)
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
function cellMarked(id){
        
    if(gTimer === false){
        gTimer = true
        startTimer() 
    }
    if(gMineIn === false){
        addMines()
        renderBoard()
        gMineIn = true
    }
    var elCell = document.getElementById(id)
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
function cellClicked(id, i, j){

    if(gTimer === false){
        gTimer = true
        startTimer()
    }
    
    clickedCell = getCellObjectById(id)

    if(clickedCell.isShown === false){
        if(clickedCell.isMine === false){
            if(clickedCell.isMarked === false){
                var cellTurnGray = document.querySelector(`.cell${i}-${j}`);
                cellTurnGray.style.backgroundColor ='gray'
                clickedCell.isShown = true;
                putCellValue(clickedCell.minesAroundCount,i,j)
            }
        }else{
            clickedCell.isShown = true
            var cellTurnRed = document.querySelector(`.cell${i}-${j}`);
            cellTurnRed.style.backgroundColor ='red'
            putCellValue(MINE,i,j)

            if(livesScoreCount() === 0){
                GameOver()
            }else{
               
                gFromMineToSquare = setTimeout(function twoSeconds(){
                    putCellValue(' ',i,j)
                    cellTurnRed.style.backgroundColor ='whitesmoke'
                    gFromMineToSquare = 0;
                },1300)
                clickedCell.isShown = false
            }
        }
    } 
checkGameOver()
}
function putCellValue(value,i,j){
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${i}-${j}`);
    if(value>0){
        elCell.innerText = value;
    }else if (value === MINE){
        elCell.innerHTML= MINE;
    }else{
        elCell.innerText= ' ';
        if(gBoard[i][j].isMine !== true){
        if(gMineIn ===false){
            addMines()
            renderBoard()
            if(elCell.innerText === ' '){
                if(isThereNoMinesOrFlag(i,j) === true){
                    openSquareAround(i,j)
                    // expandShown(gBoard, elCell, i, j) 
                }else{
                    paintsquare(i,j)
                }  
            }
        }
    if(gMineIn === true){
        openSquareAround(i,j)
    }
    gMineIn = true;
    }
    paintIsShown()
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
                if(gBoard[i][j].isShown === true && gLives <=0){
                    GameOver()
                    return;
                }else{
                    var elCell = document.querySelector(`.cell${i}-${j}`);
                    if( elCell.innerText !== FLAG){
                        return;
                    }
                }
            }else{
                if(gBoard[i][j].isShown !== true)  {
                    return;
                } 
            }   
        }
    }
    youWin()
}
function GameOver(){
    gStop = true
    stop()
    for(var i = 0 ; i < gBoard.length ; i++){
        for(var j = 0 ; j < gBoard.length ; j++){
            if(gBoard[i][j].isMine === true){
               gBoard[i][j].isShown = true;
               putCellValue(MINE,i,j)
            }
        }
    }
    var elDecision = document.getElementById("gameDecision");
    elDecision.innerText = "GAME-OVER"
    unHide()
    gElRestartBtn.innerText = '😲'
}
function youWin(){

    gStop = true;
    stop()
    var elDecision = document.getElementById("gameDecision")
    elDecision.innerText = "YOU-WIN"
    unHide()
    gElRestartBtn.innerText = '😎'
}
function paintIsShown(){
    for(var i = 0 ; i< gLevel.SIZE ; i++){
        for(var j = 0 ; j< gLevel.SIZE ; j++){
            if(gBoard[i][j].isMine === true){
                continue;
            }else if(gBoard[i][j].isShown === true){
                paintsquare(i,j)
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
    },1000)}
}
function stop(){
    if(gStop === false){
       return false;
    }else{
        clearInterval(gTimerInterval)
        gTimerInterval = 0
        return true;
    }
}
function openSquareAround(i,j){
    if(i-1 >= 0){
        if(gBoard[i-1][j].isShown === false 
            && gBoard[i-1][j].isMine=== false 
            && gBoard[i-1][j].isMarked=== false){

            if(gBoard[i-1][j].minesAroundCount === 0){
            gBoard[i-1][j].isShown = true;
            openSquareAround(i-1,j)
            }else{  
            gBoard[i-1][j].isShown = true
            } 
        } 
    }   
    if(i-1 >= 0 && j-1 >= 0){
        if(gBoard[i-1][j-1].isShown === false 
            && gBoard[i-1][j-1].isMine=== false 
            && gBoard[i-1][j-1].isMarked=== false){

            if(gBoard[i-1][j-1].minesAroundCount === 0){
                gBoard[i-1][j-1].isShown = true;
                openSquareAround(i-1,j-1)
            }else{  
                gBoard[i-1][j-1].isShown = true
            }
        }
    } 
    if(j-1 >= 0){
        if(gBoard[i][j-1].isShown === false 
            && gBoard[i][j-1].isMine=== false
             && gBoard[i][j-1].isMarked=== false){

            if(gBoard[i][j-1].minesAroundCount === 0){
                gBoard[i][j-1].isShown = true;
                openSquareAround(i,j-1)
            }else{  
                gBoard[i][j-1].isShown = true
            }
        }    
    }
    if(i+1 < gLevel.SIZE && j-1 >= 0){
        if(gBoard[i+1][j-1].isShown === false
             && gBoard[i+1][j-1].isMine=== false 
             && gBoard[i+1][j-1].isMarked=== false){

            if(gBoard[i+1][j-1].minesAroundCount === 0){
                gBoard[i+1][j-1].isShown = true;
                openSquareAround(i+1,j-1)
            }else{  
                gBoard[i+1][j-1].isShown = true
            }
        }
    }
    if(i+1 < gLevel.SIZE){
        if(gBoard[i+1][j].isShown === false
             && gBoard[i+1][j].isMine=== false 
             && gBoard[i+1][j].isMarked=== false){

            if(gBoard[i+1][j].minesAroundCount === 0){
            gBoard[i+1][j].isShown = true;
            openSquareAround(i+1,j)
            }else{  
            gBoard[i+1][j].isShown = true
            } 
        }    
    }
    if(i+1 < gLevel.SIZE && j+1 < gLevel.SIZE){
        if(gBoard[i+1][j+1].isShown === false 
            && gBoard[i+1][j+1].isMine=== false 
            && gBoard[i+1][j+1].isMarked=== false){

            if(gBoard[i+1][j+1].minesAroundCount === 0){
                gBoard[i+1][j+1].isShown = true;
                openSquareAround(i+1,j+1)
            }else{  
                gBoard[i+1][j+1].isShown = true
            }
        }
    }
    if(j+1 < gLevel.SIZE){
        if(gBoard[i][j+1].isShown === false 
            && gBoard[i][j+1].isMine=== false 
            && gBoard[i][j+1].isMarked=== false){

            if(gBoard[i][j+1].minesAroundCount === 0){
                gBoard[i][j+1].isShown = true;
                openSquareAround(i,j+1)
            }else{  
                gBoard[i][j+1].isShown = true
            }
        }
    }
    if(i-1 >= 0 && j+1 < gLevel.SIZE){
        if(gBoard[i-1][j+1].isShown === false 
            && gBoard[i-1][j+1].isMine=== false 
            && gBoard[i-1][j+1].isMarked=== false){

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
function expandShown(board, i, j){
    if(i-1 >= 0 ){                             //upper case
        if(j -1 >= 0 ){
            if(board[i-1][j-1].isMine === false){
                paintsquare(i-1,j-1)  
            } 
        }
        if(j + 1 < gLevel.SIZE){
            if(board[i-1][j+1].isMine === false){
            paintsquare(i-1,j+1)
            }
        }
        if(board[i-1][j].isMine === false){
        paintsquare(i-1,j)
        }
    }
    if(i+1 < gLevel.SIZE ){                     //bottom case
        if(j-1 >= 0 ){
            if(board[i+1][j-1].isMine === false){
            paintsquare(i+1,j-1)
            }
        }
        if(j +1 < gLevel.SIZE){
            if(board[i+1][j+1].isMine === false){
            paintsquare(i+1,j+1)
            }
        }
        if(board[i+1][j].isMine === false){
        paintsquare(i+1,j)
        }

    }
    if(j-1 >= 0){ 
        if(board[i][j-1].isMine === false){  // left case
        paintsquare(i,j-1) 
        }        
    }
    if(j < gLevel.SIZE){                       // right case
        if(board[i][j+1].isMine === false){
        paintsquare(i,j+1)
        }
    }
}
function paintsquare(i,j){
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.style.backgroundColor = 'gray'
    if(gBoard[i][j].minesAroundCount !== 0){
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
}
function livesScoreCount(){
    gLives--
    gStrLives = '' 
    for(var x = 0 ; x < gLives ;x++){
        gStrLives +=  '❤️'
    }
    document.getElementById("livesScore").innerText =`LIVES LEFT:${gStrLives}`;
   
    return gLives; 
}
function isThereNoMinesOrFlag(i,j){
    if(i-1 >= 0 ){                             //upper case
        if(j -1 >= 0 ){
            if(gBoard[i-1][j-1].isMine === true 
                || gBoard[i-1][j-1].isMarked === true){
                return false;  
            }
        }
        if(j + 1 < gLevel.SIZE){
            if(gBoard[i-1][j+1].isMine === true 
                || gBoard[i-1][j+1].isMarked === true){
                return false;
            }
        }
        if(gBoard[i-1][j].isMine === true 
            || gBoard[i-1][j].isMarked === true){
            return false;
        }
    }
    if(i+1 < gLevel.SIZE ){                     //bottom case
        if(j-1 >= 0 ){
            if(gBoard[i+1][j-1].isMine === true 
                || gBoard[i+1][j-1].isMarked === true){
                return false;
            }
        }
        if(j +1 < gLevel.SIZE){
            if(gBoard[i+1][j+1].isMine === true 
                || gBoard[i+1][j+1].isMarked === true){
                return false;
            }
        }
        if(gBoard[i+1][j].isMine === true 
            || gBoard[i+1][j].isMarked === true){
            return false;
        }

    }
    if(j-1 >= 0){ 
        if(gBoard[i][j-1].isMine === true 
            || gBoard[i][j-1].isMarked === true){  // left case
            return false; 
        }        
    }
    if(j+1 < gLevel.SIZE){                       // right case
        if(gBoard[i][j+1].isMine === true 
            || gBoard[i][j+1].isMarked === true){
            return false;
        }
    }
    return true;
}


