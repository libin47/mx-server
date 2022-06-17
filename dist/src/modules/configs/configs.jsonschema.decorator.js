"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSchemaNumberField = exports.JSONSchemaToggleField = exports.JSONSchemaArrayField = exports.JSONSchemaHalfGirdPlainField = exports.JSONSchemaPlainField = exports.JSONSchemaPasswordField = exports.halfFieldOption = void 0;
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
exports.halfFieldOption = {
    'ui:options': { halfGrid: true },
};
const JSONSchemaPasswordField = (title, schema) => {
    return (0, class_validator_jsonschema_1.JSONSchema)({
        title,
        ...schema,
        'ui:options': { type: 'password', ...schema === null || schema === void 0 ? void 0 : schema['ui:options'] },
    });
};
exports.JSONSchemaPasswordField = JSONSchemaPasswordField;
const JSONSchemaPlainField = (title, schema) => (0, class_validator_jsonschema_1.JSONSchema)({
    title,
    ...schema,
});
exports.JSONSchemaPlainField = JSONSchemaPlainField;
const JSONSchemaHalfGirdPlainField = (...rest) => exports.JSONSchemaPlainField.call(null, ...rest, exports.halfFieldOption);
exports.JSONSchemaHalfGirdPlainField = JSONSchemaHalfGirdPlainField;
const JSONSchemaArrayField = (title, schema) => (0, class_validator_jsonschema_1.JSONSchema)({
    title,
    ...schema,
});
exports.JSONSchemaArrayField = JSONSchemaArrayField;
const JSONSchemaToggleField = (title, schema) => (0, class_validator_jsonschema_1.JSONSchema)({
    title,
    ...schema,
});
exports.JSONSchemaToggleField = JSONSchemaToggleField;
const JSONSchemaNumberField = (title, schema) => (0, class_validator_jsonschema_1.JSONSchema)({
    title,
    ...schema,
});
exports.JSONSchemaNumberField = JSONSchemaNumberField;
