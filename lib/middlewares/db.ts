import * as mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const MONGODB_URI = <string>process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

// @ts-ignore
let cached = global.mongoose;

const dbConnect = async () => {
    if (!cached) {
        // @ts-ignore
        cached = global.mongoose = { conn: null, promise: null }
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then((mongoose) => {
            return mongoose
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export const dbMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    await dbConnect();
    next();
}

export default dbConnect;