"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classToJsonSchema = exports.IsSchema = void 0;
const storage_js_1 = require("class-transformer/cjs/storage.js");
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
var class_validator_jsonschema_2 = require("class-validator-jsonschema");
Object.defineProperty(exports, "IsSchema", { enumerable: true, get: function () { return class_validator_jsonschema_2.JSONSchema; } });
function classToJsonSchema(clz) {
    const options = { ...defaultOptions, definitions: {} };
    const schema = (0, class_validator_jsonschema_1.targetConstructorToSchema)(clz, options);
    schema.definitions = options.definitions;
    return schema;
}
exports.classToJsonSchema = classToJsonSchema;
function nestedClassToJsonSchema(clz, options) {
    return (0, class_validator_jsonschema_1.targetConstructorToSchema)(clz, options);
}
const additionalConverters = {
    [class_validator_1.ValidationTypes.NESTED_VALIDATION]: (meta, options) => {
        if (typeof meta.target === 'function') {
            const typeMeta = options.classTransformerMetadataStorage
                ? options.classTransformerMetadataStorage.findTypeMetadata(meta.target, meta.propertyName)
                : null;
            const childType = typeMeta
                ? typeMeta.typeFunction()
                : getPropType(meta.target.prototype, meta.propertyName);
            const schema = targetToSchema(childType, options);
            if (schema.$ref && !options.definitions[childType.name]) {
                options.definitions[childType.name] = nestedClassToJsonSchema(childType, options);
            }
            return schema;
        }
    },
};
const defaultOptions = {
    classTransformerMetadataStorage: storage_js_1.defaultMetadataStorage,
    classValidatorMetadataStorage: (0, class_validator_1.getMetadataStorage)(),
    additionalConverters,
    doNotExcludeDecorator: true,
};
function getPropType(target, property) {
    return Reflect.getMetadata('design:type', target, property);
}
function targetToSchema(type, options) {
    if (typeof type === 'function') {
        if (type.prototype === String.prototype ||
            type.prototype === Symbol.prototype) {
            return { type: 'string' };
        }
        else if (type.prototype === Number.prototype) {
            return { type: 'number' };
        }
        else if (type.prototype === Boolean.prototype) {
            return { type: 'boolean' };
        }
        return { $ref: options.refPointerPrefix + type.name };
    }
}
