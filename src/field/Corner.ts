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

export default class Corner extends FieldObject  {
  isTop: boolean
  color: Color
  
  constructor(x: number, y: number, canvas: HTMLCanvasElement, color: Color, isTop: boolean = false) {
    super(x, y, 1000/6, 1000/6, canvas)
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
    this.ctx.fill();
    
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
  }

  isPointWithin(x: number, y: number): boolean {
    // todo: not working for bottom left
    if ((this.isTop && this.color === 'blue') || (!this.isTop && this.color === 'red')) {
      return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height && (x - this.x + y - this.y) >= this.width
    }
    return x >= this.x && y >= this.y && (x - this.x + y - this.y) <= this.width
  }
}
