import { NextHandler } from 'next-connect';
import { NextApiRequest, NextApiResponse,  } from 'next';
import { getSession } from 'next-auth/react'

export const verifyAdmin = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const session = await getSession({ req });
    // @ts-ignore
    if (!session?.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    // @ts-ignore
    if (!session?.user?.roles?.isAdmin) {
        return res.status(403).json({ message: 'Permission denied' });
    }
    next();
};

export const verifyUser = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const session = await getSession({ req });
    // @ts-ignore
    if (!session?.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    next();
};

