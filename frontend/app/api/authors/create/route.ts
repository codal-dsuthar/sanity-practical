import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

type CreateAuthorRequest = {
  username: string;
  firstName: string;
  lastName: string;
};

export async function POST(req: Request) {
  try {
    const body: CreateAuthorRequest = await req.json();

    if (!body?.username?.trim()) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }
    if (!body?.firstName?.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }
    if (!body?.lastName?.trim()) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }

    const slug = body.username
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingAuthor = await client.fetch(
      `*[_type == "person" && slug.current == $slug][0]`,
      { slug }
    );

    if (existingAuthor) {
      return NextResponse.json(
        {
          error: "An author with this username already exists",
          author: existingAuthor,
        },
        { status: 409 }
      );
    }

    const newAuthor = {
      _type: "person",
      username: body.username.trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      slug: {
        _type: "slug",
        current: slug,
      },
    };

    const result = await writeClient.create(newAuthor);

    return NextResponse.json(
      {
        success: true,
        author: result,
        message: "Author created successfully",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating author:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to create author", details: message },
      { status: 500 }
    );
  }
}
