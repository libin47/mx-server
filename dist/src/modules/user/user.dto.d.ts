declare class UserOptionDto {
    readonly introduce?: string;
    readonly mail?: string;
    readonly url?: string;
    name?: string;
    readonly avatar?: string;
    readonly socialIds?: Record<string, any>;
}
export declare class UserDto extends UserOptionDto {
    readonly username: string;
    readonly password: string;
}
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class UserPatchDto extends UserOptionDto {
    readonly username: string;
    readonly password: string;
}
export {};
