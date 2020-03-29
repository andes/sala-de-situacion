import { Router } from 'express';
import { ApiBootstrap } from '@andes/api-tool/build/bootstrap';
import { environment } from '../environments/environment';
import { apiOptionsMiddleware, Request } from '@andes/api-tool';

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

export const authenticate = () => {
    if (environment.key) {
        return application.authenticate();
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
