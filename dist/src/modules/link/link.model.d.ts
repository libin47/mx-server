import { BaseModel } from '~/shared/model/base.model';
export declare enum LinkType {
    Friend = 0,
    Collection = 1
}
export declare enum LinkState {
    Pass = 0,
    Audit = 1,
    Outdate = 2,
    Banned = 3
}
export declare class LinkModel extends BaseModel {
    name: string;
    url: string;
    avatar?: string;
    description?: string;
    type?: LinkType;
    state: LinkState;
    email?: string;
    get hide(): boolean;
    set hide(value: boolean);
}
