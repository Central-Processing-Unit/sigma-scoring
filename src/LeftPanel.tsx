import { Box, Button, Flex, Heading, HStack, Input, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Penalties, ScoreReport } from './types'

interface Props {
  scores: ScoreReport
  penalties: Penalties
  onMinorPenaltyChange: (minors: number) => void
  onMajorPenaltyChange: (majors: number) => void
}

const LeftPanel: FC<Props> = ({ scores, penalties, onMinorPenaltyChange, onMajorPenaltyChange }) => {
  return (
    <Box p='10px'>
      <Heading as='h6' fontSize='28px'>
        Blue Score: {scores.blue}
      </Heading>
      <Text fontSize='18px'>Autonomous: {scores.blueAuton}</Text>
      <Text fontSize='18px'>Teleop: {scores.blueTeleOp}</Text>
      <Heading mt='25px' as='h6' fontSize='28px'>
        Penalize
      </Heading>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text mr='10px'>Minor: </Text>
        <HStack>
          <Button size='sm' onClick={() => onMinorPenaltyChange(penalties.minor.againstBlue + 1)}>
            +
          </Button>
          <Input
            size='sm'
            type='number'
            w='50px'
            value={penalties.minor.againstBlue}
            onChange={e => onMinorPenaltyChange(Number(e.target.value))}
          />
          <Button size='sm' onClick={() => onMinorPenaltyChange(penalties.minor.againstBlue - 1)}>
            -
          </Button>
        </HStack>
      </Flex>
      <Flex mt='10px' alignItems='center' justifyContent='space-between'>
        <Text mr='10px'>Major: </Text>
        <HStack>
          <Button size='sm' onClick={() => onMajorPenaltyChange(penalties.major.againstBlue + 1)}>
            +
          </Button>
          <Input
            size='sm'
            type='number'
            w='50px'
            value={penalties.major.againstBlue}
            onChange={e => onMajorPenaltyChange(Number(e.target.value))}
          />
          <Button size='sm' onClick={() => onMajorPenaltyChange(penalties.major.againstBlue - 1)}>
            -
          </Button>
        </HStack>
      </Flex>
      <Heading as='h6' fontSize='28px' mt='10px'>
        Usage
      </Heading>
      <Text>
        <b>Place a cone</b>: click on a junction or terminal. Left-click for blue and right-click for red.
      </Text>
      <Text>
        <b>Signal Park</b>: click on the signal, which will turn green. By default, each signal has a custom sleeve. To
        remove this, alt-click the signal.
      </Text>
      <Text>
        <b>Terminal Park</b>: alt+click the terminal. This can be done up to two times on the same terminal to indicate
        multiple parks, which are indicated by squares.
      </Text>
      <Text>
        <b>Substation Park</b>: click on the substation.
      </Text>
      <Text>
        <b>Delete</b>: control+click an object. This works with modifiers like alt to delete a park, for example.
      </Text>
    </Box>
  )
}

export default LeftPanel
