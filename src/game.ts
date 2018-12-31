
let TIME_ON = 0.3

export enum Panel {
  GREEN,
  RED,
  YELLOW,
  BLUE
}


export enum State {
  PLAYING,
  LISTENING,
  IDLE
}


@Component('gameState')
export class GameState {
  state: State = State.IDLE
  difficulty: number = 0
  sequence: Panel[] = []
  playingIndex: number = 0
  gapTime: number = 0.5
  guessSequence: Panel[] = []
  lockedInput: boolean = true
  reset(){
    this.difficulty = 0
    this.sequence = []
    this.guessSequence = []
    this.lockedInput = true
    this.playingIndex = -1
    this.gapTime =  0.5
  }
  resetPlaying(){
    this.playingIndex = -1
    this.gapTime =  0.5
    this.sequence = []
    this.guessSequence = []
  }
}

@Component('panelState')
export class PanelState {
  onColor: Material
  offColor: Material
  color: Panel
  active: boolean = false
  timeLeft: number = TIME_ON
  constructor(on: Material, off: Material, panel: Panel){
    this.onColor = on
    this.offColor = off
    this.color = panel 
  }
  activate(){
    this.active = true
    this.timeLeft = TIME_ON
  }
}

const panels = engine.getComponentGroup(PanelState)

@Component('buttonData')
export class ButtonData {
  yUp: number = 0
  yDown: number = 0
  pressed: boolean
  fraction: number
  timeDown: number
  constructor(yUp: number, yDown: number){
    this.yUp = yUp
    this.yDown = yDown
    this.pressed = false
    this.fraction = 0
    this.timeDown = 2
  }
}

export class playSequence implements ISystem {
  update(dt: number) {
    if (gameState.state == State.PLAYING){
      gameState.gapTime -= dt
      if ( gameState.gapTime<0){
        let color = gameState.sequence[gameState.playingIndex]
        activatePanel(color)
        gameState.gapTime =  0.5
        gameState.playingIndex += 1
        if(gameState.playingIndex == gameState.sequence.length){
          gameState.state = State.LISTENING
        }
      }
    }  
  }
}

engine.addSystem(new playSequence())

export class activatePanels implements ISystem {
  update(dt: number) {
    for( let panel of panels.entities){
      let p = panel.get(PanelState)
      if (p.active){
        panel.remove(Material)
        panel.set(p.onColor)
        p.timeLeft -= dt
        if (p.timeLeft < 0){
          p.active = false
        }
      }
      else {
          panel.remove(Material)
        panel.set(p.offColor)
      }
    }
  }
}

engine.addSystem(new activatePanels())
   

export class PushButton implements ISystem {
  update(dt: number) {

    let transform = button.get(Transform)
    let state = button.get(ButtonData)
    if (state.pressed == true){
      if (state.fraction < 1){
        transform.position.y = Scalar.Lerp(state.yUp, state.yDown, state.fraction)
        state.fraction += 1/8
      }
      state.timeDown -= dt
      if (state.timeDown < 0){
        state.pressed = false
        state.timeDown = 2
      }
    }
    else if (state.pressed == false && state.fraction > 0){
      transform.position.y = Scalar.Lerp(state.yUp, state.yDown, state.fraction)
      state.fraction -= 1/8
    }
  }
  
}

engine.addSystem(new PushButton())


// Materials

let greenOn = new Material()
greenOn.albedoColor = Color3.FromHexString("#00ff00")
greenOn.emissiveColor = Color3.FromHexString("#00ff00")

let greenOff = new Material()
greenOff.albedoColor = Color3.FromHexString("#008800")

let redOn = new Material()
redOn.albedoColor = Color3.FromHexString("#ff0000")
redOn.emissiveColor = Color3.FromHexString("#ff0000")

let redOff = new Material()
redOff.albedoColor = Color3.FromHexString("#880000")

let yellowOn = new Material()
yellowOn.albedoColor = Color3.FromHexString("#ffff00")
yellowOn.emissiveColor = Color3.FromHexString("#ffff00")

let yellowOff = new Material()
yellowOff.albedoColor = Color3.FromHexString("#888800")

let blueOn = new Material()
blueOn.albedoColor = Color3.FromHexString("#0000ff")
blueOn.emissiveColor = Color3.FromHexString("#0000ff")

let blueOff = new Material()
blueOff.albedoColor = Color3.FromHexString("#000088")

// Game tuple

let game = new Entity()
let gameState = new GameState()
game.add(gameState)

// Scenery objects

let board = new Entity()
board.add(new GLTFShape("models/Simon.gltf"))
board.add(new Transform({
  position: new Vector3(5, 1.5, 5),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(0.5, 0.5, 0.5)
})) 
engine.addEntity(board)

let green = new Entity()
green.set(greenOff)
green.add(new PlaneShape())
green.add(new PanelState(greenOn, greenOff, Panel.GREEN))
green.add(new Transform({
  position: new Vector3(1, 0.05, -1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
green.setParent(board)
green.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.GREEN)
  }
}))
engine.addEntity(green)

let red = new Entity()
red.add(new PlaneShape())
red.add(new PanelState(redOn, redOff, Panel.RED))
red.add(new Transform({
  position: new Vector3(1, 0.05, 1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
red.setParent(board)
red.set(redOff)
red.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.RED)
  }
}))
engine.addEntity(red)

let yellow = new Entity()
yellow.add(new PlaneShape())
yellow.add(new PanelState(yellowOn, yellowOff, Panel.YELLOW))
yellow.add(new Transform({
  position: new Vector3(-1, 0.05, -1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
yellow.setParent(board)
yellow.set(yellowOff)
yellow.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.YELLOW)
  }
}))
engine.addEntity(yellow)

let blue = new Entity()
blue.add(new PlaneShape())
blue.add(new PanelState(blueOn, blueOff, Panel.BLUE))
blue.add(new Transform({
  position: new Vector3(-1, 0.05, 1),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(2, 2, 2)
}))
blue.setParent(board)
blue.set(blueOff)
blue.add(new OnClick(e => {
  if (gameState.state == State.LISTENING){
    activatePanel(Panel.BLUE)
  }
}))
engine.addEntity(blue)

let button = new Entity()
button.setParent(board)
button.add(new Transform({
  position: new Vector3(0, 0.05, 0),
}))
button.add(new GLTFShape("models/Simon_Button.gltf"))
button.add(new ButtonData(0.07, -0.05))
button.add(new OnClick(e => {
  newGame(0)
  button.get(ButtonData).pressed = true
}))
engine.addEntity(button)

let scenery = new Entity()
scenery.add(new Transform({
  position : new Vector3(5, 0.05, 5)
}))
scenery.add(new GLTFShape("models/Simon_scene.gltf"))
engine.addEntity(scenery)



// // Helper functions

function activatePanel(color: Panel){

  for( let panel of panels.entities ){
    let p = panel.get(PanelState)
    if (p.color === color){
      p.activate()
    } else {
      p.active = false
    }
  }
  if (gameState.state == State.LISTENING){
    log("clicked " , color)
    checkGuess(color)
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

    log("stated playing, diff: ", difficulty, " seq: ", gameState.sequence)
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

    if (gameState.sequence[gameState.guessSequence.length-1] !== color) {
      lose()
      return
    }

    if (gameState.guessSequence.length === gameState.sequence.length) {
      // Winner winner chicken dinner
      log("You win! Keep going!");
      gameState.difficulty += 1
      newGame(gameState.difficulty);
      return
    }
  }


function lose(){
  log("You lose!")
  gameState.reset()
  gameState.state = State.IDLE
  for( let panel of panels.entities ){
    let p = panel.get(PanelState)
    p.activate()
  }
}