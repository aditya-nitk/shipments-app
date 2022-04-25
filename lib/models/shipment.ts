import { Schema, model, Types, Document } from 'mongoose';
import mongoose from "mongoose";

export interface IShipment extends Document {
    source: string;
    destination: string;
    customer: Types.ObjectId;
    deliveryPartner: Types.ObjectId;
}

const ShipmentSchema = new Schema<IShipment>({
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryPartner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// instance methods
ShipmentSchema.methods = {
    toObj() {
        return this.toObject();
    },
};

// model
const Shipment = mongoose.models.Shipment || model('Shipment', ShipmentSchema);

export default Shipment;