import { ReturnModelType } from '@typegoose/typegoose';
import { TopicModel } from './topic.model';
export declare class TopicService {
    private readonly topicModel;
    constructor(topicModel: ReturnModelType<typeof TopicModel>);
    get model(): ReturnModelType<typeof TopicModel, import("@typegoose/typegoose/lib/types").BeAnObject>;
}
