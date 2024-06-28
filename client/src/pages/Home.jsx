import { Box, Button, Card, CardBody, CardFooter, CardHeader, Center, Container, Flex, Heading, IconButton, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import instance from '../api/axios';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../helper/Loader';
import { FaHeadphones } from "react-icons/fa6";

const Home = () => {
    const [rooms, SetRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    const handleNav = (id) => {
        console.log(id);
        nav('/play/' + id);
    }

    useEffect(() => {
        fetchAllFiles();
    }, [])

    const fetchAllFiles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/file/all');
            SetRooms(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('network error');
        }
    }

    return (
        <Container maxW={'90%'} flexWrap={'wrap'} minHeight={'100vh'} >
            <Center padding={5}>
                <Heading>Our Collection of Sensational Audio Experiences!</Heading>
            </Center>
            {loading ? <Loader /> :
                <SimpleGrid spacing={4} minChildWidth='300px' overflow={'auto'} >
                    {rooms.map((room, id) =>
                    (<Card style={{display: 'flex',flexDirection: 'column',alignItems: 'flex-start',padding: '10px',border: '1px solid #ccc',borderRadius: '5px', margin: '10px', width: '300px',boxSizing: 'border-box'}} key={id}>
                        <CardHeader>
                            <Heading size='md'> Listen to {room.fileName} track </Heading>
                        </CardHeader>
                        <CardBody style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px'}}>
                            {room.tags.map((tag, id) => {
                                return <Box key={id} as='button' style={{backgroundColor: '#333', color: 'white', padding: '5px 10px', borderRadius: '3px',maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} borderRadius='md' bg='#242424' width={'auto'} color='white' mx={2} px={2} h={8}>
                                    {tag}
                                </Box>
                            })}
                        </CardBody>
                        <CardFooter>
                            <Button leftIcon={<FaHeadphones />} bg={'#1ed760'} onClick={() => handleNav(room.publicId)}>Listen here!</Button>
                        </CardFooter>
                    </Card>
                    ))}
        </SimpleGrid>
            }
        </Container >
    )
}

export default Home