import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({ children }) {
  const { userId } = auth();

  const profiles = await db.query(
    `SELECT * FROM profiles WHERE clerk_id = '${userId}'`
  );
  console.log(profiles);

  if (profiles.rowCount === 0 && userId) {
    await db.query(`INSERT INTO profiles (clerk_id) VALUES ('${userId}')`);
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
