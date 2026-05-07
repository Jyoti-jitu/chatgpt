import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectMongo();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectMongo();
          let dbUser = await User.findOne({ email: user.email });
          
          if (!dbUser) {
            dbUser = await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image || '',
              authProvider: account.provider,
            });
          }
          
          // NextAuth expects string id
          user.id = dbUser._id.toString();
          user.avatar = dbUser.avatar;
          return true;
        } catch (error) {
          console.error('Error in OAuth signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === 'credentials') {
          token.id = user.id;
          token.avatar = user.avatar;
        } else if (account.provider === 'google') {
          await connectMongo();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.avatar = dbUser.avatar;
          } else {
            token.id = user.id;
            token.avatar = user.image || '';
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
