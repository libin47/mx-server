import { AggregateService } from '../aggregate/aggregate.service';
export declare class SitemapController {
    private readonly aggregateService;
    constructor(aggregateService: AggregateService);
    getSitemap(): Promise<string>;
}
