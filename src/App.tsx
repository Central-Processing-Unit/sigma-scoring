import React, { useCallback, useEffect, useRef } from 'react'
import './App.css'
import { Box, ChakraProvider, Flex, Heading, Text } from '@chakra-ui/react'
import Canvas from './Canvas'
import { useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import PowerPlayField from './field/PowerPlayField'
import { Period, Scores } from './types'
import capitalize from './capitalize'

let field: PowerPlayField | null = null

function App() {
  const [scores, setScores] = useState<Scores>({ blue: 0, red: 0 })
  const [period, setPeriod] = useState<Period>('autonomous')

  const draw = (ctx: CanvasRenderingContext2D, frame: number) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
    if (!canvas) {
      return
    }
    if (!field) {
      field = new PowerPlayField(canvas)
    }
    field.render()
  }

  useEffect(() => {}, [scores])

  const handleClick = () => {
    console.log('click', Date.now())
    setTimeout(() => {
      if (field) {
        field.updateScores()
        setScores(s => field?.scores ?? s)
      }
    }, 0)
  }

  const handleContinue = useCallback(
    (e?: KeyboardEvent) => {
      if (e) {
        e.preventDefault()
      }
      console.log('space', period)
      if (period === 'autonomous') {
        console.log('state')
        setPeriod('teleop')
      } else {
        console.log('test')
        const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
        if (canvas) {
          field = new PowerPlayField(canvas)
          setPeriod('autonomous')
        }
      }
    },
    [period, setPeriod]
  )

  const handlers = {
    CONTINUE: handleContinue // todo: this callback isn't getting the current value of period :(
  }

  const keyMap = {
    CONTINUE: ['space']
  }

  console.log(period)
  return (
    <ChakraProvider>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <Flex justifyContent='center' alignItems='center' h='100vh' fontFamily='mplus'>
          <Box>
            <Flex justifyContent='center' mb='10px'>
              <Heading fontFamily='mplus'>Sigma Scoring</Heading>
            </Flex>
            <Box w={{ base: '90vw', lg: '80vh' }} h={{ base: '90vw', lg: '80vh' }}>
              {<Canvas onClick={handleClick} draw={draw} />}
            </Box>
            <Flex justifyContent='center'>
              <Box>
                <Heading textAlign='center' fontFamily='mplus'>
                  {capitalize(period)}
                </Heading>
                <Text textAlign='center'>Press space {period === 'autonomous' ? 'for Teleop' : 'to reset'}</Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </GlobalHotKeys>
    </ChakraProvider>
  )
}

export default App
