import autoBind from 'auto-bind'
import FieldGround from './FieldGround'
import FieldObject from './FieldObject'
import MediumJunction from './MediumJunction'
import Junction from './Junction'
import LowJunction from './LowJunction'
import HighJunction from './HighJunction'
import GroundJunction from './GroundJunction'
import Terminal from './Terminal'
import { Cone, Penalties, Period, Scores, TeamColor } from '../types'
import Substation from './Substation'
import SignalSleeve from './SignalSleeve'

const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width, // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height // relationship bitmap vs. element for y

  return {
    x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
  }
}

export default class PowerPlayField {
  junctions: Junction[][] = [[], [], [], [], []]
  terminals: Terminal[] = []
  objects: FieldObject[] = []

  scores: Scores = { blue: 0, red: 0 }
  isBlueBeaconPlaced = false
  isRedBeaconPlaced = false
  autonomousScores: Scores = { blue: 0, red: 0 }
  autonomousDuplicatePoints: Scores = { blue: 0, red: 0 } // for cones that are scored in autonomous. they need to be double-counted
  penalties: Penalties = { minor: { againstBlue: 0, againstRed: 0 }, major: { againstBlue: 0, againstRed: 0 } }

  period: Period = 'autonomous'

  hoveredConeStack: Cone[] = []

  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    document.addEventListener('contextmenu', e => {
      e.preventDefault()
      const { x, y } = getMousePos(this.canvas, e)
      this.handleClick(x, y, e)
    })
    canvas.addEventListener('click', e => {
      const { x, y } = getMousePos(this.canvas, e)
      this.handleClick(x, y, e)
    })
    canvas.addEventListener('mousemove', e => {
      const { x, y } = getMousePos(this.canvas, e)
      this.handleMouseMove(x, y, e)
    })
    this.objects.push(new FieldGround(0, 0, 1000, 1000, canvas))

    this.junctions[0].push(new GroundJunction(1000 / 6, 1000 / 6, canvas))
    this.junctions[0].push(new LowJunction((1000 / 6) * 2, 1000 / 6, canvas))
    this.junctions[0].push(new GroundJunction((1000 / 6) * 3, 1000 / 6, canvas))
    this.junctions[0].push(new LowJunction((1000 / 6) * 4, 1000 / 6, canvas))
    this.junctions[0].push(new GroundJunction((1000 / 6) * 5, 1000 / 6, canvas))
    this.junctions[1].push(new LowJunction((1000 / 6) * 1, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new MediumJunction((1000 / 6) * 2, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new HighJunction((1000 / 6) * 3, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new MediumJunction((1000 / 6) * 4, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new LowJunction((1000 / 6) * 5, (1000 / 6) * 2, canvas))
    this.junctions[2].push(new GroundJunction((1000 / 6) * 1, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new HighJunction((1000 / 6) * 2, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new GroundJunction((1000 / 6) * 3, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new HighJunction((1000 / 6) * 4, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new GroundJunction((1000 / 6) * 5, (1000 / 6) * 3, canvas))
    this.junctions[3].push(new LowJunction((1000 / 6) * 1, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new MediumJunction((1000 / 6) * 2, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new HighJunction((1000 / 6) * 3, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new MediumJunction((1000 / 6) * 4, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new LowJunction((1000 / 6) * 5, (1000 / 6) * 4, canvas))
    this.junctions[4].push(new GroundJunction((1000 / 6) * 1, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new LowJunction((1000 / 6) * 2, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new GroundJunction((1000 / 6) * 3, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new LowJunction((1000 / 6) * 4, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new GroundJunction((1000 / 6) * 5, (1000 / 6) * 5, canvas))

    this.terminals.push(new Terminal(0, 0, canvas, 'red', true))
    this.terminals.push(new Terminal(0, (1000 / 6) * 5, canvas, 'blue'))
    this.terminals.push(new Terminal((1000 / 6) * 5, (1000 / 6) * 5, canvas, 'red'))
    this.terminals.push(new Terminal((1000 / 6) * 5, 0, canvas, 'blue', true))

    this.objects.push(new Substation(0, 1000 / 2, canvas, 'blue'))
    this.objects.push(new Substation(1000, 1000 / 2, canvas, 'red'))

    this.objects.push(new SignalSleeve(1000 / 4, 1000 / 4, canvas, 'blue'))
    this.objects.push(new SignalSleeve(1000 / 4, (3 * 1000) / 4, canvas, 'blue'))
    this.objects.push(new SignalSleeve((3 * 1000) / 4, 1000 / 4, canvas, 'red'))
    this.objects.push(new SignalSleeve((3 * 1000) / 4, (3 * 1000) / 4, canvas, 'red'))
  }

  render(): void {
    this.objects.forEach(o => o.render())
    this.junctions.forEach(row => row.forEach(junction => junction.render()))
    this.terminals.forEach(c => c.render())
  }

  onBeaconUpdate(color: TeamColor, isPlaced: boolean) {
    if (color === 'blue') {
      this.isBlueBeaconPlaced = isPlaced
    } else {
      this.isRedBeaconPlaced = isPlaced
    }
  }

  handleClick(x: number, y: number, e: MouseEvent): void {
    for (let row of this.junctions) {
      for (let junction of row) {
        if (junction.isPointWithin(x, y)) {
          junction.handleJunctionClick(e, !this.isBlueBeaconPlaced, !this.isRedBeaconPlaced, this.onBeaconUpdate)
          return
        }
      }
    }
    for (let terminal of this.terminals) {
      if (terminal.isPointWithin(x, y)) {
        terminal.handleClick(e)
        return
      }
    }
    for (let obj of this.objects) {
      if (obj.isPointWithin(x, y)) {
        obj.handleClick(e)
        return
      }
    }
  }

  handleMouseMove(x: number, y: number, e: MouseEvent): void {
    let isHoveringConeStack = false
    for (let row of this.junctions) {
      for (let junction of row) {
        const isWithin = junction.isPointWithin(x, y)
        junction.setHovering(isWithin)
        if (isWithin && !isHoveringConeStack) {
          isHoveringConeStack = true
          this.hoveredConeStack = junction.cones
        }
      }
    }
    for (let terminal of this.terminals) {
      const isWithin = terminal.isPointWithin(x, y)
      terminal.setHovering(isWithin)
      if (isWithin && !isHoveringConeStack) {
        isHoveringConeStack = true
        this.hoveredConeStack = terminal.cones
      }
    }
    for (let obj of this.objects) {
      obj.setHovering(obj.isPointWithin(x, y))
    }
    if (!isHoveringConeStack) {
      this.hoveredConeStack = []
    }
  }

  getPenaltyScores(): Scores {
    return {
      blue: this.penalties.minor.againstRed * 10 + this.penalties.major.againstRed * 30,
      red: this.penalties.minor.againstBlue * 10 + this.penalties.major.againstBlue * 30
    }
  }

  // todo: could optimize by only calculating this on change
  updateScores(): void {
    const scores = { blue: this.autonomousScores.blue, red: this.autonomousScores.red } as Scores
    for (let row of this.junctions) {
      for (let junction of row) {
        const s = junction.getScores()
        scores.blue += s.blue
        scores.red += s.red
      }
    }
    for (let terminal of this.terminals) {
      const s = terminal.getScores()
      scores.blue += s.blue
      scores.red += s.red
    }
    for (let obj of this.objects) {
      const s = obj.getScores()
      scores.blue += s.blue
      scores.red += s.red
    }
    if (
      this.dfs('blue', 4, 0) &&
      this.terminals[1].getOwnership() === 'blue' &&
      this.terminals[3].getOwnership() === 'blue'
    ) {
      scores.blue += 20
    }
    for (let row of this.junctions) {
      for (let junction of row) {
        junction.isSearched = false
      }
    }
    if (this.dfs('red', 0, 0) && this.terminals[0].getOwnership() === 'red' && this.terminals[2].getOwnership() === 'red') {
      scores.red += 20
    }
    for (let row of this.junctions) {
      for (let junction of row) {
        junction.isSearched = false
      }
    }

    const penaltyScores = this.getPenaltyScores()
    scores.blue += penaltyScores.blue
    scores.red += penaltyScores.red

    this.scores = scores
  }

  startTeleOp(): void {
    if (this.period !== 'autonomous') {
      return
    }
    console.log('startTeleop')
    for (let row of this.junctions) {
      for (let junction of row) {
        const s = junction.getAutonomousScores()
        console.log(s.blue)
        this.autonomousScores.blue += s.blue
        this.autonomousScores.red += s.red
      }
    }
    for (let terminal of this.terminals) {
      const s = terminal.getScores()
      this.autonomousScores.blue += s.blue
      this.autonomousScores.red += s.red
      terminal.endAutonomous()
    }
    for (let object of this.objects) {
      const s = object.getScores()
      this.autonomousScores.blue += s.blue
      this.autonomousScores.red += s.red
      object.endAutonomous()
    }
    this.autonomousScores.blue += this.autonomousDuplicatePoints.blue
    this.autonomousScores.red += this.autonomousDuplicatePoints.red
    this.updateScores()
    this.period = 'teleop'
  }

  dfs(color: TeamColor, row: number, column: number): boolean {
    if (row > 4 || row < 0 || column > 4 || column < 0) {
      return false
    }
    if (this.junctions[row][column].getOwnership() !== color || this.junctions[row][column].isSearched) {
      return false
    }
    this.junctions[row][column].isSearched = true
    if ((color === 'blue' && row === 0 && column === 4) || (color === 'red' && row === 4 && column === 4)) {
      return true
    }
    return (
      this.dfs(color, row - 1, column) ||
      this.dfs(color, row + 1, column) ||
      this.dfs(color, row, column - 1) ||
      this.dfs(color, row, column + 1) ||
      this.dfs(color, row - 1, column - 1) ||
      this.dfs(color, row - 1, column + 1) ||
      this.dfs(color, row + 1, column - 1) ||
      this.dfs(color, row + 1, column + 1)
    )
  }
}
