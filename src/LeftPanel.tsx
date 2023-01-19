import { Box, Heading } from '@chakra-ui/react'
import React, { FC } from 'react'

interface Props {
  blueScore: number
}

const LeftPanel: FC<Props> = ({ blueScore }) => {
  return (
    <Box p='10px'>
      <Heading as='h6' fontSize='28px'>
        Blue Score: {blueScore}
      </Heading>
    </Box>
  )
}

export default LeftPanel
