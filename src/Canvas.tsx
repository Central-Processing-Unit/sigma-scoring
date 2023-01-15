import React, { FC, MouseEventHandler, RefObject, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

interface Props {
  draw: (ctx: CanvasRenderingContext2D, frame: number) => void
  onClick?: MouseEventHandler<HTMLCanvasElement>
}

const Canvas: FC<Props> = ({ draw, onClick, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    let animationFrameId = 0
    if (canvas) {
      const context = canvas.getContext('2d')
      let frameCount = 0

      const render = () => {
        frameCount++

        if (context) {
          draw(context, frameCount)
        }
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <canvas
      id='canvas'
      style={{ width: '100%', height: '100%' }}
      onClick={onClick}
      onContextMenu={onClick}
      width={1000}
      height={1000}
      ref={canvasRef}
      {...props}
    />
  )
}

export default Canvas
