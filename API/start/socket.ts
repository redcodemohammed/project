import Ws from 'App/Services/Ws'

import ChatController from 'App/Controllers/Ws/ChatController'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  ChatController.joinChat(socket)

  socket.on('send-message', (payload) => ChatController.sendMessage(socket, payload))
  socket.on('started-typing', () => ChatController.startedTyping(socket))
  socket.on('stopped-typing', () => ChatController.stoppedTyping(socket))
  socket.on('disconnect', () => {
    ChatController.disconnect(socket)
  })
})
