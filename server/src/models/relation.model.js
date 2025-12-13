import mongoose from 'mongoose';

const relationshipSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        relation: {
            type: String,
            enum: [
                'father',
                'mother',
                'son',
                'daughter',
                'husband',
                'wife',
                'brother',
                'sister',

                'maternal_grandfather',
                'maternal_grandmother',

                'paternal_grandfather',
                'paternal_grandmother',

                'grandson',
                'granddaughter',

                'brother_in_law',
                'sister_in_law',

                'uncle',
                'aunt',
                'cousin',

                'maternal_uncle',
                'maternal_aunt',
                'paternal_uncle',
                'paternal_aunt',

                'nephew',
                'niece',
            ],
            required: true,
        },
    },
    {timestamps: true}
);

const Relation = mongoose.model('Relation', relationshipSchema);

export default Relation;
