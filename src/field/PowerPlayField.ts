import autoBind from "auto-bind";
import FieldGround from "./FieldGround";
import FieldObject from "./FieldObject";
import MediumPole from "./MediumPole";
import Pole from "./Pole";
import ShortPole from "./ShortPole";
import TallPole from "./TallPole";

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
  
  poles: Pole[][] = [[],[],[],[],[]]
  objects: FieldObject[] = []
  canvas: HTMLCanvasElement
  
  constructor(canvas: HTMLCanvasElement) {
    autoBind(this)
    this.canvas = canvas
    document.addEventListener('contextmenu', e => {
      e.preventDefault()
      const {x,y} = getMousePos(this.canvas, e)
      this.handleClick(x, y, e)
    })
    canvas.addEventListener('click', e => {
      const {x,y} = getMousePos(this.canvas, e)
      this.handleClick(x, y, e)
    })
    canvas.addEventListener('mousemove', e => {
      const {x,y} = getMousePos(this.canvas, e)
      this.handleMouseMove(x, y, e)
    })
    this.objects.push(new FieldGround(0, 0, 1000, 1000, canvas))

    this.poles[0].push(new ShortPole(1000/6 * 2, 1000/6, canvas))
    this.poles[0].push(new MediumPole(1000/6 * 3, 1000/6, canvas))
    this.poles[0].push(new ShortPole(1000/6 * 4, 1000/6, canvas))
    this.poles[1].push(new ShortPole(1000/6 * 1, 1000/6 * 2, canvas))
    this.poles[1].push(new MediumPole(1000/6 * 2, 1000/6 * 2, canvas))
    this.poles[1].push(new TallPole(1000/6 * 3, 1000/6 * 2, canvas))
    this.poles[1].push(new MediumPole(1000/6 * 4, 1000/6 * 2, canvas))
    this.poles[1].push(new ShortPole(1000/6 * 5, 1000/6 * 2, canvas))
    this.poles[2].push(new MediumPole(1000/6 * 1, 1000/6 * 3, canvas))
    this.poles[2].push(new TallPole(1000/6 * 2, 1000/6 * 3, canvas))
    this.poles[2].push(new TallPole(1000/6 * 4, 1000/6 * 3, canvas))
    this.poles[2].push(new MediumPole(1000/6 * 5, 1000/6 * 3, canvas))
    this.poles[3].push(new ShortPole(1000/6 * 1, 1000/6 * 4, canvas))
    this.poles[3].push(new MediumPole(1000/6 * 2, 1000/6 * 4, canvas))
    this.poles[3].push(new TallPole(1000/6 * 3, 1000/6 * 4, canvas))
    this.poles[3].push(new MediumPole(1000/6 * 4, 1000/6 * 4, canvas))
    this.poles[3].push(new ShortPole(1000/6 * 5, 1000/6 * 4, canvas))
    this.poles[4].push(new ShortPole(1000/6 * 2, 1000/6 * 5, canvas))
    this.poles[4].push(new MediumPole(1000/6 * 3, 1000/6 * 5, canvas))
    this.poles[4].push(new ShortPole(1000/6 * 4, 1000/6 * 5, canvas))
  }

  render(): void {
    this.objects.forEach(o => o.render())
    this.poles.forEach(row => row.forEach(pole => pole.render()))
  }

  handleClick(x: number, y: number, e: MouseEvent): void {
    for (let row of this.poles) {
      for (let pole of row) {
        if (pole.isPointWithin(x, y)) {
          pole.handleClick(e)
          return
        }
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
    for (let obj of this.objects) {
      if (obj.isPointWithin(x, y)) {
        obj.setHovering(true)
      } else {
        obj.setHovering(false)
      }
    }
  }

}
