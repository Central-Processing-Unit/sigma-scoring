import drawRotatedRect from '../drawRotatedRect'
import { Cone, Scores, TeamColor } from '../types'
import FieldObject from './FieldObject'

// todo: could limit to two parts between the terminals, but not really necessary
export default class Terminal extends FieldObject {
  cones: Cone[] = []
  lastClicked: number = 0
  lastDeleted: number = 0
  isTop: boolean
  color: TeamColor
  parks: number = 0
  isAuton = true

  constructor(x: number, y: number, canvas: HTMLCanvasElement, color: TeamColor, isTop: boolean = false) {
    super(x, y, 1000 / 6, 1000 / 6, canvas)
    this.isTop = isTop
    this.color = color
  }

  render() {
    this.ctx.fillStyle = this.hovering ? '#b5b3b3' : '#a1a1a1'
    this.ctx.beginPath()
    if (this.isTop) {
      this.ctx.moveTo(this.x, this.y)
      this.ctx.lineTo(this.x + this.width, this.y)
      if (this.color === 'red') {
        this.ctx.lineTo(this.x, this.y + this.height)
      } else {
        this.ctx.lineTo(this.x + this.width, this.y + this.height)
      }
    } else {
      this.ctx.moveTo(this.x, this.y + this.height)
      if (this.color === 'red') {
        this.ctx.lineTo(this.x + this.width, this.y + this.height)
        this.ctx.lineTo(this.x + this.width, this.y)
      } else {
        this.ctx.lineTo(this.x + this.width, this.y + this.height)
        this.ctx.lineTo(this.x, this.y)
      }
    }
    this.ctx.fill()

    if (this.color === 'blue') {
      this.ctx.fillStyle = '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
    } else {
      this.ctx.fillStyle = '#fe0f0a'
      this.ctx.strokeStyle = '#500910'
    }
    let yPos = this.y - 55 - (this.isTop ? 25 : 0)
    if (this.color === 'red') {
      yPos -= 100
    }
    drawRotatedRect(this.ctx, this.x + 125, yPos, 15, 400, this.color === 'blue' ? -45 : 45)

    if (this.cones.length) {
      if (this.color === 'blue') {
        this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
        this.ctx.strokeStyle = '#0a0a75'
      } else if (this.color === 'red') {
        this.ctx.fillStyle = this.hovering ? '#f54340' : '#fe0f0a'
        this.ctx.strokeStyle = '#500910'
      }
      const recentlyClicked = Date.now() - this.lastClicked < 500
      if (recentlyClicked) {
        this.ctx.strokeStyle = '#d6d6d0'
      }
      const recentlyDeleted = Date.now() - this.lastDeleted < 500
      if (recentlyDeleted) {
        this.ctx.strokeStyle = '#f57269'
      }
      this.ctx.beginPath()
      const cy = this.isTop ? 1000 / 24 + 5 : (3 * 1000) / 24 - 5
      const cx = this.isTop !== (this.color === 'blue') ? 1000 / 24 + 5 : (3 * 1000) / 24 - 5
      this.ctx.arc(this.x + cx, this.y + cy, 15, 0, 2 * Math.PI, false)
      this.ctx.fill()
      this.ctx.stroke()
    }

    // Parks
    if (this.color === 'blue') {
      this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
    } else if (this.color === 'red') {
      this.ctx.fillStyle = this.hovering ? '#f54340' : '#fe0f0a'
      this.ctx.strokeStyle = '#500910'
    }
    for (let i = 0; i < this.parks; i++) {
      const offset = 10 + 20 * i
      const cy = this.isTop ? 8 : 980
      const cx = this.isTop !== (this.color === 'blue') ? offset : 988 - offset
      this.ctx.fillRect(cx, cy, 12, 12)
      this.ctx.strokeRect(cx, cy, 12, 12)
    }
  }

  isPointWithin(x: number, y: number): boolean {
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
      return false
    }

    const xCornerDist = this.isTop !== (this.color === 'blue') ? x - this.x : this.x + this.width - x
    const yCornerDist = this.isTop ? y - this.y : this.y + this.height - y
    return xCornerDist + yCornerDist <= this.width
  }

  handleClick(e: MouseEvent): void {
    if (e.ctrlKey) {
      if (e.altKey) {
        if (this.parks > 0) {
          this.parks--
        }
      } else {
        this.cones.pop()
        this.lastDeleted = Date.now()
      }
      return
    }

    // Parks
    if (e.altKey) {
      if (this.parks < 2 && (!this.isAuton || !this.isTop)) {
        this.parks++
      }
      return
    }

    this.cones.push(this.color)
    this.lastClicked = Date.now()
  }

  override getScores(): Scores {
    const points = { blue: 0, red: 0 } as Scores
    points[this.color] += this.parks * 2
    if (this.cones.length === 0) {
      return points
    }
    for (let cone of this.cones) {
      if (cone === 'blue') {
        points.blue++
      } else if (cone === 'red') {
        points.red++
      }
    }
    return points
  }

  override endAutonomous(): void {
    this.parks = 0
    this.isAuton = false
  }

  getOwnership(): TeamColor | null {
    if (!this.cones.length) {
      return null
    }
    const c = this.cones[this.cones.length - 1]
    return c.startsWith('blue') ? 'blue' : 'red'
  }
}
