import * as argon2 from 'argon2'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/middlewares/db';
import User from '../../../lib/models/user';

const options = {
  providers: [
      CredentialsProvider({
          name: 'Email',
          credentials: {
              username: { label: "Email", type: "text" },
              password: {  label: "Password", type: "password" }
          },
          // @ts-ignore
          async authorize(credentials: Record<keyof "username | password", string> | undefined) {
              try {
                  if (!credentials) {
                      return null;
                  }

                  // @ts-ignore
                  const { username, password } = credentials;
                  if (!username || !password) {
                      return null;
                  }

                  await dbConnect();
                  const user = await User.findOne({ email: username }).select('+password');
                  const isMatched = await argon2.verify(user.password, password);
                  return isMatched ? { _id: user._id, email: user.email, roles: user.roles } : null;
              } catch (e) {
                  console.log(e);
                  return null;
              }
          },
      })
  ],
  callbacks: {
      // @ts-ignore
      async session({ session }) {
          if (!session.user.roles) {
              const user = await User.findOne({ email: session.user.email });
              session.user._id = user._id;
              session.user.roles = user.roles;
          }
          return session
      },
  },
  theme: {
    colorScheme: 'light',
    brandColor: '',
    logo: ''
  },
};

// @ts-ignore
export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);
