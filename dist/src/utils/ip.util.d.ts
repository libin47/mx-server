/// <reference types="node" />
import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';
import { URL } from 'url';
export declare const getIp: (request: FastifyRequest | IncomingMessage) => string;
export declare const parseRelativeUrl: (path: string) => URL;
