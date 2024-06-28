require('dotenv').config();
const express = require('express');
const fs = require('fs');
const http = require('http')
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: 'http://localhost:3000',
    pingTimeout: 60000
});
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const fileRouter = require('./routes/fileRouter');
const File = require('./models/File');

app.use(express.urlencoded({ extended: true, limit: "300mb" }));
app.use(express.json({ limit: "3000mb" }));
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET", "HEAD", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use('/file', fileRouter);

io.on('connection', async (socket) => {
    console.log('WebSocket client connected', socket.id);

    socket.on('join', async (room) => { // room is the publicId of the document we have to search in mongodb
        console.log(`user ${socket.id} joined ${room}`);

        try {
            const fileDoc = await File.findOne({ publicId: room });
            console.log(fileDoc);
            const response = await axios({
                url: fileDoc.fileUrl,
                method: 'GET',
                responseType: 'stream'
            });
    
            response.data.on('data', (chunk) => {
                // console.log('Received chunk:', chunk);
                socket.emit('audio', chunk);
            });
    
            response.data.on('end', () => {
                console.log('File sent successfully');
            });
    
            response.data.on('error', (err) => {
                console.error('Audio stream error:', err);
            });
        } catch (err) {
            console.log(err.message)
        }
        // const audioStream = fs.createReadStream(AUDIO_FILE_PATH);

    })

    socket.on('disconnect', () => {
        console.log('WebSocket client disconnected');
    });
});

mongoose.connect('mongodb+srv://pranauv1803:xHQme7AEzn9vjPoM@cluster0.usk541a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    server.listen(5000, () => {
        console.log(`server started in port 5000`);
    })
}).catch(err => console.log(err.message))