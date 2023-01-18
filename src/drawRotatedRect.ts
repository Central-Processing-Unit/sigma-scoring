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

export default drawRotatedRect
