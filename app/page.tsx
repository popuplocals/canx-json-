import Link from "next/link";
export default function Home() {
  return (
    <main style={{ maxWidth: 960, margin: "60px auto", padding: "0 20px" }}>
      <h1>Can X Global — homepage (placeholder, rebuilt next)</h1>
      <p><Link href="/immigration-blogs/">Immigration Blogs</Link></p>
    </main>
  );
}
