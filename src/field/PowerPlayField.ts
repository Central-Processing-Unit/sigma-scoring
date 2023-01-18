import autoBind from 'auto-bind'
import FieldGround from './FieldGround'
import FieldObject from './FieldObject'
import MediumJunction from './MediumJunction'
import Junction from './Junction'
import LowJunction from './LowJunction'
import HighJunction from './HighJunction'
import GroundJunction from './GroundJunction'
import Corner from './Corner'
import { Scores, TeamColor } from '../types'

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
  corners: Corner[] = []
  objects: FieldObject[] = []

  scores: Scores = { blue: 0, red: 0 }
  isBlueBeaconPlaced = false
  isRedBeaconPlaced = false

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
    this.junctions[0].push(new MediumJunction((1000 / 6) * 3, 1000 / 6, canvas))
    this.junctions[0].push(new LowJunction((1000 / 6) * 4, 1000 / 6, canvas))
    this.junctions[0].push(new GroundJunction((1000 / 6) * 5, 1000 / 6, canvas))
    this.junctions[1].push(new LowJunction((1000 / 6) * 1, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new MediumJunction((1000 / 6) * 2, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new HighJunction((1000 / 6) * 3, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new MediumJunction((1000 / 6) * 4, (1000 / 6) * 2, canvas))
    this.junctions[1].push(new LowJunction((1000 / 6) * 5, (1000 / 6) * 2, canvas))
    this.junctions[2].push(new MediumJunction((1000 / 6) * 1, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new HighJunction((1000 / 6) * 2, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new GroundJunction((1000 / 6) * 3, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new HighJunction((1000 / 6) * 4, (1000 / 6) * 3, canvas))
    this.junctions[2].push(new MediumJunction((1000 / 6) * 5, (1000 / 6) * 3, canvas))
    this.junctions[3].push(new LowJunction((1000 / 6) * 1, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new MediumJunction((1000 / 6) * 2, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new HighJunction((1000 / 6) * 3, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new MediumJunction((1000 / 6) * 4, (1000 / 6) * 4, canvas))
    this.junctions[3].push(new LowJunction((1000 / 6) * 5, (1000 / 6) * 4, canvas))
    this.junctions[4].push(new GroundJunction((1000 / 6) * 1, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new LowJunction((1000 / 6) * 2, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new MediumJunction((1000 / 6) * 3, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new LowJunction((1000 / 6) * 4, (1000 / 6) * 5, canvas))
    this.junctions[4].push(new GroundJunction((1000 / 6) * 5, (1000 / 6) * 5, canvas))

    this.corners.push(new Corner(0, (1000 / 6) * 5, canvas, 'blue'))
    this.corners.push(new Corner((1000 / 6) * 5, 0, canvas, 'blue', true))
    this.corners.push(new Corner((1000 / 6) * 5, (1000 / 6) * 5, canvas, 'red'))
    this.corners.push(new Corner(0, 0, canvas, 'red', true))
  }

  render(): void {
    this.objects.forEach(o => o.render())
    this.junctions.forEach(row => row.forEach(junction => junction.render()))
    this.corners.forEach(c => c.render())
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
    for (let corner of this.corners) {
      if (corner.isPointWithin(x, y)) {
        corner.handleClick(e)
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
    for (let row of this.junctions) {
      for (let junction of row) {
        junction.setHovering(junction.isPointWithin(x, y))
      }
    }
    for (let corner of this.corners) {
      corner.setHovering(corner.isPointWithin(x, y))
    }
    for (let obj of this.objects) {
      obj.setHovering(obj.isPointWithin(x, y))
    }
  }

  // todo: could optimize by only calculating this on change
  updateScores(): void {
    const scores = { blue: 0, red: 0 } as Scores
    for (let row of this.junctions) {
      for (let junction of row) {
        const p = junction.getScores()
        scores.blue += p.blue
        scores.red += p.red
      }
    }
    for (let obj of this.objects) {
      const p = obj.getScores()
      scores.blue += p.blue
      scores.red += p.red
    }
    this.scores = scores
    console.log('new scores:', scores)
  }
}
