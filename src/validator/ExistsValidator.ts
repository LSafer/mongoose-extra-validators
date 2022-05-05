import mongoose, {Document, Model, Connection, mongo, Schema, Types} from "mongoose";
import {Mode} from "fs";

/**
 * The type of `exists` option.
 */
export type SchemaExistsOption =
    boolean | (() => boolean) | [boolean, string] | [() => boolean, string]

/**
 * The options that can be passed to {@link ExistsValidatorPlugin}`.
 */
export interface ExistsValidatorPluginOptions {
    /**
     * The connection to be used to verify. (default to mongoose.connection)
     */
    connection?: Connection
}

/**
 * A plugin applying exists validator to the given `schema`.
 */
export function ExistsValidatorPlugin(schema: Schema, options: ExistsValidatorPluginOptions) {
    // normalize options
    const connection = ExistsValidatorPluginOptions.normalizeConnection(options)

    for (const schemaType of Object.values(schema.paths)) {
        // recursive applying
        if (schemaType.schema) {
            schema.plugin(ExistsValidatorPlugin, {
                ...options, deduplicate: true
            })
        }

        // conditional applying
        if (schemaType.options.exists) {
            // gather options
            const existsOption: SchemaExistsOption = schemaType.options.exists
            const refOption: SchemaRefOption = schemaType.options.ref

            // normalize static variables
            const message = SchemaExistsOption.normalizeMessage(existsOption)

            schemaType.validators.push({
                message, async validator(value) {
                    // if value is nullish
                    if (!value || Array.isArray(value) && value.length === 0) {
                        return true
                    }

                    // normalize dynamic variables
                    const enabled = SchemaExistsOption.normalizeValue(existsOption, this)
                    const model = SchemaRefOption.normalizeModel(refOption, connection, this, value)

                    // if not enabled
                    if (!enabled) {
                        return true
                    }

                    // if value is an array
                    if (Array.isArray(value)) {
                        // reduce duplicates and validate
                        const valueAsSet = [...new Set(value)]
                        const count = await model.count({_id: {$in: valueAsSet}})
                        return count === valueAsSet.length
                    }

                    // if value is a single id
                    return model.exists({_id: value});
                }
            })
        }
    }
}

// Internal

/**
 * The type of `ref` option.
 */
type SchemaRefOption =
    string | Model<any> | ((this: any, doc: any) => string | Model<any>)

/**
 * Utilities for {@link ExistsValidatorPluginOptions}.
 */
namespace ExistsValidatorPluginOptions {
    export function normalizeConnection(
        options: ExistsValidatorPluginOptions
    ): Connection {
        return options.connection || mongoose.connection
    }
}

/**
 * Utilities for {@link SchemaRefOption}.
 */
namespace SchemaRefOption {
    export function normalizeModel(
        refOption: SchemaRefOption,
        connection: Connection,
        self: Document,
        value: any
    ): Model<any> {
        let modelOrModelName: Model<any> | string

        if (typeof refOption === 'function') {
            const fn = refOption as ((this: any, doc: any) => string | Model<any>)
            modelOrModelName = fn.call(self, value)
        } else {
            modelOrModelName = refOption
        }

        if (typeof modelOrModelName === 'string') {
            return connection.model(modelOrModelName)
        } else {
            return modelOrModelName
        }
    }
}

/**
 * Utilities for {@link SchemaExistsOption}.
 */
namespace SchemaExistsOption {
    export function normalizeMessage(
        existsOption: SchemaExistsOption
    ): string {
        return Array.isArray(existsOption) ? existsOption[1] : `Error, Id referencing none existing document.`
    }

    export function normalizeValue(
        existsOption: SchemaExistsOption,
        self: Document
    ): boolean {
        let valueOrFunction: boolean | (() => boolean)

        if (Array.isArray(existsOption)) {
            valueOrFunction = existsOption[0]
        } else {
            valueOrFunction = existsOption
        }

        if (typeof valueOrFunction === 'function') {
            return valueOrFunction.call(self)
        }

        return valueOrFunction
    }

}
