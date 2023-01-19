import { Box, Heading } from '@chakra-ui/react'
import React, { FC } from 'react'

interface Props {
  redScore: number
}

const RightPanel: FC<Props> = ({ redScore }) => {
  return (
    <Box p='10px'>
      <Heading as='h6' fontSize='28px'>
        Red Score: {redScore}
      </Heading>
    </Box>
  )
}

export default RightPanel
