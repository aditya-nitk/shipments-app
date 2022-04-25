import * as mongoose from 'mongoose';

export interface IRoles extends mongoose.Document {
    isAdmin?: boolean;
    isCustomer?: boolean;
    isDeliveryPartner?: boolean;
}

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    roles: IRoles
}

const RolesSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    isCustomer: {
        type: Boolean,
        default: false
    },
    isDeliveryPartner: {
        type: Boolean,
        default: false
    }
})

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    roles: {
        type: RolesSchema
    }
});

// index
UserSchema.index({ email: 1 });

// instance methods
UserSchema.methods = {
    toObj() {
        return this.toObject();
    },
};

// model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;