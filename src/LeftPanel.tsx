import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { ScoreReport } from './types'

interface Props {
  scores: ScoreReport
}

const LeftPanel: FC<Props> = ({ scores }) => {
  return (
    <Flex flexDir='column' justifyContent='space-between' p='10px' h='100%'>
      <Box>
        <Heading as='h6' fontSize='28px'>
          Blue Score: {scores.blue}
        </Heading>
        <Text fontSize='18px'>Autonomous: {scores.blueAuton}</Text>
        <Text fontSize='18px'>Teleop: {scores.blueTeleOp}</Text>
        <Heading mt='25px' as='h6' fontSize='28px'>
          Penalize
        </Heading>
        <Button>Minor Penalty</Button>
        <Button>Major Penalty</Button>
      </Box>
      <Box>
        <Heading as='h6' fontSize='28px'>
          Usage
        </Heading>
        <Text>
          <b>Place a cone</b>: click on a junction or terminal. Left-click for blue and right-click for red.
        </Text>
        <Text>
          <b>Signal Park</b>: click on the signal, which will turn green.
        </Text>
        <Text>
          <b>Terminal Park</b>: alt+click the terminal. This can be done up to two times on the same terminal to indicate
          multiple parks, which are indicated by squares.
        </Text>
        <Text>
          <b>Substation Park</b>: click on the substation.
        </Text>
        <Text>
          <b>Penalties</b>:
        </Text>
        <Text>
          <b>Delete</b>: control+click an object. This works with modifiers like alt to delete a park, for example.
        </Text>
      </Box>
    </Flex>
  )
}

export default LeftPanel
