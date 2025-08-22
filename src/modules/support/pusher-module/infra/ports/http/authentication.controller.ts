import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ValidatePusherWebhook } from '../../decorators';
import { PusherService } from '../../facade-services/pusher.service';

interface UserAuthRequest {
  socket_id: string;
}

interface UserData {
  id: string;
  user_info?: {
    name?: string;
    email?: string;
    [key: string]: any;
  };
  watchlist?: string[];
}

interface UserAuthResponse {
  auth: string;
  user_data: string;
}

@Controller('pusher')
@ValidatePusherWebhook()
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly pusherService: PusherService) {}

  @Post('user-auth')
  authenticateUser(@Body() body: UserAuthRequest): UserAuthResponse {
    const { socket_id } = body;

    if (!socket_id) {
      this.logger.error('Missing socket_id in authentication request');
      throw new HttpException(
        'Missing socket_id parameter',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const userData: UserData = {
        //@todo
        id: 'user_123',
        user_info: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        watchlist: [],
      };

      if (
        !userData.id ||
        typeof userData.id !== 'string' ||
        userData.id.trim() === ''
      ) {
        throw new Error('Invalid user ID');
      }

      const authResponse = this.pusherService.authenticateUser(
        socket_id,
        userData,
      );

      this.logger.log(`User authenticated successfully: ${userData.id}`);

      return authResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        this.logger.error('Authentication failed:', error.message || error);
        throw error;
      }
      throw new HttpException('Authentication failed', HttpStatus.FORBIDDEN);
    }
  }
}
