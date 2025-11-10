"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type Author = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  slug: { current: string };
  headshotUrl?: string;
};

const SLUG_REGEX = /^[a-z0-9-]+$/;

const generateSlug = (title: string): string => {
  if (!title) {
    return "";
  }
  return title
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
};

const normalizeSlug = (raw: string) => generateSlug(raw || "");

const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return "Title is required";
  }
  if (title.length < 3) {
    return "Title must be at least 3 characters";
  }
  if (title.length > 100) {
    return "Title must be less than 100 characters";
  }
  return null;
};

const validateSlug = (slug: string): string | null => {
  if (!slug.trim()) {
    return "Slug is required";
  }
  if (!SLUG_REGEX.test(slug)) {
    return "Slug can only contain lowercase letters, numbers, and hyphens";
  }
  return null;
};

const validateBody = (body: string): string | null => {
  if (!body.trim()) {
    return "Content is required";
  }
  if (body.length < 50) {
    return "Content must be at least 50 characters";
  }
  return null;
};

const validateAuthor = (authorId: string): string | null => {
  if (!authorId) {
    return "Please select an author";
  }
  return null;
};

type NewAuthorFormProps = {
  onSuccess: (author: Author) => void;
  onCancel: () => void;
  setError: (error: string | null) => void;
};

function NewAuthorForm({ onSuccess, onCancel, setError }: NewAuthorFormProps) {
  const [newAuthor, setNewAuthor] = useState({
    username: "",
    firstName: "",
    lastName: "",
  });
  const [creatingAuthor, setCreatingAuthor] = useState(false);

  const createAuthor = async () => {
    const response = await fetch("/api/authors/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAuthor),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409 && data.author) {
        return { alreadyExists: true, author: data.author };
      }
      throw new Error(data.error || "Failed to create author");
    }

    return { author: data.author };
  };

  const handleCreate = async () => {
    if (
      !(
        newAuthor.username.trim() &&
        newAuthor.firstName.trim() &&
        newAuthor.lastName.trim()
      )
    ) {
      setError("All author fields are required");
      return;
    }

    setCreatingAuthor(true);
    setError(null);

    try {
      const result = await createAuthor();

      const authorData: Author = {
        _id: result.author._id,
        username: result.author.username,
        firstName: result.author.firstName,
        lastName: result.author.lastName,
        slug: result.author.slug,
        headshotUrl: undefined,
      };

      onSuccess(authorData);
      setNewAuthor({ username: "", firstName: "", lastName: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create author");
    } finally {
      setCreatingAuthor(false);
    }
  };

  const isFormValid =
    newAuthor.username.trim() &&
    newAuthor.firstName.trim() &&
    newAuthor.lastName.trim();

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="font-medium text-gray-700 text-sm">Create New Author</p>

      <div>
        <label
          className="mb-1 block text-gray-700 text-xs"
          htmlFor="newAuthorUsername"
        >
          Username *
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          id="newAuthorUsername"
          onChange={(e) =>
            setNewAuthor((p) => ({ ...p, username: e.target.value }))
          }
          placeholder="johndoe"
          type="text"
          value={newAuthor.username}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            className="mb-1 block text-gray-700 text-xs"
            htmlFor="newAuthorFirstName"
          >
            First Name *
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            id="newAuthorFirstName"
            onChange={(e) =>
              setNewAuthor((p) => ({ ...p, firstName: e.target.value }))
            }
            placeholder="John"
            type="text"
            value={newAuthor.firstName}
          />
        </div>

        <div>
          <label
            className="mb-1 block text-gray-700 text-xs"
            htmlFor="newAuthorLastName"
          >
            Last Name *
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            id="newAuthorLastName"
            onChange={(e) =>
              setNewAuthor((p) => ({ ...p, lastName: e.target.value }))
            }
            placeholder="Doe"
            type="text"
            value={newAuthor.lastName}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          disabled={creatingAuthor || !isFormValid}
          onClick={handleCreate}
          size="sm"
          type="button"
        >
          {creatingAuthor ? "Creating..." : "Create Author"}
        </Button>

        <Button onClick={onCancel} size="sm" type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
}

type AuthorSelectProps = {
  authors: Author[];
  authorId: string;
  validationError: string | undefined;
  onAuthorChange: (id: string) => void;
  onNewAuthorClick: () => void;
};

function AuthorSelect({
  authors,
  authorId,
  validationError,
  onAuthorChange,
  onNewAuthorClick,
}: AuthorSelectProps) {
  return (
    <>
      <div className="flex gap-2">
        <select
          className={`flex-1 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${
            validationError
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-brand focus:ring-brand"
          }`}
          id="author"
          onChange={(e) => onAuthorChange(e.target.value)}
          required
          value={authorId}
        >
          <option value="">Select an author</option>
          {authors.map((a) => (
            <option key={a._id} value={a._id}>
              {a.firstName} {a.lastName} (@{a.username})
            </option>
          ))}
        </select>

        <Button onClick={onNewAuthorClick} type="button" variant="outline">
          + New Author
        </Button>
      </div>

      {validationError && (
        <p className="mt-1 text-red-600 text-sm">{validationError}</p>
      )}
    </>
  );
}

export default function PostForm({
  authors: initialAuthors,
}: {
  authors: Author[];
}) {
  const router = useRouter();

  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    body: "",
    authorId: "",
    tags: [] as string[],
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const titleErr = validateTitle(formData.title);
    if (titleErr) {
      errors.title = titleErr;
    }

    const slugErr = validateSlug(formData.slug);
    if (slugErr) {
      errors.slug = slugErr;
    }

    const bodyErr = validateBody(formData.body);
    if (bodyErr) {
      errors.body = bodyErr;
    }

    const authorErr = validateAuthor(formData.authorId);
    if (authorErr) {
      errors.authorId = authorErr;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitPost = async () => {
    const response = await fetch("/api/posts/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit post");
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await submitPost();
      setSuccess(true);
      setTimeout(() => router.push("/posts"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => {
      const prevGenerated = generateSlug(prev.title);
      const shouldUpdateSlug = !prev.slug || prev.slug === prevGenerated;
      return {
        ...prev,
        title: value,
        slug: shouldUpdateSlug ? generateSlug(value) : prev.slug,
      };
    });
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((p) => ({ ...p, tags: [...p.tags, trimmed] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  const handleAuthorCreated = (author: Author) => {
    setAuthors((p) => [...p, author]);
    setFormData((p) => ({ ...p, authorId: author._id }));
    setShowNewAuthorForm(false);
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-5xl">Checkmark</div>
        <h2 className="mb-3 font-bold text-2xl text-green-900">
          Post Created as Draft!
        </h2>
        <p className="mb-2 text-green-800 text-lg">
          Your post has been saved as a draft in Sanity Studio.
        </p>
        <p className="text-green-700 text-sm">
          An admin will review and publish it from the studio.
        </p>
        <p className="mt-4 text-green-600 text-xs">
          Redirecting to posts page...
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label
          className="mb-2 block font-medium text-gray-900 text-sm"
          htmlFor="title"
        >
          Title *{" "}
          <span className="font-normal text-gray-500 text-xs">
            ({formData.title.length}/100)
          </span>
        </label>
        <input
          className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${
            validationErrors.title
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-brand focus:ring-brand"
          }`}
          id="title"
          maxLength={100}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter post title"
          required
          type="text"
          value={formData.title}
        />
        {validationErrors.title && (
          <p className="mt-1 text-red-600 text-sm">{validationErrors.title}</p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block font-medium text-gray-900 text-sm"
          htmlFor="slug"
        >
          Slug *
        </label>
        <input
          className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${
            validationErrors.slug
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-brand focus:ring-brand"
          }`}
          id="slug"
          onBlur={() =>
            setFormData((p) => ({ ...p, slug: normalizeSlug(p.slug) }))
          }
          onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
          placeholder="post-slug"
          required
          type="text"
          value={formData.slug}
        />
        {validationErrors.slug ? (
          <p className="mt-1 text-red-600 text-sm">{validationErrors.slug}</p>
        ) : (
          <p className="mt-1 text-gray-500 text-xs">
            URL-friendly version of the title (lowercase letters, numbers,
            hyphens only)
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block font-medium text-gray-900 text-sm"
          htmlFor="summary"
        >
          Summary
        </label>
        <textarea
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          id="summary"
          onChange={(e) =>
            setFormData((p) => ({ ...p, summary: e.target.value }))
          }
          placeholder="Brief description of your post"
          rows={3}
          value={formData.summary}
        />
      </div>

      <div>
        <label
          className="mb-2 block font-medium text-gray-900 text-sm"
          htmlFor="body"
        >
          Content *{" "}
          <span className="font-normal text-gray-500 text-xs">
            ({formData.body.length} characters, min 50)
          </span>
        </label>
        <textarea
          className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${
            validationErrors.body
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-brand focus:ring-brand"
          }`}
          id="body"
          onChange={(e) => setFormData((p) => ({ ...p, body: e.target.value }))}
          placeholder="Write your post content here..."
          required
          rows={12}
          value={formData.body}
        />
        {validationErrors.body && (
          <p className="mt-1 text-red-600 text-sm">{validationErrors.body}</p>
        )}
      </div>

      <div>
        <label
          className="mb-2 block font-medium text-gray-900 text-sm"
          htmlFor="author"
        >
          Author *
        </label>

        {showNewAuthorForm ? (
          <NewAuthorForm
            onCancel={() => setShowNewAuthorForm(false)}
            onSuccess={handleAuthorCreated}
            setError={setError}
          />
        ) : (
          <AuthorSelect
            authorId={formData.authorId}
            authors={authors}
            onAuthorChange={(id) =>
              setFormData((p) => ({ ...p, authorId: id }))
            }
            onNewAuthorClick={() => setShowNewAuthorForm(true)}
            validationError={validationErrors.authorId}
          />
        )}
      </div>

      <div>
        <label
          className="mb-2 block font-medium text-gray-900 text-sm"
          htmlFor="tags"
        >
          Tags
        </label>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            id="tags"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            type="text"
            value={tagInput}
          />
          <Button
            disabled={!tagInput.trim()}
            onClick={addTag}
            type="button"
            variant="outline"
          >
            Add
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge
                className="cursor-pointer"
                key={tag}
                onClick={() => removeTag(tag)}
                variant="secondary"
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          checked={formData.featured}
          className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-2 focus:ring-brand"
          id="featured"
          onChange={(e) =>
            setFormData((p) => ({ ...p, featured: e.target.checked }))
          }
          type="checkbox"
        />
        <label className="font-medium text-gray-900 text-sm" htmlFor="featured">
          Mark as featured post
        </label>
      </div>

      <div className="flex justify-end gap-4 border-gray-200 border-t pt-6">
        <Button
          disabled={loading}
          onClick={() => router.back()}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>

        <Button disabled={loading} type="submit">
          {loading ? "Submitting..." : "Submit Post"}
        </Button>
      </div>
    </form>
  );
}
