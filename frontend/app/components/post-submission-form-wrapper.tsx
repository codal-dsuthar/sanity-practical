import PostForm, { type Author } from "./post-submission-form";

export default async function PostSubmissionForm() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/authors`,
    { cache: "no-store" }
  );

  let authors: Author[] = [];
  if (response.ok) {
    const data = await response.json();
    authors = data.authors || [];
  }

  return <PostForm authors={authors} />;
}
