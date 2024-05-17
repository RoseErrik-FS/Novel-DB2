import clientPromise from '@/lib/db';
import { IUser } from '@/models/user';
import { JWT } from 'next-auth/jwt';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import { MongoDBAdapter, MongoDBAdapterOptions } from '@next-auth/mongodb-adapter';
import GithubProvider from 'next-auth/providers/github';

const mongodbAdapterOptions: MongoDBAdapterOptions = {
  collections: {
    Users: 'User',
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise, mongodbAdapterOptions),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && token.isNewUser) {
        // If a new user is created, create a session for them
        session.user = {
          id: token.userId,
          name: token.userId, // You can use any appropriate value for the name
          email: token.userId, // You can use any appropriate value for the email
        } as IUser;
      } else {
        // If an existing user signs in, update their session
        session.user = {
          ...session.user,
          id: token.userId,
        } as IUser;
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      /* Perform any necessary actions on successful sign-in */
    },
    async signOut(message) {
      /* Perform any necessary actions on sign-out */
    },
    async createUser(message) {
      // Perform any necessary actions when a new user is created
      const user = message.user;
    },
    async updateUser(message) {
      /* Perform any necessary actions when a user is updated */
    },
    async linkAccount(message) {
      /* Perform any necessary actions when an account is linked */
    },
    async session(message) {
      /* Perform any necessary actions on session creation */
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };