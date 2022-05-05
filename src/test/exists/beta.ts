import {model, Schema, SchemaTypes} from "mongoose";

export interface BetaInterface {
    message: string
}

export const BetaSchema = new Schema<BetaInterface>({
    message: {
        type: SchemaTypes.String,
        required: true
    }
})

export const BetaModel = model("Beta", BetaSchema, "Beta")
