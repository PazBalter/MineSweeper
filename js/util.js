
function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td style="text-align: center;" oncontextmenu="cellMarked('+gBoard[i][j].id+')" onclick="cellClicked('+gBoard[i][j].id+','+i+','+j+')"class="'
        + className + '" id="'+gBoard[i][j].id +'"></td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}
function buildBoard(){
    var board = [];
    for(var i = 0 ; i < gLevel.SIZE ; i++){
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    return board;
}

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
  
function unHide() {
    var elDecision = document.getElementById("gameDecision");
    
    elDecision.style.display = 'block'
    
}
function hide() {
    var elDecision = document.getElementById("gameDecision"); 
    elDecision.style.display = 'none'
}
  
