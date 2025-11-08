export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-bold text-3xl">About</h1>
        <p className="mt-4 text-muted-foreground">
          This blog shares practical web development tutorials and updates. It's
          built with a small, focused stack and intentionally minimal layout.
        </p>

        <section className="mt-6 space-y-4">
          <p>
            If you want to contribute or request features, open an issue in the
            project repository or contact the maintainers directly.
          </p>
        </section>
      </div>
    </div>
  );
}
