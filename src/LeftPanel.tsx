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
      <Heading as='h6' fontSize={{ md: '16px', lg: '16px', xl: '26px' }}>
        Blue Score: {scores.blue}
      </Heading>
      <Text fontSize={{ md: '12px', lg: '14px', xl: '16px' }}>Autonomous: {scores.blueAuton}</Text>
      <Text fontSize={{ md: '12px', lg: '14px', xl: '16px' }}>Teleop: {scores.blueTeleOp}</Text>
      <Text fontSize={{ md: '12px', lg: '14px', xl: '16px' }}>Penalty: {scores.bluePenaltyFor}</Text>
      <Heading mt={{ base: '10px', md: '15px', xl: ' 25px' }} as='h6' fontSize={{ md: '14px', lg: '18px', xl: '22px' }}>
        Penalize
      </Heading>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text mr='10px' fontSize={{ lg: '14px', xl: '16px' }}>
          Minor:{' '}
        </Text>
        <HStack>
          <Button size='xs' onClick={() => onMinorPenaltyChange(penalties.minor.againstBlue + 1)}>
            +
          </Button>
          <Input
            size='xs'
            type='number'
            w={{ sm: '20px', md: '35px' }}
            value={penalties.minor.againstBlue}
            onChange={e => onMinorPenaltyChange(Number(e.target.value))}
          />
          <Button size='xs' onClick={() => onMinorPenaltyChange(penalties.minor.againstBlue - 1)}>
            -
          </Button>
        </HStack>
      </Flex>
      <Flex mt='10px' alignItems='center' justifyContent='space-between'>
        <Text fontSize={{ lg: '14px', xl: '16px' }}>Major: </Text>
        <HStack>
          <Button size='xs' onClick={() => onMajorPenaltyChange(penalties.major.againstBlue + 1)}>
            +
          </Button>
          <Input
            size='xs'
            type='number'
            w={{ sm: '20px', md: '35px' }}
            value={penalties.major.againstBlue}
            onChange={e => onMajorPenaltyChange(Number(e.target.value))}
          />
          <Button size='xs' onClick={() => onMajorPenaltyChange(penalties.major.againstBlue - 1)}>
            -
          </Button>
        </HStack>
      </Flex>
      <Heading mt={{ base: '10px', md: '15px', xl: '25px' }} as='h6' fontSize={{ md: '14px', lg: '18px', xl: '22px' }}>
        Usage
      </Heading>
      <Box fontSize={{ lg: '9pt', xl: '11pt' }}>
        <Text>
          <b>Place a cone</b>: click on a junction or terminal. Left-click for blue and right-click for red.
        </Text>
        <Text>
          <b>Signal Park</b>: click on the signal, which will turn green. By default, each signal has a custom sleeve. To
          toggle this, alt-click the signal.
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
    </Box>
  )
}

export default LeftPanel
