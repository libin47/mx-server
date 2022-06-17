/// <reference types="node" />
export declare const pickImagesFromMarkdown: (text: string) => string[];
export declare function getAverageRGB(buffer: Buffer, type: string): Promise<string | undefined>;
export declare function rgbToHex({ r, g, b }: {
    r: number;
    g: number;
    b: number;
}): string;
