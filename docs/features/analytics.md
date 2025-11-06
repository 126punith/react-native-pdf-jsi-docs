---
sidebar_position: 7
title: Reading Analytics
description: Track reading progress, sessions, and generate insights
---

# Reading Analytics

Comprehensive reading analytics system that tracks progress, sessions, reading speed, and generates personalized insights.

:::tip Free Feature
All analytics features are completely FREE!
:::

## Overview

The Analytics system provides:
- Reading session tracking
- Progress monitoring
- Time spent calculation
- Reading speed analytics
- Engagement scoring
- Page heatmaps
- Personalized insights
- Export analytics data

---

## Quick Start

```javascript
import { AnalyticsManager } from 'react-native-pdf-jsi/src/analytics/AnalyticsManager';
import { useAnalytics } from 'react-native-pdf-jsi/src/analytics/hooks/useAnalytics';

// Using the manager
const manager = new AnalyticsManager();
await manager.initialize();

const analytics = await manager.getAnalytics('my-pdf-id');
console.log('Completion:', analytics.readingMetrics.completionRate + '%');
console.log('Time spent:', analytics.timeAnalytics.totalTimeFormatted);
console.log('Reading speed:', analytics.readingMetrics.pagesPerHour, 'pages/hour');

// Or use the React hook
const { analytics, updateProgress } = useAnalytics('my-pdf-id');
```

---

## Reading Metrics

Track key reading statistics:

```javascript
const analytics = await manager.getAnalytics(pdfId);
const metrics = analytics.readingMetrics;

console.log('Pages read:', metrics.totalPagesRead);
console.log('Total pages:', metrics.totalPages);
console.log('Completion:', metrics.completionRate + '%');
console.log('Pages per hour:', metrics.pagesPerHour);
console.log('Minutes per page:', metrics.minutesPerPage);
console.log('Reading speed:', metrics.wordsPerMinute, 'WPM');
console.log('Est. total time:', metrics.estimatedTotalTime);
console.log('Est. remaining:', metrics.estimatedTimeRemaining);
```

**Reading Metrics Object:**
```typescript
{
  pagesPerHour: number;
  minutesPerPage: number;
  completionRate: number;        // 0-100
  wordsPerMinute: number;        // Estimated WPM
  totalPagesRead: number;
  totalPages: number;
  timeSpent: number;             // Seconds
  estimatedTotalTime: number;    // Seconds
  estimatedTimeRemaining: number; // Seconds
}
```

---

## Time Analytics

Detailed time tracking:

```javascript
const timeAnalytics = analytics.timeAnalytics;

console.log('Total time:', timeAnalytics.totalTimeFormatted);  // "2h 30m"
console.log('Session count:', timeAnalytics.totalSessions);
console.log('Avg session:', timeAnalytics.avgSessionDuration, 'minutes');
console.log('Last session:', new Date(timeAnalytics.lastSession));
console.log('Reading streak:', timeAnalytics.readingStreak, 'days');
```

**Time Analytics Object:**
```typescript
{
  totalTime: number;              // Seconds
  totalTimeFormatted: string;     // "2h 30m 15s"
  totalSessions: number;
  avgSessionDuration: number;     // Minutes
  longestSession: number;         // Minutes
  shortestSession: number;        // Minutes
  lastSession: number;            // Timestamp
  readingStreak: number;          // Days
  timeDistribution: object;       // Hour-by-hour breakdown
}
```

---

## Engagement Metrics

Measure user engagement with the document:

```javascript
const engagement = analytics.engagementMetrics;

console.log('Total bookmarks:', engagement.totalBookmarks);
console.log('Bookmarked pages:', engagement.uniqueBookmarkedPages);
console.log('Bookmark rate:', engagement.bookmarkRate + '%');
console.log('Engagement score:', engagement.engagementScore, '/100');
```

**Engagement Score Calculation:**
- Completion contributes 40 points
- Bookmarks contribute 30 points
- Session frequency contributes 30 points
- **Total: 0-100**

---

## Page Analytics

Analyze reading patterns and page access:

```javascript
const pageAnalytics = analytics.pageAnalytics;

// Most bookmarked pages
pageAnalytics.mostBookmarkedPages.forEach(p => {
  console.log(`Page ${p.page}: ${p.bookmarks} bookmarks`);
});

// Reading gaps (unread sections)
pageAnalytics.readingGaps.forEach(gap => {
  console.log(`Unread: pages ${gap.start}-${gap.end}`);
});

// Reading pattern
console.log('Pattern:', pageAnalytics.readingPattern);
// "sequential", "random", "chapter-by-chapter", etc.

// Page heatmap
Object.entries(pageAnalytics.heatmap).forEach(([page, count]) => {
  console.log(`Page ${page}: visited ${count} times`);
});
```

---

## Insights Generation

Get personalized reading insights:

```javascript
const insights = analytics.insights;

insights.forEach(insight => {
  console.log(`[${insight.type}] ${insight.title}`);
  console.log(`  ${insight.message}`);
  console.log(`  Priority: ${insight.priority}`);
});
```

**Insight Types:**
- `completion` - Progress-based insights
- `speed` - Reading speed insights
- `engagement` - Engagement insights
- `pattern` - Reading pattern insights
- `recommendation` - Personalized recommendations

**Example Insights:**
```
[completion] Great Progress!
  You've completed 75% of this document.
  Priority: high

[speed] Fast Reader
  Your reading speed is above average at 280 WPM.
  Priority: medium

[engagement] Active Learner
  You've created 15 bookmarks - excellent engagement!
  Priority: high
```

---

## Complete Example: Analytics Dashboard

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAnalytics } from 'react-native-pdf-jsi/src/analytics/hooks/useAnalytics';

const AnalyticsDashboard = ({ pdfId }) => {
  const { analytics, loading, error, refresh } = useAnalytics(pdfId);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error loading analytics</Text>;
  }

  if (!analytics) {
    return <Text>No analytics data available</Text>;
  }

  const { readingMetrics, engagementMetrics, timeAnalytics, insights } = analytics;

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      {/* Progress Overview */}
      <View style={{ padding: 20, backgroundColor: '#6366F1' }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          {readingMetrics.completionRate}%
        </Text>
        <Text style={{ color: 'white' }}>Complete</Text>
        <Text style={{ color: 'white', marginTop: 10 }}>
          {readingMetrics.totalPagesRead} of {readingMetrics.totalPages} pages
        </Text>
      </View>

      {/* Reading Stats */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Reading Statistics
        </Text>

        <StatCard
          label="Time Spent"
          value={timeAnalytics.totalTimeFormatted}
          icon="⏱️"
        />
        <StatCard
          label="Reading Speed"
          value={`${readingMetrics.pagesPerHour} pages/hour`}
          icon="⚡"
        />
        <StatCard
          label="Sessions"
          value={timeAnalytics.totalSessions}
          icon="📚"
        />
        <StatCard
          label="Bookmarks"
          value={engagementMetrics.totalBookmarks}
          icon="🔖"
        />
      </View>

      {/* Insights */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Insights
        </Text>

        {insights.slice(0, 3).map((insight, index) => (
          <View
            key={index}
            style={{
              padding: 15,
              marginBottom: 10,
              backgroundColor: '#f5f5f5',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: getPriorityColor(insight.priority)
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{insight.title}</Text>
            <Text style={{ color: '#666', marginTop: 5 }}>{insight.message}</Text>
          </View>
        ))}
      </View>

      {/* Most Bookmarked Pages */}
      {analytics.pageAnalytics.mostBookmarkedPages.length > 0 && (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Most Bookmarked Pages
          </Text>

          {analytics.pageAnalytics.mostBookmarkedPages.map((page, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                marginBottom: 5,
                backgroundColor: '#f9f9f9',
                borderRadius: 5
              }}
            >
              <Text>Page {page.page}</Text>
              <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>
                {page.bookmarks} bookmarks
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const StatCard = ({ label, value, icon }) => (
  <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  }}>
    <View>
      <Text style={{ fontSize: 12, color: '#666' }}>{label}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>
        {value}
      </Text>
    </View>
    <Text style={{ fontSize: 30 }}>{icon}</Text>
  </View>
);

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return '#FF6B6B';
    case 'medium': return '#FFD93D';
    case 'low': return '#4ECDC4';
    default: return '#999';
  }
};

export default AnalyticsDashboard;
```

---

## useAnalytics Hook

React hook for easy analytics integration:

```javascript
import { useAnalytics } from 'react-native-pdf-jsi/src/analytics/hooks/useAnalytics';

const MyComponent = ({ pdfId }) => {
  const {
    analytics,
    loading,
    error,
    refresh,
    updateProgress,
    trackSession
  } = useAnalytics(pdfId, {
    autoRefresh: true,      // Auto-refresh every 30 seconds
    refreshInterval: 30000
  });

  // Update progress on page change
  const handlePageChange = (page, totalPages) => {
    updateProgress({ currentPage: page, totalPages });
  };

  // Track reading session
  useEffect(() => {
    trackSession('start');
    return () => trackSession('end');
  }, []);

  return (
    <View>
      {analytics && (
        <Text>
          Reading: {analytics.readingMetrics.completionRate}% complete
        </Text>
      )}
    </View>
  );
};
```

---

## Export Analytics

Export analytics data for external analysis:

```javascript
const exportData = await manager.exportAnalytics('my-pdf-id');

console.log('Export data:', exportData);
// Can be saved to file, sent to server, etc.

// Save to file
import RNFS from 'react-native-fs';

const exportPath = `${RNFS.DocumentDirectoryPath}/analytics.json`;
await RNFS.writeFile(exportPath, JSON.stringify(exportData, null, 2));

console.log('Analytics exported to:', exportPath);
```

---

## Reading Predictions

Get predictions based on current reading patterns:

```javascript
const predictions = analytics.predictions;

console.log('Estimated finish date:', predictions.estimatedFinishDate);
console.log('Estimated remaining time:', predictions.estimatedRemainingTime);
console.log('Optimal reading schedule:', predictions.suggestedSchedule);
```

**Predictions Object:**
```typescript
{
  estimatedFinishDate: string;      // ISO date
  estimatedRemainingTime: number;   // Minutes
  suggestedPagesPerDay: number;
  suggestedSchedule: string;        // "Read 15 pages/day for 10 days"
}
```

---

## Real-Time Progress Tracking

Track progress as user reads:

```javascript
import { BookmarkManager } from 'react-native-pdf-jsi/src/bookmarks/BookmarkManager';

const PDFReader = ({ pdfId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionStart] = useState(Date.now());
  const manager = new BookmarkManager();

  const handlePageChange = async (page, totalPages) => {
    setCurrentPage(page);

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - sessionStart) / 1000);

    // Update progress
    await manager.updateProgress(pdfId, {
      currentPage: page,
      totalPages: totalPages,
      lastReadAt: Date.now()
    });

    // Update session
    await manager.updateSession(pdfId, {
      duration: timeSpent,
      pagesRead: page
    });
  };

  return (
    <Pdf
      source={{ uri: pdfPath }}
      onPageChanged={(page, total) => handlePageChange(page, total)}
      style={{ flex: 1 }}
    />
  );
};
```

---

## Session Tracking

Track individual reading sessions:

```javascript
// Start session
const sessionId = await manager.startSession(pdfId);

// Update session during reading
await manager.updateSession(pdfId, {
  duration: timeElapsed,
  pagesRead: currentPage
});

// End session
await manager.endSession(pdfId, sessionId);

// Get session history
const sessions = await manager.getSessions(pdfId);

sessions.forEach(session => {
  console.log('Session on:', new Date(session.startTime));
  console.log('Duration:', session.duration, 'seconds');
  console.log('Pages read:', session.pagesRead);
});
```

---

## Engagement Score

Get engagement score (0-100):

```javascript
const engagementMetrics = analytics.engagementMetrics;

console.log('Engagement score:', engagementMetrics.engagementScore, '/100');
console.log('Total bookmarks:', engagementMetrics.totalBookmarks);
console.log('Bookmark rate:', engagementMetrics.bookmarkRate + '%');
```

**Score Breakdown:**
- **40 points**: Reading completion (0-100%)
- **30 points**: Bookmark usage (more bookmarks = higher score)
- **30 points**: Session frequency (regular reading sessions)

**Interpretation:**
- 80-100: Highly engaged reader
- 60-79: Moderately engaged
- 40-59: Casual reader
- 0-39: Low engagement

---

## Page Heatmap

Visualize page access frequency:

```javascript
const heatmap = analytics.pageAnalytics.heatmap;

// Heatmap: { page: visitCount }
// { 1: 5, 5: 3, 10: 8, ... }

// Find most visited pages
const mostVisited = Object.entries(heatmap)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

mostVisited.forEach(([page, count]) => {
  console.log(`Page ${page}: visited ${count} times`);
});
```

---

## Reading Pattern Analysis

Identify reading patterns:

```javascript
const pattern = analytics.pageAnalytics.readingPattern;

console.log('Reading pattern:', pattern);
// Possible values:
// - "sequential" - Reading in order
// - "random" - Jumping around
// - "chapter-by-chapter" - Reading by sections
// - "selective" - Reading specific pages
```

---

## Reading Gaps

Find unread sections:

```javascript
const gaps = analytics.pageAnalytics.readingGaps;

gaps.forEach(gap => {
  console.log(`Unread section: pages ${gap.start} to ${gap.end}`);
  console.log(`  Pages: ${gap.pages.length}`);
});

// Suggest reading gaps to user
if (gaps.length > 0) {
  Alert.alert(
    'Unread Sections',
    `You have ${gaps.length} unread sections. Would you like to continue reading?`
  );
}
```

---

## Complete Analytics Example

Full implementation with all features:

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AnalyticsManager } from 'react-native-pdf-jsi/src/analytics/AnalyticsManager';
import { CircularProgress, StatCard } from 'react-native-pdf-jsi/src/analytics/components/SimpleCharts';

const ComprehensiveAnalytics = ({ pdfId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [manager] = useState(() => new AnalyticsManager());

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [pdfId]);

  const loadAnalytics = async () => {
    try {
      await manager.initialize();
      const data = await manager.getAnalytics(pdfId);
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  if (!analytics) {
    return <Text>Loading analytics...</Text>;
  }

  const { readingMetrics, timeAnalytics, engagementMetrics, insights } = analytics;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Progress Ring */}
      <View style={{ alignItems: 'center', padding: 30, backgroundColor: 'white' }}>
        <CircularProgress
          percentage={readingMetrics.completionRate}
          size={150}
          strokeWidth={12}
          color="#6366F1"
        />
        <Text style={{ marginTop: 20, fontSize: 24, fontWeight: 'bold' }}>
          {readingMetrics.completionRate}% Complete
        </Text>
        <Text style={{ color: '#666' }}>
          {readingMetrics.totalPagesRead} of {readingMetrics.totalPages} pages
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <StatCard
            label="Time Spent"
            value={timeAnalytics.totalTimeFormatted}
            icon="⏱️"
            style={{ width: '48%', margin: '1%' }}
          />
          <StatCard
            label="Reading Speed"
            value={`${readingMetrics.pagesPerHour}/hr`}
            icon="⚡"
            style={{ width: '48%', margin: '1%' }}
          />
          <StatCard
            label="Sessions"
            value={timeAnalytics.totalSessions}
            icon="📚"
            style={{ width: '48%', margin: '1%' }}
          />
          <StatCard
            label="Engagement"
            value={`${engagementMetrics.engagementScore}/100`}
            icon="🎯"
            style={{ width: '48%', margin: '1%' }}
          />
        </View>
      </View>

      {/* Insights */}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Insights
        </Text>

        {insights.map((insight, index) => (
          <View
            key={index}
            style={{
              padding: 15,
              marginBottom: 10,
              backgroundColor: 'white',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: getPriorityColor(insight.priority)
            }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              {insight.title}
            </Text>
            <Text style={{ color: '#666' }}>{insight.message}</Text>
          </View>
        ))}
      </View>

      {/* Most Bookmarked Pages */}
      {analytics.pageAnalytics.mostBookmarkedPages.length > 0 && (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Most Bookmarked
          </Text>

          {analytics.pageAnalytics.mostBookmarkedPages.map((page, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                marginBottom: 5,
                backgroundColor: 'white',
                borderRadius: 5
              }}
            >
              <Text>Page {page.page}</Text>
              <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>
                {page.bookmarks} bookmarks
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const getPriorityColor = (priority) => {
  const colors = {
    high: '#FF6B6B',
    medium: '#FFD93D',
    low: '#4ECDC4'
  };
  return colors[priority] || '#999';
};

export default ComprehensiveAnalytics;
```

---

## Export Analytics Data

```javascript
const exportedData = await manager.exportAnalytics('my-pdf-id');

// Exported data includes all analytics
const data = {
  pdfId: 'my-pdf-id',
  readingMetrics: { ... },
  timeAnalytics: { ... },
  engagementMetrics: { ... },
  pageAnalytics: { ... },
  insights: [ ... ],
  bookmarks: [ ... ],
  sessions: [ ... ],
  exportedAt: '2025-01-06T...'
};

// Use for:
// - Backup
// - Cloud sync
// - External analysis
// - Sharing with study groups
```

---

## Best Practices

### 1. Initialize Once

```javascript
const [manager] = useState(() => new AnalyticsManager());

useEffect(() => {
  manager.initialize();
}, []);
```

### 2. Update Progress Frequently

```javascript
// Update on every page change
onPageChanged={(page, total) => {
  manager.updateProgress(pdfId, { currentPage: page, totalPages: total });
}}
```

### 3. Track Sessions

```javascript
useEffect(() => {
  manager.startSession(pdfId);
  return () => manager.endSession(pdfId);
}, [pdfId]);
```

### 4. Refresh Analytics Periodically

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    refresh();
  }, 30000); // Every 30 seconds
  return () => clearInterval(interval);
}, []);
```

---

## See Also

- [Bookmarks](/docs/features/bookmarks) - Bookmark system
- [useAnalytics Hook](/docs/api/hooks#useanalytics) - React hook
- [AnalyticsDashboard Component](/docs/api/analytics-components) - UI components
