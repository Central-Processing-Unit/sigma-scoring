import { Box, Heading, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { ScoreReport } from './types'

interface Props {
  scores: ScoreReport
}

const LeftPanel: FC<Props> = ({ scores }) => {
  return (
    <Box p='10px'>
      <Heading as='h6' fontSize='28px'>
        Blue Score: {scores.blue}
      </Heading>
      <Text fontSize='18px'>Autonomous: {scores.blueAuton}</Text>
      <Text fontSize='18px'>Teleop: {scores.blueTeleOp}</Text>
    </Box>
  )
}

export default LeftPanel
