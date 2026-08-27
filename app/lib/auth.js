import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins"



const client = new MongoClient(process.env.MONGO_URL);
const db = client.db('lifecoach');

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        default: 'user'
      },
      plan: {
        default: 'user_free'
      },
      lessonsCount: {
        type: "number",
        defaultValue: 0,
      },
    }
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
  plugins: [
    jwt(),
  ]
});