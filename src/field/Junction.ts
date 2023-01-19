import { Cone, JunctionHeight, Scores, TeamColor } from '../types'
import FieldObject from './FieldObject'

const pointMap = Object.freeze({
  ground: 2,
  low: 3,
  medium: 4,
  high: 5
})

export default class Junction extends FieldObject {
  cones: Cone[] = []
  lastClicked: number = 0
  lastDeleted: number = 0
  junctionHeight: JunctionHeight

  constructor(x: number, y: number, canvas: HTMLCanvasElement, junctionHeight: JunctionHeight, radius: number = 15) {
    super(x, y, radius, radius, canvas)
    this.junctionHeight = junctionHeight
  }

  render(): void {
    const ownership = this.cones.length !== 0 ? this.cones[this.cones.length - 1] : 'none'
    if (ownership === 'blue' || ownership === 'blue beacon') {
      this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
    } else if (ownership === 'red' || ownership === 'red beacon') {
      this.ctx.fillStyle = this.hovering ? '#f54340' : '#fe0f0a'
      this.ctx.strokeStyle = '#500910'
    } else {
      if (this.junctionHeight === 'ground') {
        this.ctx.fillStyle = this.hovering ? '#6b6b6b' : '#3d3d3d'
        this.ctx.strokeStyle = '#2e2d2d'
      } else {
        this.ctx.fillStyle = this.hovering ? '#f2f057' : '#ebe834'
        this.ctx.strokeStyle = '#73722c'
      }
    }
    const recentlyClicked = Date.now() - this.lastClicked < 500
    if (recentlyClicked) {
      this.ctx.strokeStyle = '#d6d6d0'
    }
    const recentlyDeleted = Date.now() - this.lastDeleted < 500
    if (recentlyDeleted) {
      this.ctx.strokeStyle = '#f57269'
    }
    if (ownership.includes('beacon')) {
      this.ctx.fillRect(this.x - 15, this.y - 15, 30, 30)
      this.ctx.strokeRect(this.x - 15, this.y - 15, 30, 30)
    } else {
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false)
      this.ctx.fill()
      this.ctx.lineWidth = 5
      this.ctx.stroke()
    }
  }

  handleJunctionClick(
    e: MouseEvent,
    canPlaceBlueBeacon: boolean,
    canPlaceRedBeacon: boolean,
    onBeaconUpdate: (color: TeamColor, isPlaced: boolean) => void
  ): void {
    if (e.ctrlKey) {
      const cone = this.cones.pop()
      if (cone === 'blue beacon') {
        onBeaconUpdate('blue', false)
      } else if (cone === 'red beacon') {
        onBeaconUpdate('red', false)
      }
      this.lastDeleted = Date.now()
      return
    }
    if (this.cones.length && this.cones[this.cones.length - 1].includes('beacon')) {
      return
    }
    if (e.button === 0) {
      if (e.altKey) {
        if (!canPlaceBlueBeacon) {
          return
        }
        onBeaconUpdate('blue', true)
        this.cones.push('blue beacon')
      } else {
        this.cones.push('blue')
      }
    } else if (e.button === 2) {
      if (e.altKey) {
        if (!canPlaceRedBeacon) {
          return
        }
        onBeaconUpdate('red', true)
        this.cones.push('red beacon')
      } else {
        this.cones.push('red')
      }
    }
    this.lastClicked = Date.now()
  }

  override handleClick(e: MouseEvent): void {
    this.handleJunctionClick(e, false, false, () => {})
  }

  override isPointWithin(x: number, y: number): boolean {
    return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) < Math.pow(this.width + 15, 2)
  }

  getAutonomousScores(): Scores {
    const scores = { blue: 0, red: 0 } as Scores
    if (this.cones.length === 0) {
      return scores
    }
    const value = pointMap[this.junctionHeight]
    for (let cone of this.cones) {
      if (cone === 'blue') {
        scores.blue += value
      } else if (cone === 'red') {
        scores.red += value
      }
    }
    return scores
  }

  override getScores(): Scores {
    const scores = { blue: 0, red: 0 } as Scores
    if (this.cones.length === 0) {
      return scores
    }
    const value = pointMap[this.junctionHeight]
    for (let cone of this.cones) {
      if (cone === 'blue') {
        scores.blue += value
      } else if (cone === 'red') {
        scores.red += value
      }
    }

    const top = this.cones[this.cones.length - 1]
    if (top === 'blue') {
      scores.blue += 3
    } else if (top === 'blue beacon') {
      scores.blue += 10
    } else if (top === 'red') {
      scores.red += 3
    } else {
      scores.red += 10
    }

    return scores
  }
}
