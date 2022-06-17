import { IdempotenceOption } from '../interceptors/idempotence.interceptor';
export declare const Paginator: MethodDecorator;
export declare const Bypass: MethodDecorator;
export declare interface FileDecoratorProps {
    description: string;
}
export declare function FileUpload({ description }: FileDecoratorProps): <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol | undefined, descriptor?: TypedPropertyDescriptor<Y> | undefined) => void;
export declare const Idempotence: (options?: IdempotenceOption) => MethodDecorator;
export declare const HTTPDecorators: {
    Paginator: MethodDecorator;
    Bypass: MethodDecorator;
    FileUpload: typeof FileUpload;
    Idempotence: (options?: IdempotenceOption) => MethodDecorator;
};
