'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link as NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import axios from 'axios'

export default function UploadFile() {
    const [username, setUsername] = useState("");
    const [tags, setTags] = useState("");
    const [file, setFile] = useState(null);
    const nav = useNavigate();

    const handleSubmit = async () => {
        console.log(username, file);
        if (!file || username === "") {
            toast.warning("both username and file are required", {
                position: 'top-right'
            })
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("tags", tags);
        formData.append("username", username)

        try {
            const res = await axios.post('http://localhost:5000/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            console.log(res.data)

            toast.success('Uploaded Successfully!', {
                position: 'top-right'
            })
            nav('/');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Flex
            minH={'100vh'}
            margin={'auto'}
            w={'auto'}
            align={'center'}
            justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Upload an Audio
                    </Heading>
                    <Text fontSize={'lg'} color={'#1ed760'}>
                        and make others happy! ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    color={'#000'}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <Stack>
                            <Box>
                                <FormControl id="usermame" isRequired>
                                    <FormLabel>User Name</FormLabel>
                                    <Input focusBorderColor='#1ed760' type="text" value={username} onChange={(e) => {
                                        e.preventDefault();
                                        setUsername(e.target.value)
                                    }} />
                                </FormControl>
                            </Box>
                        </Stack>
                        <FormControl id="email" isRequired>
                            <FormLabel>Upload your file!</FormLabel>
                            <Input type="file" required name='file' onChange={(e) => {
                                e.preventDefault();
                                setFile(e.target.files[0])
                            }} />
                        </FormControl>
                        <Stack>
                            <Box>
                                <FormControl id="tags" >
                                    <FormLabel>Related Tags</FormLabel>
                                    <Input type="text" focusBorderColor='#1ed760' placeholder='comma separated values pls' name='tags' value={tags} onChange={(e) => {
                                        e.preventDefault();
                                        setTags(e.target.value)
                                    }} />
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={'#1ed760'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                onClick={handleSubmit}
                            >
                                Upload!
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Want to be on the receiving end? <Link fontSize={'lg'} color={'#1ed760'} as={NavLink} _hover={{ textDecoration: 'none' }} to={'/'}>Home</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}