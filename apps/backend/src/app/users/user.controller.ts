import { Request, Response } from '@andes/api-tool';
import { MongoQuery, ResourceBase, ResourceNotFound } from '@andes/core';
import { User } from './user.schema';
import { authenticate } from '../application';

class UsersResource extends ResourceBase {
  Model = User;
  resourceName = 'users';
  middlewares = [authenticate()];
  searchFileds = {
    apellido: MongoQuery.partialString,
    nombre: MongoQuery.partialString,
    documento: MongoQuery.partialString,
    search: ['apellido', 'nombre', 'documento', 'email']
  };
}

export const UsersCtr = new UsersResource();

export const UsersRouter = UsersCtr.makeRoutes();
