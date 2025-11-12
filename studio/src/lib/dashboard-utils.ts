/**
 * App SDK Dashboard Utilities
 * 
 * Provides tools and components for building custom dashboards
 * within Sanity Studio using the App SDK
 */

interface DashboardMetrics {
  totalDocuments: number;
  publishedDocuments: number;
  draftDocuments: number;
  avgPublishTime?: number;
  recentActivity?: Array<{
    id: string;
    type: string;
    action: string;
    timestamp: string;
  }>;
}

interface DocumentStats {
  type: string;
  count: number;
  featured?: number;
  recent?: string[];
}

/**
 * Calculate content metrics from dashboard data
 */
export function calculateMetrics(stats: DocumentStats[]): DashboardMetrics {
  const totalDocuments = stats.reduce((sum, stat) => sum + stat.count, 0);
  const publishedDocuments = stats.reduce(
    (sum, stat) => sum + (stat.count || 0),
    0
  );

  return {
    totalDocuments,
    publishedDocuments,
    draftDocuments: 0, // Would be calculated from drafts separately
    avgPublishTime: undefined,
    recentActivity: [],
  };
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number | undefined): string {
  if (!num) return '0';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
}

/**
 * Get color based on metric value
 */
export function getMetricColor(value: number, threshold?: number): string {
  const t = threshold || 10;

  if (value >= t * 2) return 'success'; // Green
  if (value >= t) return 'caution'; // Yellow
  return 'critical'; // Red
}

/**
 * Format date for dashboard display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) {
    return 'Just now';
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  }

  return d.toLocaleDateString();
}

/**
 * Get chart data for content types
 */
export function getContentTypeChartData(stats: DocumentStats[]) {
  return stats.map((stat) => ({
    name: stat.type,
    value: stat.count,
  }));
}

/**
 * Generate dashboard title/greeting based on time
 */
export function getDashboardGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

/**
 * Determine content health status
 */
export function getContentHealthStatus(metrics: DashboardMetrics): {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
} {
  const publishedRatio =
    metrics.publishedDocuments /
    (metrics.publishedDocuments + metrics.draftDocuments || 1);

  if (publishedRatio >= 0.8 && metrics.totalDocuments >= 10) {
    return {
      status: 'healthy',
      message: 'Content is well-maintained',
    };
  } else if (publishedRatio >= 0.5) {
    return {
      status: 'warning',
      message: 'Several drafts pending review',
    };
  }

  return {
    status: 'critical',
    message: 'Too many unpublished changes',
  };
}

/**
 * Get trending content types
 */
export function getTrendingContentTypes(
  stats: DocumentStats[]
): DocumentStats[] {
  return stats
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export default {
  calculateMetrics,
  formatNumber,
  getMetricColor,
  formatDate,
  getContentTypeChartData,
  getDashboardGreeting,
  getContentHealthStatus,
  getTrendingContentTypes,
};
