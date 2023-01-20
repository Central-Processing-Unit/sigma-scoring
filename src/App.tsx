import React, { MouseEventHandler, useCallback, useEffect, useRef } from 'react'
import './App.css'
import { Box, ChakraProvider, Flex, Heading, Text } from '@chakra-ui/react'
import Canvas from './Canvas'
import { useState } from 'react'
import { GlobalHotKeys } from 'react-hotkeys'
import PowerPlayField from './field/PowerPlayField'
import { Cone, Penalties, Period, ScoreReport, Scores } from './types'
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
    redTeleOp: 0,
    bluePenaltyFor: 0,
    redPenaltyFor: 0
  })
  const [period, setPeriod] = useState<Period>('autonomous')
  const [penalties, setPenalties] = useState<Penalties>({
    minor: { againstBlue: 0, againstRed: 0 },
    major: { againstBlue: 0, againstRed: 0 }
  })
  const [hoveredConeStack, setHoveredConeStack] = useState<Cone[]>([])

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
      const penaltyScores = field.getPenaltyScores()
      if (field.period === 'autonomous') {
        blueAuton = blue - penaltyScores.blue
        redAuton = red - penaltyScores.red
      }
      return {
        blue,
        red,
        blueAuton,
        redAuton,
        blueTeleOp: field.period === 'autonomous' ? 0 : blue - blueAuton - penaltyScores.blue,
        redTeleOp: field.period === 'autonomous' ? 0 : red - redAuton - penaltyScores.red,
        bluePenaltyFor: penaltyScores.blue,
        redPenaltyFor: penaltyScores.red
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
          redTeleOp: 0,
          bluePenaltyFor: 0,
          redPenaltyFor: 0
        })
        setPenalties({ minor: { againstBlue: 0, againstRed: 0 }, major: { againstBlue: 0, againstRed: 0 } })
        setHoveredConeStack([])
        if (canvas) {
          field = new PowerPlayField(canvas)
          return 'autonomous'
        }
        return 'teleop'
      })
    },
    [period, setPeriod]
  )

  useEffect(() => {
    if (field) {
      field.penalties = penalties
      setTimeout(copyScores, 0)
    }
  }, [penalties])

  const handleMouseMove: MouseEventHandler = e => {
    if (field) {
      setHoveredConeStack(field.hoveredConeStack)
    }
  }

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
              <LeftPanel
                scores={scores}
                penalties={penalties}
                onMinorPenaltyChange={p =>
                  setPenalties(ps => ({ ...ps, minor: { ...ps.minor, againstBlue: p >= 0 ? p : 0 } }))
                }
                onMajorPenaltyChange={p =>
                  setPenalties(ps => ({ ...ps, major: { ...ps.major, againstBlue: p >= 0 ? p : 0 } }))
                }
              />
            </Box>
          </Box>
          <Box>
            <Flex justifyContent='center' mb='10px'>
              <Heading fontFamily='mplus'>Sigma Scoring</Heading>
            </Flex>
            <Box w={{ base: '90vw', lg: '80vh' }} h={{ base: '90vw', lg: '80vh' }}>
              {<Canvas draw={draw} onClick={handleClick} onMouseMove={handleMouseMove} />}
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
              <RightPanel
                scores={scores}
                penalties={penalties}
                onMinorPenaltyChange={p =>
                  setPenalties(ps => ({ ...ps, minor: { ...ps.minor, againstRed: p >= 0 ? p : 0 } }))
                }
                onMajorPenaltyChange={p =>
                  setPenalties(ps => ({ ...ps, major: { ...ps.major, againstRed: p >= 0 ? p : 0 } }))
                }
                hoveredConeStack={hoveredConeStack}
              />
            </Box>
          </Box>
        </Flex>
      </GlobalHotKeys>
    </ChakraProvider>
  )
}

export default App
