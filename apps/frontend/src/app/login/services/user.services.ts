import { Injectable } from '@angular/core';
import { ResourceBaseHttp, Server } from '@andes/shared';

@Injectable()
export class UserService extends ResourceBaseHttp {
  protected url = '/users'; // URL to web api
  constructor(protected server: Server) {
    super(server);
  }
}
