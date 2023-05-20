import { type Socket } from 'socket.io'
import Logger from '@ioc:Adonis/Core/Logger'
import Encryption from '@ioc:Adonis/Core/Encryption'
import User from 'App/Models/User'

interface Message {
  date: Date
  sender: User
  text: string
  seen: boolean
  mine: boolean
  id: number
}

export default class MedicinesController {
  public static async joinChat(socket: Socket) {
    const user = await this.validate(socket)
    const { roomID } = socket.handshake.query

    socket.join(roomID as string)
    Logger.info(`user ${user?.name} connected to room ${roomID}`)
  }

  public static async sendMessage(socket: Socket, message: Message) {
    const user = await this.validate(socket)
    socket.rooms.forEach((room) => {
      socket.to(room).emit('get-message', message)
    })
    Logger.info(`${user?.name} says ${message.text}`)
  }

  public static async startedTyping(socket: Socket) {
    const user = await this.validate(socket)
    socket.rooms.forEach((room) => {
      socket.broadcast.to(room).emit('started-typing')
    })
    Logger.info(`${user?.name} is typing...`)
  }
  public static async stoppedTyping(socket: Socket) {
    const user = await this.validate(socket)
    socket.rooms.forEach((room) => {
      socket.broadcast.to(room).emit('stopped-typing')
    })
    Logger.info(`${user?.name} stopped typing`)
  }

  public static async disconnect(socket: Socket) {
    Logger.info(`${socket.id} disconnected`)
  }

  private static async validate(socket: Socket) {
    const { token } = socket.handshake.auth
    try {
      const userID = Encryption.decrypt(token)
      const user = await User.findBy('id', userID)
      return user
    } catch {}
  }
}
