import { db } from "@/lib/db";
import { SignIn, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Posts() {
  const { userId } = auth();

  const posts = await db.query(`SELECT
  posts.id,
  posts.content,
  profiles.username 
  FROM posts
  INNER JOIN profiles ON posts.profile_id = profiles.id;`);

  async function HandleMyPosts(formData) {
    "use server";

    const content = formData.get("content");
    // console.log(userId);

    const result = await db.query(
      `SELECT * FROM profiles WHERE clerk_id = '${userId}'`
    );

    const profileId = result.rows[0].id;
    // console.log(profileId);
    await db.query(
      `INSERT INTO posts (profile_id, content) VALUES (${profileId},'${content}')`
    );
  }
  return (
    <div>
      <h2>My Posts</h2>
      <SignedIn>
        <h3>Add a new post</h3>
        <form action={HandleMyPosts}>
          <textarea name="content" id="New Post"></textarea>
          <button>Submit</button>
        </form>
      </SignedIn>

      <SignedOut>
        <p> Please Sign in to add a post</p>
        <SignInButton />
      </SignedOut>

      <h3>All my posts</h3>
      <div className="posts">
        {posts.rows.map((post) => {
          return (
            <div key={post.id}>
              <p>{post.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
