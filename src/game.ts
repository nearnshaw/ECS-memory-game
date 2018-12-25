

export enum Panel {
  GREEN = "green",
  RED = "red",
  YELLOW = "yellow",
  BLUE = "blue"
}

export enum State {
  PLAYING = "playing",
  LISTENING = "listening",
  IDLE = "idle"
}


@Component('gameState')
export class GameState {
  state: State = State.IDLE
  difficulty: number = 0
  sequence: Panel[] = []
  playingIndex: number = 0
  displayTime: number = 1
  guessSequence: Panel[] = []
  activePanel: Panel | null = null
  lockedInput: boolean = true
  reset(){
    this.difficulty = 0
    this.sequence = []
    this.guessSequence = []
    this.activePanel = null
    this.lockedInput = true
    this.playingIndex = 0
    this.displayTime = 1
  }
  resetPlaying(){
    this.playingIndex = 0
    this.displayTime = 1
  }
  resetGuessing(){
    this.guessSequence = []
    this.activePanel = null
  }
}

export class playSequence implements ISystem {
  update(dt: number) {
    if (gameState.state == State.PLAYING){
      gameState.displayTime -= dt
      if ( gameState.displayTime<0){
        let color = gameState.sequence[gameState.playingIndex]
        activatePanel(color)
        gameState.displayTime = 1
        gameState.playingIndex += 1
        if(gameState.playingIndex == gameState.sequence.length){
          gameState.state = State.LISTENING
        }
      }
    }  
  }
}

engine.addSystem(new playSequence())



// Materials

let greenOn = new Material()
greenOn.albedoColor = Color3.FromHexString("#00ff00")

let greenOff = new Material()
greenOff.albedoColor = Color3.FromHexString("#008800")

let redOn = new Material()
redOn.albedoColor = Color3.FromHexString("#ff0000")

let redOff = new Material()
redOff.albedoColor = Color3.FromHexString("#880000")

let yellowOn = new Material()
yellowOn.albedoColor = Color3.FromHexString("#ffff00")

let yellowOff = new Material()
yellowOff.albedoColor = Color3.FromHexString("#888800")

let blueOn = new Material()
blueOn.albedoColor = Color3.FromHexString("#0000ff")

let blueOff = new Material()
blueOff.albedoColor = Color3.FromHexString("#000088")

// Game tuple

let game = new Entity()
let gameState = new GameState()
game.add(gameState)

// Scenery objects

let panels = new Entity()
panels.add(new GLTFShape("models/Simon.gltf"))
panels.add(new Transform({
  position: new Vector3(5, 1.5, 5),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(0.5, 0.5, 0.5)
})) 
engine.addEntity(panels)

let green = new Entity()
green.add(new PlaneShape())
green.add(new Transform({
  position: new Vector3(1, 0, -1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
green.setParent(panels)
green.set(greenOff)
green.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.GREEN)
  }
}))
engine.addEntity(green)

let red = new Entity()
red.add(new PlaneShape())
red.add(new Transform({
  position: new Vector3(1, 0, 1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
red.setParent(panels)
red.set(redOff)
red.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.RED)
  }
}))
engine.addEntity(red)

let yellow = new Entity()
yellow.add(new PlaneShape())
yellow.add(new Transform({
  position: new Vector3(-1, 0, -1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
yellow.setParent(panels)
yellow.set(yellowOff)
yellow.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.YELLOW)
  }
}))
engine.addEntity(yellow)

let blue = new Entity()
blue.add(new PlaneShape())
blue.add(new Transform({
  position: new Vector3(-1, 0, 1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
blue.setParent(panels)
blue.set(blueOff)
blue.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.BLUE)
  }
}))
engine.addEntity(blue)

let button = new Entity()
button.add(new Transform({
  position: new Vector3(5, 1.5, 5),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(0.5, 0.5, 0.5)
}))
button.add(new GLTFShape("models/Simon_Button.gltf"))
button.add(new OnClick(e => {
  newGame(0)
  log("new game")
}))
engine.addEntity(button)

let scenery = new Entity()
scenery.add(new Transform({
  position : new Vector3(5, 0.05, 5)
  // scale 0.99 ?
}))
scenery.add(new GLTFShape("models/Simon_scene.gltf"))
engine.addEntity(scenery)



// // Helper functions

function activatePanel(color: Panel){
 
  color === Panel.BLUE ? blue.set(blueOn) :  blue.set(blueOff)
  color === Panel.RED ? red.set(redOn) :  red.set(redOff)
  color === Panel.GREEN ? green.set(greenOn) :  green.set(greenOff)
  color === Panel.YELLOW ? yellow.set(yellowOn) :  yellow.set(yellowOff)
  gameState.activePanel = color

  if (gameState.state == State.LISTENING){
    checkGuess(color)
    log("clicked " , color)
  }
 

}


function newGame(difficulty: number) {
    if (difficulty == 0){
      gameState.reset()
    }
    const sequence = randomSequence(difficulty+1);
    gameState.resetPlaying()
    gameState.sequence = sequence
    gameState.state = State.PLAYING
    log("stated playing", gameState.sequence)
  }


function  randomSequence(difficulty: number): Panel[] {
    const pool = Object.keys(Panel)
    let arr: Panel[] = []

    for (let i = 0; i < difficulty; i++) {
      const index = Math.floor(Math.random() * pool.length)
      const key = pool[index] as keyof typeof Panel
      const panel = Panel[key] as Panel
      arr.push(panel)
    }

    return arr
  }

function checkGuess(color: Panel) {

    gameState.guessSequence.push(color)
    log(gameState.guessSequence)

    if (gameState.sequence[gameState.guessSequence.length] !== color) {
      // loser
      log("You lose!")
      gameState.reset()
      gameState.state = State.IDLE
      return
    }

  

    if (gameState.guessSequence.length === gameState.sequence.length) {
      // Winner winner chicken dinner
      log("You win! Keep going!");
      newGame(gameState.difficulty + 1);
      return
    }
  }