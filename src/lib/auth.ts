import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "./db";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

export const NEXTAUTH_CONFIG = {
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        // }),
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID ?? "",
        //     clientSecret: process.env.GITHUB_SECRET ?? "",
        // }),
        CredentialsProvider({
            name: "Solana",
            credentials: {
                web3Address: { label: "Web3 Address", type: "text" },
                signature: { label: "Signature", type: "text" },
            },
            async authorize(credentials) {
                console.log("Credentials Provider", credentials);
                if (!credentials) return null;

                const { web3Address, signature } = credentials;

                const message = new TextEncoder().encode("Sign this message")
                const publicKeyBytes = new PublicKey(web3Address).toBytes();
                const signatureBytes = Uint8Array.from(Buffer.from(signature, 'hex'));

                const isValid = await nacl.sign.detached.verify(
                    message,
                    signatureBytes,
                    publicKeyBytes
                );

                console.log("isValid: ", isValid);

                if (isValid) {
                    // Find or create the user in the database
                    let user = await prisma.user.findUnique({
                        where: { web3Address }
                    });

                    if (!user) {
                        // Create a new user with default values for fields like premium
                        user = await prisma.user.create({
                            data: {
                                web3Address,
                            }
                        });
                    }

                    return user; // Return the user object if authentication is successful
                }

                // If the credentials are invalid, throw an Error with a message
                console.log("Invalid Credentials", credentials);
                return null;
            }
        })


    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user, account, profile }: any) {
            return true;
        },

        async jwt({ token, account, user }: any) {
            // console.log("JWT", token, account);
            if (account) {
                token.accessToken = account.access_token;

                if (user) {
                    token.userId = user.id;
                    token.web3Address = user.web3Address;
                }
            }
            // console.log("jwt", token, account);

            return token;
        },

        async session({ session, token }: any) {
            session.userId = token.userId;
            session.web3Address = token.web3Address;
            // console.log("session", session, token);

            return session;
        },

        async redirect({ url, baseUrl }: any) {
            // console.log("redirect", url, baseUrl);
            return baseUrl;
        },

    }
}