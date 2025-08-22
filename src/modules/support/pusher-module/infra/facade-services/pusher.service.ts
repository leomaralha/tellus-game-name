import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly pusher: Pusher;

  constructor(private readonly options: Pusher.Options) {
    this.pusher = new Pusher(this.options);
  }

  getPusherInstance() {
    return this.pusher;
  }

  authorizeChannel(
    socketId: string,
    channelName: string,
    data?: Pusher.PresenceChannelData,
  ) {
    return this.pusher.authorizeChannel(socketId, channelName, data);
  }

  async trigger<T = any>(
    channel: string | string[],
    event: string,
    data?: T,
    socketId?: string,
  ) {
    return await this.pusher.trigger(channel, event, data ?? '', {
      socket_id: socketId,
    });
  }

  authenticateUser(socketId: string, userData: Pusher.UserChannelData) {
    return this.pusher.authenticateUser(socketId, userData);
  }
}
