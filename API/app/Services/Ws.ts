import { Server } from 'socket.io'
// import AdonisServer from '@ioc:Adonis/Core/Server'
import Logger from '@ioc:Adonis/Core/Logger'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(5555, {
      cors: {
        origin: '*',
      },
    })
    Logger.info('WS service started')
  }
}

export default new Ws()
