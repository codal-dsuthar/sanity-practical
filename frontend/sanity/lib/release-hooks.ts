/**
 * Content Release Hooks
 *
 * React hooks and utilities for handling content releases
 * - Fetch release information
 * - Check if content is scheduled
 * - Trigger webhooks
 * - Handle version comparisons
 */

import { useEffect, useState } from "react";
import { client } from "./client";

export type ContentRelease = {
  _id: string;
  title: string;
  version: string;
  status:
    | "planning"
    | "review"
    | "approved"
    | "scheduled"
    | "released"
    | "archived";
  releaseDate: string;
  changelog: Array<{
    type: string;
    description: string;
    documentType: string;
  }>;
  documents: Array<{ _ref: string }>;
  notes?: string;
};

type UseReleaseReturn = {
  release: ContentRelease | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Hook to fetch the current/upcoming release
 */
export function useCurrentRelease(): UseReleaseReturn {
  const [release, setRelease] = useState<ContentRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const query = `
          *[_type == "contentRelease" && status in ["approved", "scheduled", "released"]]
          | order(releaseDate desc)[0] {
            _id,
            title,
            version,
            status,
            releaseDate,
            changelog,
            documents,
            notes
          }
        `;

        const result = await client.fetch(query);
        setRelease(result || null);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch release")
        );
        setRelease(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, []);

  return { release, loading, error };
}

/**
 * Hook to fetch release history
 */
export function useReleaseHistory(limit = 10) {
  const [releases, setReleases] = useState<ContentRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const query = `
          *[_type == "contentRelease"]
          | order(releaseDate desc)[0...${limit}] {
            _id,
            title,
            version,
            status,
            releaseDate,
            changelog,
            documents,
            notes
          }
        `;

        const result = await client.fetch(query);
        setReleases(result || []);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch release history")
        );
        setReleases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [limit]);

  return { releases, loading, error };
}

/**
 * Hook to check if a document is part of an upcoming release
 */
export function useDocumentRelease(documentId: string) {
  const [releaseInfo, setReleaseInfo] = useState<{
    inRelease: boolean;
    release?: ContentRelease;
  }>({ inRelease: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkRelease = async () => {
      try {
        const query = `
          *[_type == "contentRelease" && references("${documentId}")][0] {
            _id,
            title,
            version,
            status,
            releaseDate,
            changelog,
            documents,
            notes
          }
        `;

        const result = await client.fetch(query);
        setReleaseInfo({
          inRelease: !!result,
          release: result || undefined,
        });
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to check document release")
        );
        setReleaseInfo({ inRelease: false });
      } finally {
        setLoading(false);
      }
    };

    checkRelease();
  }, [documentId]);

  return { ...releaseInfo, loading, error };
}

/**
 * Function to check if a release is scheduled
 */
export function isReleaseScheduled(release: ContentRelease): boolean {
  return release.status === "scheduled";
}

/**
 * Function to check if a release is overdue
 */
export function isReleaseOverdue(release: ContentRelease): boolean {
  const releaseDate = new Date(release.releaseDate);
  const now = new Date();

  const isNotReleased =
    release.status !== "released" && release.status !== "archived";
  return releaseDate < now && isNotReleased;
}

/**
 * Function to calculate time until release
 */
export function getTimeUntilRelease(release: ContentRelease): {
  days: number;
  hours: number;
  minutes: number;
  isScheduled: boolean;
} {
  const releaseDate = new Date(release.releaseDate);
  const now = new Date();
  const diff = releaseDate.getTime() - now.getTime();

  const isScheduled = diff > 0;
  const absDiff = Math.abs(diff);

  return {
    days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((absDiff / 1000 / 60) % 60),
    isScheduled,
  };
}

/**
 * Function to trigger a release webhook manually
 */
export async function triggerReleaseWebhook(releaseId: string): Promise<void> {
  try {
    const response = await fetch("/api/webhooks/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ releaseId }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to trigger webhook";
    throw new Error(message);
  }
}

/**
 * Function to format changelog for display
 */
export function formatChangelog(
  changelog: ContentRelease["changelog"]
): Record<string, typeof changelog> {
  return changelog.reduce(
    (acc, item) => {
      const type = item.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    },
    {} as Record<string, typeof changelog>
  );
}

export default {
  useCurrentRelease,
  useReleaseHistory,
  useDocumentRelease,
  isReleaseScheduled,
  isReleaseOverdue,
  getTimeUntilRelease,
  triggerReleaseWebhook,
  formatChangelog,
};
