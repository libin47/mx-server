import { SayModel } from './say.model';
export declare class SayService {
    private readonly sayModel;
    constructor(sayModel: MongooseModel<SayModel>);
    get model(): MongooseModel<SayModel>;
}
