import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from "../../../lib/mongodb";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { compare } from 'bcryptjs';

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("Received credentials:", credentials);

        const client = await clientPromise;
        const db = client.db();

        const user = await db.collection('users').findOne({ email: credentials?.email });

        if (user) {
          console.log("Found user:", user);

          const passwordMatch = await compare(credentials?.password, user.password);

          if (passwordMatch) {
            return { id: user._id.toString(), email: user.email, name: user.name, image: null };
          } else {
            console.log("Password does not match");
            return null;
          }
        } else {
          console.log("User not found");
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token?.id || null;
      session.user.email = token?.email || null;
      session.user.name = token?.name || null;
      session.user.image = token?.image || null;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.email = user?.email;
        token.name = user?.name || user?.email.split('@')[0];
        token.image = user?.image || null;
      }
      return token;
    },
    adapter: MongoDBAdapter(clientPromise),
  }
};

export default NextAuth(authOptions);
