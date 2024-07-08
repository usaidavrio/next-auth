import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const formdata = new FormData();
          formdata.append('email', email);
          formdata.append('password', password);

          const requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          };

          const res = await fetch('https://dashboard.avrioglobal.io/api/user/login', requestOptions);
          const data = await res.json();

          if (!data.token) {
            return null;
          }
          console.log("data ========>", data);

          return { ...data.userData, token: data.token };
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
