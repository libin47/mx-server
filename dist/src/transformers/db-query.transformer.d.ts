export declare function addHidePasswordAndHideCondition(canSee: boolean): {
    $or: {
        hide: boolean;
    }[];
    hide?: undefined;
    password?: undefined;
} | {
    hide: boolean;
    password: undefined;
    $or?: undefined;
};
export declare const addYearCondition: (year?: number) => {
    created?: undefined;
} | {
    created: {
        $gte: Date;
        $lte: Date;
    };
};
