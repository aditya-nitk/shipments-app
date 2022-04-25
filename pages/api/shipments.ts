import nc from 'next-connect';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyUser } from '../../lib/middlewares/auth';
import { dbMiddleware } from '../../lib/middlewares/db';
import Shipment from '../../lib/models/shipment';
import User from '../../lib/models/user';

const handler = nc({
    onError: (err, req: NextApiRequest, res: NextApiResponse) => {
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        res.status(404).end('Page is not found');
    },
})

handler.use(verifyUser)

handler.use(dbMiddleware)

handler.get(async (req, res) => {
    try {
        const session = await getSession({ req });
        // @ts-ignore
        const { _id, roles } = session.user || {};
        const { isCustomer, isDeliveryPartner } = roles || {};

        const filter: {[key: string]: boolean} = {};
        if (isCustomer) {
            filter['customer'] = _id;
        } else if (isDeliveryPartner) {
            filter['deliveryPartner'] = _id;
        }

        const shipments = await Shipment.find(filter).populate('customer').populate('deliveryPartner');
        res.json({ shipments });

    } catch ({ message }) {
        res.status(500).json({ err: message });
    }
})

handler.post(async (req, res) => {
    try {
        const { source, destination, customerId, deliveryPartnerId } = req.body;
        if (!source || !destination || !customerId || !deliveryPartnerId) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const [customer, deliveryPartner] = await Promise.all([
            User.findById(customerId),
            User.findById(deliveryPartnerId)
        ]);
        if (!customer) return res.status(400).json({ message: 'Invalid customer' });
        if (!deliveryPartner) return res.status(400).json({ message: 'Invalid delivery partner' });
        const newShipment = new Shipment({
            source,
            destination,
            customer: customerId,
            deliveryPartner: deliveryPartnerId
        });
        await newShipment.save();
        return res.status(200).json({ message: 'Success', id: newShipment._id });
    } catch (e) {
        return res.status(500).json({ message: 'Something went wrong' });
    }
})

export default handler;