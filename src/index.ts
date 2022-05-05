import {Schema} from "mongoose";
import {ExistsValidatorPlugin, ExistsValidatorPluginOptions} from "./validator/ExistsValidator";
import {SingletonValidatorPlugin, SingletonValidatorPluginOptions} from "./validator/SingletonValidator";

/**
 * The options passed to `ExtraValidatorsPlugin`
 */
export interface ExtraValidatorsPluginOptions {
    /**
     * The options to be passed to the exists plugin.
     */
    existsPlugin?: ExistsValidatorPluginOptions
    /**
     * The options to be passed to the singleton plugin.
     */
    singletonPlugin?: SingletonValidatorPluginOptions
}

/**
 * A schema plugin applying extra validators logic.
 */
export function ExtraValidatorsPlugin(schema: Schema, options: ExtraValidatorsPluginOptions) {
    // plugins
    schema.plugin(ExistsValidatorPlugin, {...options?.existsPlugin, deduplicate: true})
    schema.plugin(SingletonValidatorPlugin, {...options?.singletonPlugin, deduplicate: true})

    for (const schemaType of Object.values(schema.paths)) {
        // recursive applying
        if (schemaType.schema) {
            schema.plugin(ExtraValidatorsPlugin, {
                ...options, deduplicate: true
            })
        }
    }
}
