import { Box, Button, Flex, Heading, HStack, Input, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Penalties, ScoreReport } from './types'

interface Props {
  scores: ScoreReport
  penalties: Penalties
  onMinorPenaltyChange: (minors: number) => void
  onMajorPenaltyChange: (majors: number) => void
}

const RightPanel: FC<Props> = ({ scores, penalties, onMinorPenaltyChange, onMajorPenaltyChange }) => {
  return (
    <Box p='10px'>
      <Heading as='h6' fontSize='28px'>
        Red Score: {scores.red}
      </Heading>
      <Text fontSize='18px'>Autonomous: {scores.redAuton}</Text>
      <Text fontSize='18px'>Teleop: {scores.redTeleOp}</Text>
      <Heading mt='25px' as='h6' fontSize='28px'>
        Penalize
      </Heading>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text mr='10px'>Minor: </Text>
        <HStack>
          <Button size='sm' onClick={() => onMinorPenaltyChange(penalties.minor.againstRed + 1)}>
            +
          </Button>
          <Input
            size='sm'
            type='number'
            w='50px'
            value={penalties.minor.againstRed}
            onChange={e => onMinorPenaltyChange(Number(e.target.value))}
          />
          <Button size='sm' onClick={() => onMinorPenaltyChange(penalties.minor.againstRed - 1)}>
            -
          </Button>
        </HStack>
      </Flex>
      <Flex mt='10px' alignItems='center' justifyContent='space-between'>
        <Text mr='10px'>Major: </Text>
        <HStack>
          <Button size='sm' onClick={() => onMajorPenaltyChange(penalties.major.againstRed + 1)}>
            +
          </Button>
          <Input
            size='sm'
            type='number'
            w='50px'
            value={penalties.major.againstRed}
            onChange={e => onMajorPenaltyChange(Number(e.target.value))}
          />
          <Button size='sm' onClick={() => onMajorPenaltyChange(penalties.major.againstRed - 1)}>
            -
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

export default RightPanel
