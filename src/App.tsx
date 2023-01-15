import React, { useEffect, useRef } from 'react'
import './App.css'
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import Canvas from './Canvas'
import { Provider } from 'react-redux'
import { useState } from 'react'
import { createYield } from 'typescript'
import store from './store/store'
import PowerPlayField from './field/PowerPlayField'
import { Scores } from './types'

let isInitialized = false

const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  ctx.beginPath()
  ctx.arc(x, y, 15, 0, 2 * Math.PI, false)
  ctx.fill()
  ctx.lineWidth = 5
  ctx.stroke()
}

let field: PowerPlayField | null = null

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scores, setScores] = useState<Scores>({ blue: 0, red: 0 })

  const draw = (ctx: CanvasRenderingContext2D, frame: number) => {
    const can = document.getElementById('canvas') as HTMLCanvasElement | null
    if (!can) {
      return
    }
    if (!field) {
      field = new PowerPlayField(can)
    }
    field.render()
    // const width = can.width
    // const height = can.height
    // ctx.fillStyle = '#a1a1a1'
    // ctx.fillRect(0, 0, width, height)
    // ctx.fillStyle = '#ebe834'
    // ctx.strokeStyle = '#73722c'
    // for (let i = 1; i < 6; i++) {
    //   ctx.fillStyle = '#3e3e3e'
    //   ctx.fillRect((i * can.width) / 6 - 3, 0, 6, can.height)
    //   ctx.fillRect(0, (i * can.height) / 6 - 3, can.width, 6)
    // }
    // for (let i = 1; i < 6; i++) {
    //   ctx.fillStyle = '#ebe834'
    //   ctx.strokeStyle = '#73722c'
    //   for (let j = 1; j < 6; j++) {
    //     drawCircle(ctx, (i * can.width) / 6, (j * can.height) / 6, 15)
    //     drawCircle(ctx, (i * can.width) / 6, (j * can.height) / 6, 15)
    //   }
    // }
    // ctx.fillStyle = '#0a0ef2'
    // ctx.strokeStyle = '#0a0a75'
    // ctx.fillRect((5 / 12) * can.width - 10, 0, 20, can.height / 6)
    // ctx.strokeRect((5 / 12) * can.width - 10, 0, 20, can.height / 6)
    // ctx.fillRect((5 / 12) * can.width - 10, (5 / 6) * can.height, 20, can.height / 6)
    // ctx.strokeRect((5 / 12) * can.width - 10, (5 / 6) * can.height, 20, can.height / 6)
    // drawRotatedRect(ctx, 125, 780, 15, 400, -45) // Bottom left corner
    // drawRotatedRect(ctx, 875, -165, 15, 400, -45) // Top right corner

    // // Left triangle
    // drawRotatedRect(ctx, 25, 415, 15, 100, -45)
    // drawRotatedRect(ctx, 25, 475, 15, 100, 45)
    // drawRotatedRect(ctx, 30, 422, 10, 90, -45, false)

    // ctx.fillStyle = '#fe0f0a'
    // ctx.strokeStyle = '#500910'
    // ctx.fillRect((7 / 12) * can.width - 10, 0, 20, can.height / 6)
    // ctx.strokeRect((7 / 12) * can.width - 10, 0, 20, can.height / 6)
    // ctx.fillRect((7 / 12) * can.width - 10, (5 / 6) * can.height, 20, can.height / 6)
    // ctx.strokeRect((7 / 12) * can.width - 10, (5 / 6) * can.height, 20, can.height / 6)
    // drawRotatedRect(ctx, 125, -175, 15, 400, 45) // Top left corner
    // drawRotatedRect(ctx, 875, 760, 15, 400, 45) // Bottom right corner

    // // Right triangle
    // drawRotatedRect(ctx, 975, 415, 15, 100, 45)
    // drawRotatedRect(ctx, 975, 475, 15, 100, -45)
    // drawRotatedRect(ctx, 975, 422, 10, 90, 45, false)
  }

  useEffect(() => {}, [scores])

  const handleClick = () => {
    console.log('click', Date.now())
    if (field) {
      console.log('updating')
      field.updateScores()
      console.log('finished')
      setScores(s => field?.scores ?? s)
      // todo: for some reason, red score doesnt update if a red cone is added immediately after a blue one
    }
  }

  return (
    <ChakraProvider>
      <Flex justifyContent='center' alignItems='center' h='100vh'>
        <Box w={{ base: '100vw', lg: '40vw' }} h={{ base: '100vw', lg: '40vw' }}>
          {canvasRef && <Canvas onClick={handleClick} draw={draw} />}
        </Box>
      </Flex>
      {JSON.stringify(scores, null, 2)}
    </ChakraProvider>
  )
}

export default App
