import FieldObject from "./FieldObject";

export default class FieldGround extends FieldObject {
  render(): void {
    this.ctx.fillStyle = '#a1a1a1'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = '#ebe834'
    this.ctx.strokeStyle = '#73722c'
    for (let i = 1; i < 6; i++) {
      this.ctx.fillStyle = '#3e3e3e'
      this.ctx.fillRect((i * this.width) / 6 - 3, 0, 6, this.height)
      this.ctx.fillRect(0, (i * this.height) / 6 - 3, this.width, 6)
    }
  }

  isPointWithin(x: number, y: number): boolean {
    return false
  }
  
}
