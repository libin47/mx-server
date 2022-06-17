export declare function getFolderSize(folderPath: string): Promise<string>;
export declare const formatByteSize: (byteSize: number) => string;
export declare const isBuiltinModule: (module: string, ignoreList?: string[]) => boolean;
export declare type PackageManager = 'pnpm' | 'yarn' | 'npm';
export declare const installPKG: (name: string, cwd: string) => Promise<void>;
