"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbToHex = exports.getAverageRGB = exports.pickImagesFromMarkdown = void 0;
const get_image_colors_1 = __importDefault(require("get-image-colors"));
const marked_1 = require("marked");
const pickImagesFromMarkdown = (text) => {
    const ast = marked_1.marked.lexer(text);
    const images = [];
    function pickImage(node) {
        if (node.type === 'image') {
            images.push(node.href);
            return;
        }
        if (node.tokens && Array.isArray(node.tokens)) {
            return node.tokens.forEach(pickImage);
        }
    }
    ast.forEach(pickImage);
    return images;
};
exports.pickImagesFromMarkdown = pickImagesFromMarkdown;
async function getAverageRGB(buffer, type) {
    if (!buffer) {
        return undefined;
    }
    try {
        const colors = await (0, get_image_colors_1.default)(buffer, type);
        return colors[0].hex();
    }
    catch (err) {
        console.error(err.message);
        return undefined;
    }
}
exports.getAverageRGB = getAverageRGB;
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? `0${hex}` : hex;
}
function rgbToHex({ r, g, b }) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
exports.rgbToHex = rgbToHex;
