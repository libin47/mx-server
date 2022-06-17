import { FastifyReply, FastifyRequest } from 'fastify';
import { CacheService } from '~/processors/cache/cache.service';
import { PageProxyDebugDto } from './pageproxy.dto';
import { PageProxyService } from './pageproxy.service';
export declare class PageProxyController {
    private readonly cacheService;
    private readonly service;
    constructor(cacheService: CacheService, service: PageProxyService);
    proxyAdmin(cookies: KV<string>, query: PageProxyDebugDto, reply: FastifyReply): Promise<undefined>;
    getLocalBundledAdmin(reply: FastifyReply): Promise<undefined>;
    proxyAssetRoute(request: FastifyRequest, reply: FastifyReply): Promise<undefined>;
}
