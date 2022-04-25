import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { IRoles } from '../../lib/models/user';
import Loading from '../../components/Common/Loading';

type Props = { children: React.ReactNode };

export const AuthContext = React.createContext({})

const AuthProvider : React.FC<Props> = ({ children }) => {
    const router = useRouter()
    const { data: session, status } = useSession();

    React.useEffect(() => {
        if (status === 'authenticated') {
            // @ts-ignore
            const { isAdmin, isCustomer, isDeliveryPartner } : IRoles = session?.user?.roles || {};

            if (isAdmin) {
                router.push('/admin-portal');
            } else if (isCustomer) {
                router.push('/customer-portal');
            } else if (isDeliveryPartner) {
                router.push('/delivery-partner-portal');
            }
        } else if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }
    }, [status, session]);

    return (
        <AuthContext.Provider value={{ status, session }}>
            {status === 'loading' && <Loading />}
            {status === 'authenticated' && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
