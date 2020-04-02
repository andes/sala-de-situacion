import { Router, NextFunction } from 'express';
import { ApiBootstrap } from '@andes/api-tool/build/bootstrap';
import { environment } from '../environments/environment';
import { apiOptionsMiddleware, Request, Response } from '@andes/api-tool';

const shiroTrie = require('shiro-trie');

const info = {
    name: 'sala-de-situacion',
    version: '1.0.0'
};

const port = environment.port;
const host = environment.host;
const key = environment.key;

export const application = new ApiBootstrap(info, { port, host, key });
application.add(apiOptionsMiddleware as Router);

export const loadUserMiddleware = async function(req: Request, res: Response, next: NextFunction) {
    // Esta resuelto así por un tema de circle dependecy.
    // [TODO] queda pendiente como relacionar el Bootstrap atomatico con el ResourceBase

    const { User } = require('./users/user.schema');
    const userId = req.user.user_id;
    const user = await User.findById(userId, {
        email: 1,
        nombre: 1,
        apellido: 1,
        documento: 1,
        permisos: 1
    });
    if (user) {
        req.user = user;
        return next();
    } else {
        return next(403);
    }
};

export const authenticate = () => {
    if (environment.key) {
        return [application.authenticate(), loadUserMiddleware];
    } else {
        // Bypass Auth
        return (req, res, next) => next();
    }
};

export const checkPermission = (req: Request, permiso: string) => {
    if (req.user && req.user.permisos) {
        const shiro = shiroTrie.new();
        shiro.add(req.user.permisos);
        return shiro.permissions(permiso);
    }
};
