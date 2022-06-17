import { Ref } from '@typegoose/typegoose';
import { CountModel } from '~/shared/model/count.model';
import { WriteBaseModel } from '~/shared/model/write-base.model';
import { TopicModel } from '../topic/topic.model';
import { Coordinate } from './models/coordinate.model';
import { NoteMusic } from './models/music.model';
export declare class NoteModel extends WriteBaseModel {
    title: string;
    nid: number;
    hide: boolean;
    password?: string;
    qa?: string;
    secret?: Date;
    mood?: string;
    weather?: string;
    hasMemory?: boolean;
    coordinates?: Coordinate;
    location?: string;
    count?: CountModel;
    music?: NoteMusic[];
    topicId?: Ref<TopicModel>;
    topic?: TopicModel;
    static get protectedKeys(): string[];
}
declare const PartialNoteModel_base: import("@nestjs/mapped-types").MappedType<Partial<NoteModel>>;
export declare class PartialNoteModel extends PartialNoteModel_base {
}
export {};
