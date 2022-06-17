import { AggregateService } from '../aggregate/aggregate.service';
import { ConfigsService } from '../configs/configs.service';
import { MarkdownService } from '../markdown/markdown.service';
export declare class FeedController {
    private readonly aggregateService;
    private readonly configs;
    private readonly markdownService;
    constructor(aggregateService: AggregateService, configs: ConfigsService, markdownService: MarkdownService);
    rss(): Promise<string>;
}
