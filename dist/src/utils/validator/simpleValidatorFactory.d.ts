import { ValidationOptions } from 'class-validator';
export declare function validatorFactory(validator: (value: any) => boolean): (validationOptions?: ValidationOptions) => (object: Object, propertyName: string) => void;
