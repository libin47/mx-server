import { ConfigsService } from '~/modules/configs/configs.service';
export declare class TextMacroService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigsService);
    private ifConditionGrammar;
    private generateFunctionContext;
    replaceTextMacro<T extends object>(text: string, model: T, extraContext?: Record<string, any>): Promise<string>;
}
