import {SchemaExistsOption} from "./validator/ExistsValidator";
import {SchemaSingletonOption} from "./validator/SingletonValidator";

declare module 'mongoose' {
    export class SchemaTypeOptions<T> {
        /**
         * When true, a validator will be added to ensure a document exists on
         * `ref` with its id being the value of this field.
         */
        exists?: SchemaExistsOption
        /**
         * When true, a validator will be added to ensure a document does not
         * exist with the same value in this field.
         */
        singleton?: SchemaSingletonOption
    }
}
