
function printMat(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell' + i + '-' + j;
        strHTML += '<td> <button oncontextmenu="cellMarked(this,'+gBoard[i][j].id+')" onclick="cellClicked('+gBoard[i][j].id+','+i+','+j+')"class="'
        + className + '" id="'+gBoard[i][j].id +'"> ' +cell + '</td>'
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
            board[i][j] = createCell(gBoard)
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
  
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


