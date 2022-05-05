import mongoose, {mongo} from "mongoose";
import {ExtraValidatorsPlugin} from "../../index";

mongoose.plugin(ExtraValidatorsPlugin)
mongoose.connect('mongodb://localhost:27017/test-mongoose-extra-validators')

import {GammaModel} from "./gamma";

describe("Singleton Validator", function () {
    describe("Perfect conditions", function () {
        it("Should not throw anything in perfect conditions", async function () {
            let gamma0
            let gamma1

            try {
                gamma0 = new GammaModel()
                gamma0.message = "Gamma 0"
                await gamma0.save()

                gamma1 = new GammaModel()
                gamma1.message = "Gamma 1"
                await gamma1.save()
            } finally {
                // clean
                await gamma0?.remove()
                await gamma1?.remove()
            }
        })
    })

    describe("Duplicate value", function () {
        it("Should throw when similar field value exists", async function () {
            let gamma0
            let gamma1

            try {
                gamma0 = new GammaModel()
                gamma0.message = "Gamma"
                await gamma0.save()

                gamma1 = new GammaModel()
                gamma1.message = "Gamma"

                try {
                    await gamma1.save()
                } catch (error) {
                    return
                }

                throw new Error("Singleton validator didnt throw an exception")
            } finally {
                // clean
                await gamma0?.remove()
                await gamma1?.remove()
            }
        })
    })
})
