import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
});
const Score = mongoose.model('Score', scoreSchema);
export default Score;
