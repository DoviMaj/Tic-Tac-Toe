const GameBoard = (() => {
  const gameboard = ['', '', '', '', '', '', '', '', '']
  const render = () => {
    // DOM rendering
    let ul = document.querySelector('ul')
    gameboard.forEach((i, index) => {
     // debugger
      let li = document.createElement('li')
      li.innerHTML = i;
      li.id = index
      ul.appendChild(li)
    })
    ul.childNodes.forEach(i => {
      i.addEventListener('click', () =>{
        game.gameFlow(i)
      })
    })
  }
  const playerData = {
    Player: (name, marker = 'x', points = 0) => ({
      // create player obj
      name,
      points,
      marker
    }),
    player1 : this.Player('player1', 'x'),
    player2 : this.Player('player1', 'o'),
    current : false,
    currentPlayer : ''
  }
  
  const game = {
    // Game flow logic
    gameFlow(i){
      this.defineCurrentPlayer()
      this.handlePlayerChoice(i)
      this.togglePlayer()
      this.checkForWinner()
    },
    //  define current player
    defineCurrentPlayer(){
      if(current === false){
        currentPlayer = playerData.player1
      } else {
        currentPlayer = playerData.player2
      }
    },
    //  handle choice
    handlePlayerChoice(){
      if(i.innerHTML === ''){
        i.innerHTML = currentPlayer.marker
        gameboard[i.id] = currentPlayer.marker
      }
    },
    // change player
    togglePlayer(){
      playerData.current = !playerData.current
    },
    checkForWinner(){
      
    }
  }
  return {render}
})()

GameBoard.render()

// single task per function
//player factory constructor
//gameflow object
// render dom function based on gameboard array
// allow user to mark specific index
// 
