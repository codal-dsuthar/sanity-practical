import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const query = `*[_type == "person"] | order(username asc) {
      _id,
      username,
      firstName,
      lastName,
      slug,
      "headshotUrl": headshotImage.asset->url
    }`;

    const authors = await client.fetch(query);

    return NextResponse.json({ authors });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to fetch authors", details: message },
      { status: 500 }
    );
  }
}
