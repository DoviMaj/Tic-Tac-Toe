const GameBoard = (() => {
  let gameboard = ['', '', '', '', '', '', '', '', '']
  let ul = document.querySelector('ul')

  const render = () => {
    gameboard.forEach((i, index) => {
      let li = document.createElement('li')
      li.innerHTML = i
      li.id = `item${index}`
      li.className = index
      ul.appendChild(li)
    })

    let restartGame = document.getElementById('restart-game')
    restartGame.addEventListener('click', function() {
      window.location.reload()
      return false
    })
  }

  const gameOptions = () => {
    playerGame()
    computerGame()
  }

  computerGame = () => {
    let vsComputer = document.getElementById('vs-computer')
    vsComputer.addEventListener('click', () => {
      gameEventListeners(game.pcGameFlow)
      game.pcGameFlow()
    })
  }

  playerGame = () => {
    let vsPlayer = document.getElementById('vs-player')
    vsPlayer.addEventListener('click', () => {
      gameEventListeners(game.gameFlow)
    })
  }

  startPlayerGame = () => {
    gameEventListeners(game.gameFlow)
  }

  gameEventListeners = (choice) => {
    game.newRound()
      ul.childNodes.forEach( i => {
        i.addEventListener('click', choice)
      })
  }

  resetGameboard = () => {
    const reset = ['', '', '', '', '', '', '', '', '']
    gameboard = reset;
  }

  setGameBoard = (i) => {
    if(i.className === undefined){
      gameboard[i] = PlayerData.currentPlayer.marker
      return
    }
    gameboard[i.className] = PlayerData.currentPlayer.marker
  }
  
  getGameBoard = () => {
    return gameboard
  }

  return {
    startPlayerGame,
    render,
    gameOptions,
    getGameBoard,
    resetGameboard,
    setGameBoard
  }
})()

const PlayerData = (() => {
  const Player = (name, marker = 'x', points = 0) => ({
    name,
    points,
    marker
  })

  const player1 = Player('', 'x')
  const player2 = Player('', 'o')
  let current = false;
  let currentPlayer = ''
  return {
    player1, 
    player2, 
    current, 
    currentPlayer
  }
})()


const game = (() => {
  gameFlow = (evt) => {
    removePcAsPlayer()
    removeClickEvent(evt, 'player-player')
    definePlayersNames()
    displayCurrentPlayer()
    handlePlayerChoice(evt.target)
    checkForWinnerAndTie()
    changeCurrentPlayer()
  }

  pcGameFlow = (evt) => {
    defineComputerAsPlayer()
    definePlayersNames()
    let noUserChoice = evt === undefined;
    if(!noUserChoice && !pcStarting){
      handlePlayerChoice(evt.target)
      removeClickEvent(evt, 'player-pc')
      if(!checkForWinnerAndTie()){
        changeCurrentPlayer()
        definePlayersNames()
        displayCurrentPlayer()
        handleComputerChoice()
        checkForWinnerAndTie()
        removeClickEvent('pc')  
      }
    }
    else if(pcStarting){
      if(noUserChoice){
        handleComputerChoice()
        checkForWinnerAndTie()
        removeClickEvent('pc')
      }
      else{
        if(!checkForWinnerAndTie()){
          definePlayersNames()
          displayCurrentPlayer()
          handlePlayerChoice(evt.target)
          removeClickEvent(evt, 'player-pc') 
          checkForWinnerAndTie()
          changeCurrentPlayer()
          definePlayersNames()
          displayCurrentPlayer()  
          handleComputerChoice()
          checkForWinnerAndTie()
          removeClickEvent('pc') 
        }
      }
    }
    changeCurrentPlayer()
  }

  
  let pcStarting = true
  const togglePcStarting = () => {
    pcStarting = !pcStarting
  }

  const checkForWinnerAndTie = () => {
    if(checkForWinner()){
      addPoints()
      endRound()
      congratulateWinner('winner')
      togglePcStarting()
      return true
    }
    else if(checkForTie()){
      congratulateWinner('tie')
      togglePcStarting()
      return true
    }
  }

  defineComputerAsPlayer = () => {
    PlayerData.player2.name = 'computer'
  }

  removePcAsPlayer = () => {
    PlayerData.player2.name = 'player2'
  }

  handleComputerChoice = () => {
    let g = GameBoard.getGameBoard()
    let i = ''
    const generateRandomNum = () => {
      i =  Math.floor(Math.random() * (9 - 0) ) + 0; 
    }
    while(g[i] != ''){
      if(g[4] === ''){
        if((g[0] != '') || ( g[2] != '') || ( g[6] != '') || ( g[8] != '')){
          i = 4
        }
        else{
          i = 0
        }
      }
      else{
        generateRandomNum()
      }
    }
  
    const doIt = () =>{
      let ul = document.querySelector('ul')
      ul.childNodes.forEach( v => {
        if(v.className === i.toString()){
          v.innerHTML = PlayerData.currentPlayer.marker
          GameBoard.setGameBoard(i)
          removeClickEvent(v, 'pc')
          return
        }
      })        
    }
    doIt()
  }
    
  const definePlayersNames = () => {
    if(PlayerData.player1.name != '' && PlayerData.player2.name != ''){
      defineCurrentPlayer()
      return
    }
    if(PlayerData.player2.name === 'computer'){
      PlayerData.player1.name = 'player'
      defineCurrentPlayer();
      return
    }
    if(PlayerData.player2.name === 'player2'){
      PlayerData.player1.name = 'player1'
      defineCurrentPlayer();
      return
    }
  }

  const defineCurrentPlayer = () => {
    if(PlayerData.current === false){
      PlayerData.currentPlayer = PlayerData.player1
    } else {
      PlayerData.currentPlayer = PlayerData.player2
    }
  }

  const handlePlayerChoice = (i) => {
    if(i.innerHTML === ''){
      i.innerHTML = PlayerData.currentPlayer.marker
      GameBoard.setGameBoard(i)
    }
  }

  const changeCurrentPlayer = () => {
    PlayerData.current = !PlayerData.current
  }

  const checkForWinner = () => {
    const g = GameBoard.getGameBoard()
    const JS = JSON.stringify;
    const xCheck = JS(['x','x','x']);
    const oCheck = JS(['o','o','o'])

    const combinations = [
      [g[0], g[1], g[2]], 
      [g[0], g[4], g[8]], 
      [g[0], g[3], g[6]],
      [g[1], g[4], g[7]], 
      [g[3], g[4], g[5]], 
      [g[2], g[4], g[6]], 
      [g[2], g[5], g[8]],
      [g[6], g[7], g[8]]
    ]

    let isIt = false
    combinations.forEach( i => {
      if(JS(i) === xCheck || JS(i) === oCheck){
        isIt = true
        return
      }
    })  

    if(isIt){
      return true
    }
  }

  checkForTie = () => {
    let g = GameBoard.getGameBoard()
    let arr = []
    g.forEach( i => {
      if(i != ''){
        arr.push(i)
      }
    })
    if(arr.length === 9){
      return true
    }
  }

  congratulateWinner = (v) => {
    let congrat = document.getElementById('current-player')
      if(v === 'winner'){
        congrat.innerHTML = `${PlayerData.currentPlayer.marker.toUpperCase()} is the winner!!`
      }
      else{
        congrat.innerHTML = `Its a tie!!`
      }
  }

  addPoints = () => {
    PlayerData.currentPlayer.points ++
  }

  let ul = document.querySelector('ul')

  const newRound = () => {
    GameBoard.resetGameboard()
    ul.innerHTML = ''
    GameBoard.render()
  }

  const endRound = () =>{
    GameBoard.resetGameboard()
    ul.childNodes.forEach(i => {
      i.removeEventListener('click', game.gameFlow)
      i.removeEventListener('click', game.pcGameFlow)
    })
  }

  const displayCurrentPlayer = () => {
    const oppositeOfCurrent = () => {
        if(PlayerData.current === true){
          return PlayerData.player1.marker.toUpperCase()
        } else {
          return PlayerData.player2.marker.toUpperCase()
        }
    }
    let span = document.getElementById('current-player')
    span.innerHTML = `${oppositeOfCurrent()}'s chance`;
  }

  const removeClickEvent = (evt, origin) => {
    if(origin === 'pc'){
      evt.removeEventListener('click', game.pcGameFlow)
    }
    if(origin === 'player-pc'){
      evt.target.removeEventListener('click', game.pcGameFlow) 
    }
    if(origin === 'player-player'){
      evt.target.removeEventListener('click', game.gameFlow)
    }
  }

  return {gameFlow, pcGameFlow, newRound}
})()

GameBoard.render()
GameBoard.gameOptions()
GameBoard.startPlayerGame()