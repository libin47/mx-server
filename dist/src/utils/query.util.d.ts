export declare function addConditionToSeeHideContent(canSee: boolean): {
    $or: {
        hide: boolean;
    }[];
    hide?: undefined;
} | {
    hide: boolean;
    $or?: undefined;
};
export declare function addConditionCanSee(canSee: boolean): {
    $or: {
        hide: boolean;
    }[];
    hide?: undefined;
} | {
    hide: boolean;
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
