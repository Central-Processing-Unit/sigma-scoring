import FieldObject from "./FieldObject";

type JunctionHeight = 'ground' | 'short' | 'medium' | 'tall'

export default class Junction extends FieldObject {
  cones: string[] = []
  lastClicked: number = 0  
  junctionHeight: JunctionHeight

  constructor(x: number, y: number, canvas: HTMLCanvasElement, junctionHeight: JunctionHeight, radius: number = 15) {
    super(x, y, radius, radius, canvas)
    this.junctionHeight = junctionHeight
  }

  render(): void {
    const ownership = this.cones.length !== 0 ? this.cones[this.cones.length - 1] : 'none'
    const recentlyClicked = Date.now() - this.lastClicked < 500
    if (ownership === 'blue') {
      this.ctx.fillStyle = this.hovering ? '#4e51f5' : '#0a0ef2'
      this.ctx.strokeStyle = '#0a0a75'
    } else if (ownership === 'red') {
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
    if (recentlyClicked) {
      this.ctx.strokeStyle = '#d6d6d0'
    }
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI, false)
    this.ctx.fill()
    this.ctx.lineWidth = 5
    this.ctx.stroke()
  }

  override handleClick(e: MouseEvent): void {
    if (e.button === 0) {
      this.cones.push('blue')
    } else if (e.button === 2) {
      this.cones.push('red')
    }
    this.lastClicked = Date.now()
  }
  override isPointWithin(x: number, y: number): boolean {
    return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) < Math.pow(this.width + 15, 2)
  }
}
