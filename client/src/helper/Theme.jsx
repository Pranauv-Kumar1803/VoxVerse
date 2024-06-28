import { extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/comfortaa';

const theme = extendTheme({
  fonts: {
    heading: `'Comfortaa Variable', system-ui`,
    body: `'Comfortaa Variable', system-ui`
  },
})

export default theme