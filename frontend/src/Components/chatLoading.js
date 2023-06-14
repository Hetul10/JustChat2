import React from 'react'
import { Skeleton,Stack} from '@chakra-ui/react'

const chatLoading = () => {
  return (
    <Stack>
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
    </Stack>
  )
}

export default chatLoading
