const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
ImageSchema.virtual('cardImage').get(function() {   return this.url.replace('/upload', '/upload/ar_4:3,c_crop'); })

const productSchema = new Schema({
    type: {
        type: String,
        uppercase: true
    },
    cat: {
        type: String,
        uppercase: true,
        enum: ['PENTA', 'PNEUMONIAE', 'BCG','POLIO', 'MEASLES', 'COVID-19', 'INFLUENZA', 'HPV', 'HEPATITIS-B', 'JE', 'MENINGITIS', 'ROTAVIRUS','YELLOWFEVER','RABIES','EBOLA','TYPHOID','TETANUS', 'CHOLERA','DILUENTS']
    },
    date_open: {
        type: Date
    },
    name: {
        type: String,
        uppercase: true
    },
    manufacturer: {
        type: String,
        uppercase: true
    },
    conversion: {
        type: Number
    },
    uom_open: {
        type: String,
        lowercase: true,
        enum: ['vial/amp','dose','flacon/tube', 'sprayer']
    },
    uom_received: {
        type: String,
        lowercase: true,
        enum: ['vial/amp','dose','flacon/tube', 'sprayer']
    },
    uom_issued: {
        type: String,
        lowercase: true,
        enum: ['vial/amp','dose','flacon/tube', 'sprayer']
    },
    uom_lost: {
        type: String,
        lowercase: true,
        enum: ['vial/amp','dose','flacon/tube', 'sprayer']
    },
    uom_transferred: {
        type: String,
        lowercase: true,
        enum: ['vial/amp','dose','flacon/tube', 'sprayer']
    },
    uom_count: {
        type: String,
        lowercase: true,
        enum: ['vial/amp','dose','flacon/tube', 'sprayer']
    },
    qty_open: {
        type: Number,
        min: 0
    },
    qty_received: {
        type: Number,
        min: 0
    },
    qty_issued: {
        type: Number,
        min: 0
    },
    qty_lost: {
        type: Number,
        min: 0,
        default: 0
    },
    qty_transferred: {
        type: Number,
        default: 0
    },
    qty_count: {
        type: Number,
        min: 0
    },
    cce: {
        type: String,
        enum: ['refrigerator','freezer', 'ultrafreezer']
    },
    so_days: {
        type: Number,
        min: 0
    },
    nearexp: {
        type: Number,
        min: 0
    },
    author: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    editor: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    images: [ImageSchema],
    comments: [
        {
            type: Schema.Types.ObjectId, ref: 'Comment',
        }
    ],
    site: {
        type: Schema.Types.ObjectId, ref: 'Site',
    },
},
    { timestamps: true }
);


// DELETE ALL ASSOCIATED COMMENTS WHEN A PRODUCT IS DELETED
productSchema.post('findOneAndDelete', async function (product) {
    if (product.comments.length) {
        await Comment.deleteMany({ _id: { $in: product.comments } })
    }
});

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Product', productSchema);

