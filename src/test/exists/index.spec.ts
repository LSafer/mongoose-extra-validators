import mongoose from "mongoose";
import {ExtraValidatorsPlugin} from "../../index";

mongoose.plugin(ExtraValidatorsPlugin)
mongoose.connect('mongodb://localhost:27017/test-mongoose-extra-validators')

import {BetaModel} from "./beta";
import {AlphaModel} from "./alpha";
import {ObjectId} from "mongodb";

describe("Exists Validator", function () {
    describe("Perfect conditions", function () {
        it('Should not throw anything in perfect conditions', async function () {
            let betaA
            let betaB
            let betaC
            let alphaA

            try {
                betaA = new BetaModel()
                betaA.message = "Beta A"
                await betaA.save()

                betaB = new BetaModel()
                betaB.message = "Beta B"
                await betaB.save()

                betaC = new BetaModel()
                betaC.message = "Beta C"
                await betaC.save()

                alphaA = new AlphaModel()
                alphaA.betaId = betaC._id
                alphaA.betaIds = [betaA._id, betaB._id]
                alphaA.beta = {id: betaC._id}
                await alphaA.save()
            } finally {
                await betaA?.remove()
                await betaB?.remove()
                await betaC?.remove()
                await alphaA?.remove()
            }
        })
    })

    describe("None-existing ids", function () {
        it('should throw when pointing to a single none-existing document', async function () {
            let alphaA

            try {
                alphaA = new AlphaModel()
                alphaA.betaId = new ObjectId()

                try {
                    await alphaA.save()
                } catch (error) {
                    return
                }

                throw new Error("Validator didnt throw an exception")
            } finally {
                alphaA?.remove()
            }
        });
        it('should throw when pointing to mixed multiple none-existing documents', async function () {
            let betaA
            let alphaA

            try {
                betaA = new BetaModel()
                betaA.message = "Beta A"
                await betaA.save()

                alphaA = new AlphaModel()
                alphaA.betaIds = [
                    betaA._id, betaA._id, new ObjectId()
                ]

                try {
                    await alphaA.save()
                } catch (error) {
                    return
                }

                throw new Error("Validator didnt throw an exception")
            } finally {
                await betaA?.remove()
                await alphaA?.remove()
            }
        })
        it('should throw when pointing to nested none-existing document', async function () {
            let alphaA

            try {
                alphaA = new AlphaModel()
                alphaA.beta = {
                    id: new ObjectId()
                }

                try {
                    await alphaA.save()
                } catch (error) {
                    return
                }

                throw new Error("Validator didnt throw an exception")
            } finally {
                await alphaA?.remove()
            }
        })
    })
})
