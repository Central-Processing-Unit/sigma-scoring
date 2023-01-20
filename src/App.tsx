import React, { useCallback, useEffect, useRef } from 'react'
import './App.css'
import { Box, ChakraProvider, Flex, Heading, Text } from '@chakra-ui/react'
import Canvas from './Canvas'
import { useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import PowerPlayField from './field/PowerPlayField'
import { Penalties, Period, ScoreReport, Scores } from './types'
import capitalize from './capitalize'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'

let field: PowerPlayField | null = null

function App() {
  const [scores, setScores] = useState<ScoreReport>({
    blue: 0,
    red: 0,
    blueAuton: 0,
    redAuton: 0,
    blueTeleOp: 0,
    redTeleOp: 0
  })
  const [period, setPeriod] = useState<Period>('autonomous')
  const [penalties, setPenalties] = useState<Penalties>({
    minor: { againstBlue: 0, againstRed: 0 },
    major: { againstBlue: 0, againstRed: 0 }
  })

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
    setTimeout(copyScores, 0)
  }

  const copyScores = () => {
    if (!field) {
      return
    }
    field.updateScores()
    setScores(s => {
      if (!field) {
        return s
      }
      const { blue, red } = field.scores
      let { blue: blueAuton, red: redAuton } = field.autonomousScores
      if (field.period === 'autonomous') {
        blueAuton = blue
        redAuton = red
      }
      return {
        blue,
        red,
        blueAuton,
        redAuton,
        blueTeleOp: field.period === 'autonomous' ? 0 : blue - blueAuton,
        redTeleOp: field.period === 'autonomous' ? 0 : red - redAuton
      }
    })
  }

  const handleContinue = useCallback(
    (e?: KeyboardEvent) => {
      if (e) {
        e.preventDefault()
      }
      console.log('space', period)
      setPeriod(p => {
        if (p === 'autonomous') {
          field?.startTeleOp()
          setTimeout(copyScores, 0)
          return 'teleop'
        }
        const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
        setScores({
          blue: 0,
          red: 0,
          blueAuton: 0,
          redAuton: 0,
          blueTeleOp: 0,
          redTeleOp: 0
        })
        if (canvas) {
          field = new PowerPlayField(canvas)
          return 'autonomous'
        }
        return 'teleop'
      })
    },
    [period, setPeriod]
  )

  const handlers = {
    CONTINUE: handleContinue // todo: this callback isn't getting the current value of period :(
  }

  const keyMap = {
    CONTINUE: ['space']
  }

  // todo: show cones visually on hover on a side panel
  return (
    <ChakraProvider>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <Flex px='7vw' justifyContent='space-between' alignItems='center' h='100vh' fontFamily='mplus'>
          <Box w='15vw' h={{ base: '90vw', lg: '80vh' }} border='8px solid #0a0ef2' outline='2px solid black'>
            <Box w='100%' h='100%' outline='2px solid black'>
              {/* todo: limit to at least 0 penalties */}
              <LeftPanel
                scores={scores}
                penalties={penalties}
                onMinorPenaltyChange={p => setPenalties(ps => ({ ...ps, minor: { ...ps.minor, againstBlue: p } }))}
                onMajorPenaltyChange={p => setPenalties(ps => ({ ...ps, major: { ...ps.major, againstBlue: p } }))}
              />
            </Box>
          </Box>
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
          <Box w='15vw' h={{ base: '90vw', lg: '80vh' }} border='8px solid #fe0f0a' outline='2px solid black'>
            <Box w='100%' h='100%' outline='2px solid black'>
              <RightPanel scores={scores} />
            </Box>
          </Box>
        </Flex>
      </GlobalHotKeys>
    </ChakraProvider>
  )
}

export default App
