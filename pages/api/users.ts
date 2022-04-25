import nc, { NextHandler } from 'next-connect';
import * as argon2 from 'argon2'
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAdmin } from '../../lib/middlewares/auth';
import dbConnect, {dbMiddleware} from '../../lib/middlewares/db';
import User from '../../lib/models/user';

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse) => {
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end('Page is not found');
  },
})

handler.use(verifyAdmin)

handler.use(dbMiddleware)

handler.get(async (req, res) => {
  try {
    const { role } = req.query;

    const filter: {[key: string]: boolean} = {};
    if (role === 'customer') {
      filter['roles.isCustomer'] = true;
    } else if (role === 'delivery-partner') {
      filter['roles.isDeliveryPartner'] = true;
    } else if (role === 'admin') {
      filter['roles.isAdmin'] = true;
    }

    const users = await User.find(filter);
    res.json({ users });

  } catch ({ message }) {
    res.status(500).json({ err: message });
  }
})

handler.post(async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    if (!email || !password || !roles) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(500).json({ message: 'Duplicate user' });
    }

    const hash = await argon2.hash(password);
    const newUser = new User({
      email,
      roles,
      password: hash
    });
    await newUser.save();
    res.status(200).json({ message: 'Success', id: newUser._id });

  } catch ({ message }) {
    res.status(500).json({ err: message });
  }
})

export default handler;