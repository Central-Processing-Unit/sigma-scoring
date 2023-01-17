import { Cone, Scores } from '../types'
import FieldObject from './FieldObject'

const drawRotatedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  degrees: number,
  stroke = true
) => {
  // first save the untranslated/unrotated context
  ctx.save()

  ctx.beginPath()
  // move the rotation point to the center of the rect
  ctx.translate(x + width / 2, y + height / 2)
  // ctx.translate(x + width, y + height)
  // rotate the rect
  ctx.rotate((degrees * Math.PI) / 180)

  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y]
  //       so the rect needs to be offset accordingly when drawn
  ctx.rect(-width / 2, -height / 2, width, height)
  // ctx.rect(-width, -height, width, height)

  ctx.fill()
  if (stroke) {
    ctx.stroke()
  }

  // restore the context to its untranslated/unrotated state
  ctx.restore()
}

type Color = 'red' | 'blue'

export default class Corner extends FieldObject {
  cones: Cone[] = []
  lastClicked: number = 0
  lastDeleted: number = 0
  isTop: boolean
  color: Color

  constructor(x: number, y: number, canvas: HTMLCanvasElement, color: Color, isTop: boolean = false) {
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
    drawRotatedRect(this.ctx, this.x + 125, yPos, 15, 400, this.color === 'blue' ? -45 : 45) // Bottom left corner

    const ownership = this.cones.length !== 0 ? this.cones[this.cones.length - 1] : 'none'
    if (ownership !== 'none') {
      if (ownership === 'blue') {
        this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
        this.ctx.strokeStyle = '#0a0a75'
      } else if (ownership === 'red') {
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
      const cy = this.isTop ? 1000/24 : 3 * 1000/24
      const cx = this.isTop !== (this.color === 'blue') ? 1000/24 : 3 * 1000/24
      this.ctx.arc(this.x + cx, this.y + cy, 15, 0, 2 * Math.PI, false)
      this.ctx.fill()
      this.ctx.stroke()
    }
  }

  isPointWithin(x: number, y: number): boolean {
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.height) {
      return false
    }

    let xCornerDist = this.isTop !== (this.color === 'blue') ? x - this.x : this.x + this.width - x
    let yCornerDist = this.isTop ? y - this.y : this.y + this.height - y
    return xCornerDist + yCornerDist <= this.width
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
