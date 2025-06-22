import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productsSchema= new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true
        },
        title: String,
        description: String,
        price: Number,
        status: {
            type: Boolean,
            default: true
        },
        stock: Number,
        category: String,
        thumbnails: {
            type: Array,
            default:[]
        }
    },
    {
        timestamps:true
    }
)

productsSchema.plugin(paginate);
export const productsModel = mongoose.model(productsCollection,productsSchema);