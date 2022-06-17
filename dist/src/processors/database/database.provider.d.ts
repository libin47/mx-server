import { mongoose } from '@typegoose/typegoose';
export declare const databaseProvider: {
    provide: string;
    useFactory: () => Promise<mongoose.Connection>;
};
