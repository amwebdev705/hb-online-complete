import { betterAuth, BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
// import prisma from "@/lib/prisma";
import { PrismaClient } from '@prisma/client'
// import { sendEmail } from '@/actions/email'
import { openAPI } from 'better-auth/plugins'
import { admin } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { sendEmail } from './actions/server/email.actions'

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }), // ✅ remove provider: "mongodb"
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 * 7, // workaround for session update bug
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      premium: {
        type: 'boolean',
        required: false,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await sendEmail({
          to: newEmail,
          subject: 'Verify your email change',
          html: `<p>Click the link to verify your new email:</p><a href="${url}">${url}</a>`,
        })
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    openAPI(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24 * 7, // 7 days
    }),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Click the link to reset your password:</p><a href="${url}">${url}</a>`,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address',
        html: `<p>Click the link to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
      })
    },
  },
} satisfies BetterAuthOptions)

export type Session = typeof auth.$Infer.Session
