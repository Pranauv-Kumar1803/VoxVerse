'use client'

import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    useColorModeValue,
    Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from 'react-router-dom'

const NavLink = (props) => {
    const { children } = props
    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: '#fff',
                color: 'black'
            }}
            href={'#'}>
            {children}
        </Box>
    )
}

function Navigation() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    let Links = [{ name: 'Discover Audio Files', link: 'files' }]

    return (
        <>
            <Box bg={'#1ed760'} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            <Link to={'/'}>
                                Home
                            </Link>
                        </Box>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {Links.map((obj, id) => (
                                <Link key={id} to={obj.link}>
                                    <NavLink key={obj.name}>{obj.name}</NavLink>
                                </Link>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Link to={'/upload'}>
                            <Button
                                variant={'solid'}
                                background={'#fff'}
                                color={'black'}
                                size={'sm'}
                                mr={4}>
                                Upload Files
                            </Button>
                        </Link>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((obj) => (
                                <NavLink key={obj.link}>{obj.name}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}

export default Navigation;