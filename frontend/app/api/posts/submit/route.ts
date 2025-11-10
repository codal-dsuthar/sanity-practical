import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

type PostSubmission = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  authorId: string;
  tags?: string[];
  featured?: boolean;
};

export async function POST(req: Request) {
  try {
    const body: PostSubmission = await req.json();

    const genKey = () => Math.random().toString(36).slice(2, 11);

    if (!(body.title && body.slug && body.authorId && body.body)) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, body, or authorId" },
        { status: 400 }
      );
    }

    const existingPost = await writeClient.fetch(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]`,
      { slug: body.slug }
    );

    const existingDraft = await writeClient.fetch(
      `*[_id == "drafts." + *[_type == "post" && slug.current == $slug][0]._id][0]`,
      { slug: body.slug }
    );

    if (existingPost || existingDraft) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    const draftId = `drafts.${genKey()}${Date.now()}`;

    const newPost = {
      _type: "post",
      _id: draftId,
      title: body.title,
      slug: {
        _type: "slug",
        current: body.slug,
      },
      summary: body.summary || "",
      body: body.body
        ? [
            {
              _type: "block",
              _key: genKey(),
              children: [
                {
                  _type: "span",
                  _key: genKey(),
                  text: body.body,
                  marks: [],
                },
              ],
              markDefs: [],
              style: "normal",
            },
          ]
        : [],
      author: {
        _type: "reference",
        _ref: body.authorId,
      },
      publishDate: new Date().toISOString(),
      tags: body.tags || [],
      featured: body.featured,
    };

    const result = await writeClient.create(newPost);

    console.log("Draft post created:", { slug: body.slug, id: result._id });

    return NextResponse.json(
      {
        success: true,
        post: result,
        message: "Post created as draft and is pending review",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error creating post submission:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to submit post", details: message },
      { status: 500 }
    );
  }
}
