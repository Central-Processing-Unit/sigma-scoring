import drawRotatedRect from '../drawRotatedRect'
import { Cone, Scores, TeamColor } from '../types'
import FieldObject from './FieldObject'

export default class Substation extends FieldObject {
  cones: Cone[] = []
  color: TeamColor
  lastClicked: number = 0
  lastDeleted: number = 0

  constructor(x: number, y: number, canvas: HTMLCanvasElement, color: TeamColor) {
    super(x, y, 1000 / 12, 1000 / 6, canvas)
    this.color = color
  }

  render() {
    // Draw hover effect
    if (this.hovering) {
      this.ctx.fillStyle = this.hovering ? '#b5b3b3' : '#a1a1a1'
      this.ctx.beginPath()
      if (this.color === 'blue') {
        this.ctx.moveTo(this.x, this.y - 75)
        this.ctx.lineTo(this.x + this.width, this.y)
        this.ctx.lineTo(this.x, this.y + 75)
      } else {
        this.ctx.moveTo(this.x, this.y - 75)
        this.ctx.lineTo(this.x - this.width, this.y)
        this.ctx.lineTo(this.x, this.y + 75)
      }
      this.ctx.fill()
    }

    // Draw substation
    if (this.color === 'blue') {
      this.ctx.fillStyle = '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
      drawRotatedRect(this.ctx, 30, 398, 15, 125, -45)
      drawRotatedRect(this.ctx, 30, 480, 15, 125, 45)
      drawRotatedRect(this.ctx, 35, 402, 10, 120, -45, false)
    } else {
      this.ctx.fillStyle = '#fe0f0a'
      this.ctx.strokeStyle = '#500910'
      drawRotatedRect(this.ctx, 954, 396, 15, 125, 45)
      drawRotatedRect(this.ctx, 954, 478, 15, 130, -45)
      drawRotatedRect(this.ctx, 954, 402, 10, 120, 45, false)
    }

    // Replace line
    this.ctx.fillStyle = '#3e3e3e'
    this.ctx.strokeStyle = '#73722c'
    this.ctx.fillRect(this.x - (this.color === 'red' ? this.width + 25 : 0), this.y - 3, this.width + 25, 6)

    // const ownership = this.cones.length !== 0 ? this.cones[this.cones.length - 1] : 'none'
    // if (ownership !== 'none') {
    //   if (ownership === 'blue') {
    //     this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
    //     this.ctx.strokeStyle = '#0a0a75'
    //   } else if (ownership === 'red') {
    //     this.ctx.fillStyle = this.hovering ? '#f54340' : '#fe0f0a'
    //     this.ctx.strokeStyle = '#500910'
    //   }
    //   const recentlyClicked = Date.now() - this.lastClicked < 500
    //   if (recentlyClicked) {
    //     this.ctx.strokeStyle = '#d6d6d0'
    //   }
    //   const recentlyDeleted = Date.now() - this.lastDeleted < 500
    //   if (recentlyDeleted) {
    //     this.ctx.strokeStyle = '#f57269'
    //   }
    //   this.ctx.beginPath()
    //   const cy = this.isTop ? 1000 / 24 : (3 * 1000) / 24
    //   const cx = this.isTop !== (this.color === 'blue') ? 1000 / 24 : (3 * 1000) / 24
    //   this.ctx.arc(this.x + cx, this.y + cy, 15, 0, 2 * Math.PI, false)
    //   this.ctx.fill()
    //   this.ctx.stroke()
    // }
  }

  isPointWithin(x: number, y: number): boolean {
    const xDist = Math.abs(x - this.x)
    const yDist = Math.abs(y - this.y)
    // let xCornerDist = this.color === 'blue' ? x - this.x : this.x + this.width - x
    // let yCornerDist = this.isTop ? y - this.y : this.y + this.height - y
    // return xCornerDist + yCornerDist <= this.width
    return xDist + yDist <= this.width
  }

  handleClick(e: MouseEvent): void {
    if (e.ctrlKey) {
      this.cones.pop()
      this.lastDeleted = Date.now()
      return
    }
    if (e.button === 0 && this.color === 'blue') {
      this.cones.push('blue')
      this.lastClicked = Date.now()
    } else if (e.button === 2 && this.color === 'red') {
      this.cones.push('red')
      this.lastClicked = Date.now()
    }
  }

  override getScores(): Scores {
    const points = { blue: 0, red: 0 } as Scores
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
}
