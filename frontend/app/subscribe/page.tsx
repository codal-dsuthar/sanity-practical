import Link from "next/link";

export default function SubscribePage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-bold text-3xl">Subscribe</h1>
        <p className="mt-4 text-muted-foreground">
          Get occasional updates and new posts delivered to your inbox.
        </p>

        <div className="mt-6 rounded-md border border-gray-200 bg-white p-6">
          <label
            className="block font-medium text-gray-700 text-sm"
            htmlFor="subscribe-email"
          >
            Email
          </label>
          <div className="mt-2 flex gap-2">
            <input
              aria-label="Email address"
              className="w-full rounded-sm border border-gray-200 px-3 py-2"
              id="subscribe-email"
              placeholder="you@example.com"
              type="email"
            />
            <button
              className="inline-flex items-center rounded-sm bg-brand px-4 py-2 text-white"
              type="button"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 text-gray-500 text-sm">
            This form is a placeholder. To enable subscriptions wire this to
            your preferred email provider or serverless endpoint.
          </p>
          <p className="mt-4 text-sm">
            Prefer not to subscribe? Visit the{" "}
            <Link className="underline" href="/about">
              About
            </Link>{" "}
            page to learn more.
          </p>
        </div>
      </div>
    </div>
  );
}
