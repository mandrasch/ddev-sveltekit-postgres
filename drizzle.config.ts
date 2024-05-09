// via https://medium.com/@anasmohammed361/drizzle-orm-with-sveltekit-8aecbc8cc39d
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
 throw new Error('No url');
}
export default {
 schema: './src/lib/db/schema.ts',
 out: './migrations',
 driver: 'pg',
 dbCredentials: {
  connectionString: DATABASE_URL
 }
} satisfies Config;