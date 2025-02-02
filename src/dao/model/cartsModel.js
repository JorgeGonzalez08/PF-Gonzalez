import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema(
    {
        products: {
            type: [{
                pid:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'products'
                },
                quantity: {
                    type:Number,
                    default:1
                }
            }]
        }
    },
    {
        timestamps:true
    });

export const cartsModel = mongoose.model(cartsCollection,cartsSchema);