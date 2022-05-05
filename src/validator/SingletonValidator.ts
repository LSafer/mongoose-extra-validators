import mongoose, {Connection, Document, Model, Schema} from "mongoose";
import {Mode} from "fs";

/**
 * The type of `singleton` option.
 */
export type SchemaSingletonOption =
    boolean | (() => boolean) | [boolean, string] | [() => boolean, string]

/**
 * The options that can be passed to {@link SingletonValidatorPlugin}`.
 */
export interface SingletonValidatorPluginOptions {
}

/**
 * A plugin applying singleton validator to the given `schema`.
 */
export function SingletonValidatorPlugin(schema: Schema, options: SingletonValidatorPluginOptions) {
    for (const [path, schemaType] of Object.entries(schema.paths)) {
        // recursive applying
        if (schemaType.schema) {
            schema.plugin(SingletonValidatorPlugin, {
                ...options, deduplicate: true
            })
        }

        // conditional applying
        if (schemaType.options.singleton) {
            // gather options
            const singletonOption: SchemaSingletonOption = schemaType.options.singleton

            // normalize static variables
            const message = SchemaSingletonOption.normalizeMessage(singletonOption)

            schemaType.validators.push({
                message, async validator(value) {
                    // normalize dynamic variables
                    const enabled = SchemaSingletonOption.normalizeValue(singletonOption, this)

                    // if not enabled
                    if (!enabled) {
                        return true
                    }

                    return !await (this.constructor as Model<any>).exists({
                        [path]: value
                    })
                }
            })
        }
    }
}

// Internal

/**
 * Utilities for {@link SingletonValidatorPluginOptions}.
 */
namespace SingletonValidatorPluginOptions {
}


/**
 * Utilities for {@link SchemaSingletonOption}.
 */
namespace SchemaSingletonOption {
    export function normalizeMessage(
        singletonOption: SchemaSingletonOption
    ): string {
        return Array.isArray(singletonOption) ? singletonOption[1] : `Error, Duplicate document with same value found.`
    }

    export function normalizeValue(
        singletonOption: SchemaSingletonOption,
        self: Document
    ): boolean {
        let valueOrFunction: boolean | (() => boolean)

        if (Array.isArray(singletonOption)) {
            valueOrFunction = singletonOption[0]
        } else {
            valueOrFunction = singletonOption
        }

        if (typeof valueOrFunction === 'function') {
            return valueOrFunction.call(self)
        }

        return valueOrFunction
    }
}

