import { model, models, Schema } from 'mongoose'

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    gID: String,
    isVerified: {
        type: Boolean,
        default: false
    }
})

export const User = models?.NextAuthUser || model('NextAuthUser', schema)