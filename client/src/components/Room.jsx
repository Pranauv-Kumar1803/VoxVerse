import { Box, Card, CardBody, CardHeader, Center, Container, Heading, List, ListIcon, ListItem, Stack, StackDivider, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import Loader from '../helper/Loader';
import axios from 'axios';
import { IoIosMusicalNote } from "react-icons/io";
let socket = io('http://localhost:5000');

const Room = () => {
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [mediaSource, setMediaSource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});

    const params = useParams();

    var buffer = null;
    var queue = [];

    // console.log(params);

    useEffect(() => {
        getDetails(params.room);
    }, []);

    const getDetails = async (room) => {
        try {
            const res = await axios.get('http://localhost:5000/file/' + room);
            setDetails(res.data);
            setLoading(false);
            socket.emit('join', (params.room));
        } catch (err) {
            console.log('error');
        }
    }

    useEffect(() => {
        var mediaSrc = new MediaSource();
        setMediaSource(mediaSrc);
        // console.log(mediaSrc.readyState)
        mediaSrc.addEventListener('sourceopen', () => {
            if (navigator.userAgent.indexOf("Firefox") != -1) {
                buffer = mediaSrc.addSourceBuffer('audio/webm');
            }
            else buffer = mediaSrc.addSourceBuffer('audio/mpeg');
            buffer.mode = 'sequence';

            buffer.addEventListener('update', function () {
                updateBuffer();
            });

            buffer.addEventListener('updateend', function () {
                updateBuffer();
            });

            initWS();
        })
        let audio = document.getElementById('audio-player');
        setAudio(audio);

        audio.src = window.URL.createObjectURL(mediaSrc);
    }, []);

    function updateBuffer() {
        if (queue.length > 0 && !buffer.updating) {
            buffer.appendBuffer(queue.shift());
        }
    }

    function initWS() {

        socket.on('audio', (chunk) => {
            try {
                if (buffer.updating || queue.length > 0) {
                    queue.push(chunk);
                } else {
                    buffer.appendBuffer(chunk);
                    audio.play();
                }
            } catch (error) {
                console.error('Error appending audio chunk:', error);
            }
        });

        socket.on('connect', () => {
            console.log('Connected to server');
            socket.emit('listen');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }

    return (
        <Container padding={10} minH={'100vh'}
            margin={'auto'}
            w={'auto'}>
            <Center padding={10}>
                <Heading> A few Details about this Audio Track! </Heading>
            </Center>
            {loading ? <Loader /> :
                <Center padding={5}>
                    <Card>
                        <CardHeader>
                            <Heading size='md'>File Details</Heading>
                        </CardHeader>

                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                        File Name
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                        {details.fileName}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                        Author / Uploader
                                    </Heading>
                                    <Text pt='2' fontSize='sm'>
                                        {details.uploadedUser}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                        Tags Associated
                                    </Heading>
                                    <List spacing={3}>
                                        {details.tags.map((tag, id) => {
                                            return <ListItem key={id}>
                                                <ListIcon as={IoIosMusicalNote} color='green.500' />
                                                {tag}
                                            </ListItem>
                                        })}
                                    </List>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </Center>
            }
            <Center>
                <audio src='' controls id='audio-player' autoPlay></audio>
            </Center>
        </Container>
    )
}

export default Room