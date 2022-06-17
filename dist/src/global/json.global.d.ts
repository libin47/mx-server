declare global {
    interface JSON {
        safeParse: typeof JSON.parse;
    }
}
export declare const registerJSONGlobal: () => void;
