import {model, Schema, SchemaTypes} from "mongoose";

interface GammaInterface {
    message: string
}

const GammaSchema = new Schema<GammaInterface>({
    message: {
        type: SchemaTypes.String,
        singleton: true
    }
})

export const GammaModel = model("Gamma", GammaSchema, "Gamma")
