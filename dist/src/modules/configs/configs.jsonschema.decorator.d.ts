import { DecoratorSchema } from 'class-validator-jsonschema/build/decorators';
export declare const halfFieldOption: {
    'ui:options': {
        halfGrid: boolean;
    };
};
export declare const JSONSchemaPasswordField: (title: string, schema?: DecoratorSchema) => (target: object | Function, key?: string | undefined) => void;
export declare const JSONSchemaPlainField: (title: string, schema?: DecoratorSchema) => (target: object | Function, key?: string | undefined) => void;
export declare const JSONSchemaHalfGirdPlainField: typeof JSONSchemaPlainField;
export declare const JSONSchemaArrayField: (title: string, schema?: DecoratorSchema) => (target: object | Function, key?: string | undefined) => void;
export declare const JSONSchemaToggleField: (title: string, schema?: DecoratorSchema) => (target: object | Function, key?: string | undefined) => void;
export declare const JSONSchemaNumberField: (title: string, schema?: DecoratorSchema) => (target: object | Function, key?: string | undefined) => void;
