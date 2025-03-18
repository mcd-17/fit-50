import { Server } from "socket.io";
import jwt from 'jsonwebtoken'

const secret = process.env.SECRET

export const socket = httpServer => {
    let io = new Server(httpServer, {
        cors: {
            origin: '*',
        }
    });

    let users = {}

    io.on('connection', (socket) => {
        console.log('connected');
        let token = socket.handshake?.auth?.token || socket.handshake?.headers?.token
        let user: any
        if (!!token) {
            try {
                user = jwt.verify(token, secret)
                let connected = users[user.uid] || []
                connected.push(socket.id)
                users[user.uid] = connected
            } catch (e) {
                return
            }
        }
        socket.on('disconnect', () => {
            if (!!user) {
                let connected = users[user.uid] || []
                connected = connected.filter(id => id !== socket.id)
                users[user.uid] = connected
            }
        });
    });

    const notify = (uid, event, data) => {
        let connected = users[uid] || []
        connected.forEach(id => {
            io.to(id).emit(event, data)
        })
    }
    return {
        io,
        notify
    }
}