import { Box, Heading, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { ScoreReport } from './types'

interface Props {
  scores: ScoreReport
}

const RightPanel: FC<Props> = ({ scores }) => {
  return (
    <Box p='10px'>
      <Heading as='h6' fontSize='28px'>
        Red Score: {scores.red}
      </Heading>
      <Text fontSize='18px'>Autonomous: {scores.redAuton}</Text>
      <Text fontSize='18px'>Teleop: {scores.redTeleOp}</Text>
    </Box>
  )
}

export default RightPanel
