import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class WSExceptionsFilter extends BaseWsExceptionFilter
  implements WsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
