

export enum Panel {
  GREEN = "green",
  RED = "red",
  YELLOW = "yellow",
  BLUE = "blue"
}


@Component('gameState')
export class GameState {
  difficulty: number = 0;
  sequence: Panel[] = [];
  guessSequence: Panel[];
  activePanel: Panel | null = null;
  lockedInput: boolean = true;
}



// Materials

let greenOn = new Material()
greenOn.albedoColor = Color3.FromHexString("#00FF00")

let greenOff = new Material()
greenOff.albedoColor = Color3.FromHexString("#008800")

let redOn = new Material()
redOn.albedoColor = Color3.FromHexString("#FF0000")

let redOff = new Material()
redOff.albedoColor = Color3.FromHexString("#880000")

let yellowOn = new Material()
yellowOn.albedoColor = Color3.FromHexString("#FFFF00")

let yellowOff = new Material()
yellowOff.albedoColor = Color3.FromHexString("#888800")

let blueOn = new Material()
blueOn.albedoColor = Color3.FromHexString("#0000FF")

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
green.add(greenOff)
green.add(new OnClick(e => {
  gameState.activePanel = Panel.GREEN
  green.add(greenOn)
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
red.add(redOff)
red.add(new OnClick(e => {
  gameState.activePanel = Panel.RED
  red.add(redOn)
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
yellow.add(yellowOff)
yellow.add(new OnClick(e => {
  gameState.activePanel = Panel.YELLOW
  yellow.add(yellowOn)
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
blue.add(blueOff)
blue.add(new OnClick(e => {
  gameState.activePanel = Panel.BLUE
  blue.add(blueOn)
}))
engine.addEntity(blue)

let button = new Entity()
button.add(new Transform({
  position: new Vector3(5, 1.5, 5),
  rotation: Quaternion.Euler(90, 0, 0),
  scale: new Vector3(0.5, 0.5, 0.5)
}))
button.add(new GLTFShape("models/Simon_Button.gltf"))
engine.addEntity(button)

let scenery = new Entity()
scenery.add(new Transform({
  position : new Vector3(5, 0.05, 5)
  // scale 0.99 ?
}))
scenery.add(new GLTFShape("models/Simon_scene.gltf"))
engine.addEntity(scenery)






// // Helper functions

// function newGame(difficulty: number) {
//     const sequence = randomSequence(difficulty);

//     this.setState({
//       difficulty,
//       sequence,
//       lockedInput: true,
//       guessSequence: []
//     });

//     // Play the sequence before allowing the user to play!
//     await playSequence(sequence);
//   }

// function playSequence(sequence: Panel[]) {
//     for (let i = 0; i < sequence.length; i++) {
//       const panel = sequence[i];
//       this.setState({ activePanel: panel });

//       await sleep(500);

//       this.setState({
//         activePanel: null,
//         lockedInput: i !== sequence.length - 1
//       });

//       await sleep(500);
//     }
//   }

// function  randomSequence(difficulty: number): Panel[] {
//     const pool = Object.keys(Panel);
//     let arr: Panel[] = [];

//     for (let i = 0; i < difficulty; i++) {
//       const index = Math.floor(Math.random() * pool.length);
//       const key = pool[index] as keyof typeof Panel;
//       const panel = Panel[key] as Panel;
//       arr.push(panel);
//     }

//     return arr;
//   }

// function activatePanel(panel: Panel) {
//     if (this.state.lockedInput) {
//       return;
//     }

//     const nextSequence = [...this.state.guessSequence, panel];

//     if (this.state.sequence[this.state.guessSequence.length] !== panel) {
//       // loser
//       log("You lose!");
//       this.setState({ lockedInput: true, sequence: [], guessSequence: [] });
//       return;
//     }

//     this.setState({
//       activePanel: panel,
//       guessSequence: nextSequence
//     });

//     await sleep(500);

//     this.setState({ activePanel: null });

//     if (nextSequence.length === this.state.sequence.length) {
//       // Winner winner chicken dinner
//       console.log("You win! Keep going!");
//       await sleep(500);
//       this.newGame(this.state.difficulty + 1);
//       return;
//     }
//   }