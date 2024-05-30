import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    Number: {
        type: Number
    },
    Title: {
        type: String,
        required: true
    },
    Composer: {
        type: String
    },
    Arranger: {
        type: String
    },
    Publisher: {
        type: String
    },
    Style: {
        type: String
    },
    Grade: {
        type: Number
    },
    Time: {
        type: String
    },
    Format: {
        type: String
    },
    AuxWindsPercAdded: {  
        type: Boolean
    },
    Notes: {
        type: String
    }
});

const Template = mongoose.model('Template', templateSchema);
export default Template;