import TokenModel from "../models/Tokens"

export const create = async (req, res) => {
    try {
        const { name, token } = req.body

        const doc = new TokenModel({
            name, token
        })

        const response = await doc.save()
    } catch (error) {

    }
}