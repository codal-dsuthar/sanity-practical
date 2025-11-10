import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

/**
 * Simple search route for posts.
 * Accepts query param `q` and returns posts that match title or excerpt.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();

    if (!q) {
      return NextResponse.json({ data: [] });
    }

    const param = `*${q}*`;

    const query = `*[_type == "post" && defined(slug.current) && (title match $q || summary match $q)] | order(publishDate desc, _updatedAt desc) {
      _id,
      "slug": slug.current,
      title,
      "excerpt": summary,
      "date": coalesce(publishDate, _updatedAt),
      "author": author->{
        name,
        "firstName": coalesce(split(name, " ")[0], name),
        "lastName": coalesce(split(name, " ")[1], "")
      },
      tags,
      featured
    }`;

    const data = await client.fetch(query, { q: param });

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
