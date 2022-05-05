import {ObjectId} from "mongodb";
import {model, Schema, SchemaTypes} from "mongoose";
import {BetaModel} from "./beta";

export interface EmbedBetaInterface {
    id?: ObjectId
}

interface AlphaInterface {
    betaId: ObjectId
    betaIds: ObjectId[]
    beta: EmbedBetaInterface
}

export const EmbedBetaSchema = new Schema<EmbedBetaInterface>({
    id: {
        type: SchemaTypes.ObjectId,
        ref: () => BetaModel,
        exists: true
    }
}, {_id: false})

const AlphaSchema = new Schema<AlphaInterface>({
    betaId: {
        type: ObjectId,
        ref: () => BetaModel,
        exists: true
    },
    betaIds: {
        type: [ObjectId],
        ref: () => BetaModel,
        exists: true
    },
    beta: {
        type: EmbedBetaSchema,
        required: true
    }
})

export const AlphaModel = model("Alpha", AlphaSchema, "Alpha")
