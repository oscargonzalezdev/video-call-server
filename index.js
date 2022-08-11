// initialize dependencies
const app = require('express')();
const cors = require('cors')
require('dotenv').config()
app.use(cors())
const PORT = process.env.PORT

const server = require("https").createServer(app);

const io = require('socket.io')(server, {
    cors: {
        // allows acces for all origins
        // accept requests only from this
        // origin: "http://localhost:3000",
        origin: "https://video-call-app-delta.vercel.app",
        methods: ['GET', 'POST']
    }
})

app.get("/", (req, res) => {
    res.send('Server is running.')
})

// initialize socket handlers
// allows real time data transmition
io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
})

server.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`)
})