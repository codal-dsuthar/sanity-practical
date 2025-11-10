import { Suspense } from "react";
import PostSubmissionForm from "@/app/components/post-submission-form-wrapper";

export default async function SubmitPostPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="font-bold text-4xl">Submit a Blog Post</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Share your thoughts and ideas with the community
          </p>
        </header>

        <Suspense fallback={<div>Loading form...</div>}>
          <PostSubmissionForm />
        </Suspense>
      </div>
    </div>
  );
}
