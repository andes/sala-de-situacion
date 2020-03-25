import { Request, Response } from '@andes/api-tool';
import { MongoQuery, ResourceBase, ResourceNotFound } from '@andes/core';
import { User } from './user.schema';
import { authenticate } from '../application';
import { Types } from 'mongoose';

class UsersResource extends ResourceBase {
  Model = User;
  resourceName = 'users';
  resourceModule = 'auth';
  middlewares = [authenticate()];
  searchFileds = {
    apellido: MongoQuery.partialString,
    nombre: MongoQuery.partialString,
    documento: MongoQuery.partialString,
    search: ['apellido', 'nombre', 'documento', 'email'],
    validationToken: MongoQuery.equalMatch,
    active: MongoQuery.equalMatch
  };

  async validateUser(token: string, req: Request) {
    const users = await this.search(
      { validationToken: token, active: false },
      {},
      req
    );
    if (users.length > 0) {
      const user = users[0];
      const data = { validationToken: null, active: true };
      return await this.update(user._id, data, req);
    }
    throw new ResourceNotFound();
  }
}

export const UsersCtr = new UsersResource();

export const UsersRouter = UsersCtr.makeRoutes();
