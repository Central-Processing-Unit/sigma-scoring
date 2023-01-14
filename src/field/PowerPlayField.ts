import autoBind from "auto-bind";
import FieldGround from "./FieldGround";
import FieldObject from "./FieldObject";
import MediumJunction from "./MediumJunction";
import Junction from "./Junction";
import ShortJunction from "./ShortJunction";
import TallJunction from "./TallJunction";
import GroundJunction from "./GroundJunction";

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
  
  junctions: Junction[][] = [[],[],[],[],[]]
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

    this.junctions[0].push(new GroundJunction(1000/6, 1000/6, canvas))
    this.junctions[0].push(new ShortJunction(1000/6 * 2, 1000/6, canvas))
    this.junctions[0].push(new MediumJunction(1000/6 * 3, 1000/6, canvas))
    this.junctions[0].push(new ShortJunction(1000/6 * 4, 1000/6, canvas))
    this.junctions[0].push(new GroundJunction(1000/6 * 5, 1000/6, canvas))
    this.junctions[1].push(new ShortJunction(1000/6 * 1, 1000/6 * 2, canvas))
    this.junctions[1].push(new MediumJunction(1000/6 * 2, 1000/6 * 2, canvas))
    this.junctions[1].push(new TallJunction(1000/6 * 3, 1000/6 * 2, canvas))
    this.junctions[1].push(new MediumJunction(1000/6 * 4, 1000/6 * 2, canvas))
    this.junctions[1].push(new ShortJunction(1000/6 * 5, 1000/6 * 2, canvas))
    this.junctions[2].push(new MediumJunction(1000/6 * 1, 1000/6 * 3, canvas))
    this.junctions[2].push(new TallJunction(1000/6 * 2, 1000/6 * 3, canvas))
    this.junctions[2].push(new GroundJunction(1000/6 * 3, 1000/6 * 3, canvas))
    this.junctions[2].push(new TallJunction(1000/6 * 4, 1000/6 * 3, canvas))
    this.junctions[2].push(new MediumJunction(1000/6 * 5, 1000/6 * 3, canvas))
    this.junctions[3].push(new ShortJunction(1000/6 * 1, 1000/6 * 4, canvas))
    this.junctions[3].push(new MediumJunction(1000/6 * 2, 1000/6 * 4, canvas))
    this.junctions[3].push(new TallJunction(1000/6 * 3, 1000/6 * 4, canvas))
    this.junctions[3].push(new MediumJunction(1000/6 * 4, 1000/6 * 4, canvas))
    this.junctions[3].push(new ShortJunction(1000/6 * 5, 1000/6 * 4, canvas))
    this.junctions[4].push(new GroundJunction(1000/6 * 1, 1000/6 * 5, canvas))
    this.junctions[4].push(new ShortJunction(1000/6 * 2, 1000/6 * 5, canvas))
    this.junctions[4].push(new MediumJunction(1000/6 * 3, 1000/6 * 5, canvas))
    this.junctions[4].push(new ShortJunction(1000/6 * 4, 1000/6 * 5, canvas))
    this.junctions[4].push(new GroundJunction(1000/6 * 5, 1000/6 * 5, canvas))
  }

  render(): void {
    this.objects.forEach(o => o.render())
    this.junctions.forEach(row => row.forEach(junction => junction.render()))
  }

  handleClick(x: number, y: number, e: MouseEvent): void {
    for (let row of this.junctions) {
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
    for (let row of this.junctions) {
      for (let junction of row) {
        junction.setHovering(junction.isPointWithin(x,y))
      }
    }
    for (let obj of this.objects) {
      obj.setHovering(obj.isPointWithin(x,y))
    }
  }

}
