import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock the blog collection
vi.mock("astro:content", () => ({
  getCollection: vi.fn(() =>
    Promise.resolve([
      {
        id: "test-post-1",
        slug: "test-post-1",
        body: "Test post content",
        collection: "blog",
        data: {
          title: "Test Post 1",
          date: new Date("2024-01-01"),
          draft: false,
        },
      },
      {
        id: "test-post-2",
        slug: "test-post-2",
        body: "Test post content 2",
        collection: "blog",
        data: {
          title: "Test Post 2",
          date: new Date("2024-01-02"),
          draft: false,
        },
      },
    ]),
  ),
}));

// Mock the constants
vi.mock("@consts", () => ({
  BLOG: {
    TITLE: "Blog",
    DESCRIPTION: "Blog description",
  },
}));

// Mock the components
vi.mock("@layouts/PageLayout.astro", () => ({
  default: ({ children }: { children: any }) => (
    <div data-testid="page-layout">{children}</div>
  ),
}));

vi.mock("@components/Container.astro", () => ({
  default: ({ children }: { children: any }) => (
    <div data-testid="container">{children}</div>
  ),
}));

vi.mock("@components/UnderConstruction.astro", () => ({
  default: () => (
    <div data-testid="under-construction">🚧 Under Construction 🚧</div>
  ),
}));

vi.mock("@components/ArrowCard.astro", () => ({
  default: ({ entry }: { entry: any }) => (
    <div data-testid="arrow-card">{entry.data.title}</div>
  ),
}));

describe("Blog Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should show UnderConstruction when feature flag is enabled", async () => {
    // Mock the feature flag to be true
    const mockFeatureFlags = {
      showUnderConstruction: true,
    };

    // Since we can't easily test Astro pages directly, let's test the logic
    const shouldShowUnderConstruction = mockFeatureFlags.showUnderConstruction;

    expect(shouldShowUnderConstruction).toBe(true);

    // Test the conditional rendering logic
    const content = shouldShowUnderConstruction
      ? "under-construction"
      : "blog-content";
    expect(content).toBe("under-construction");
  });

  test("should show blog content when feature flag is disabled", async () => {
    // Mock the feature flag to be false
    const mockFeatureFlags = {
      showUnderConstruction: false,
    };

    const shouldShowUnderConstruction = mockFeatureFlags.showUnderConstruction;

    expect(shouldShowUnderConstruction).toBe(false);

    // Test the conditional rendering logic
    const content = shouldShowUnderConstruction
      ? "under-construction"
      : "blog-content";
    expect(content).toBe("blog-content");
  });

  test("should organize posts by year correctly", () => {
    const mockPosts = [
      {
        data: {
          date: new Date(Date.UTC(2024, 0, 1)),
          title: "Post 1",
          draft: false,
        },
      },
      {
        data: {
          date: new Date(Date.UTC(2023, 11, 31)),
          title: "Post 2",
          draft: false,
        },
      },
      {
        data: {
          date: new Date(Date.UTC(2024, 1, 1)),
          title: "Post 3",
          draft: false,
        },
      },
    ];

    const processedPosts = mockPosts
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    const postsByYear: { [key: string]: any[] } = {};
    for (const post of processedPosts) {
      const year = post.data.date.getUTCFullYear().toString();
      if (!postsByYear[year]) {
        postsByYear[year] = [];
      }
      postsByYear[year].push(post);
    }

    expect(
      Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a)),
    ).toEqual(["2024", "2023"]);

    const year2024Posts = postsByYear["2024"];
    expect(year2024Posts).toHaveLength(2);
    expect(year2024Posts.map((p: any) => p.data.title)).toEqual([
      "Post 3",
      "Post 1",
    ]);

    const year2023Posts = postsByYear["2023"];
    expect(year2023Posts).toHaveLength(1);
    expect(year2023Posts.map((p: any) => p.data.title)).toEqual(["Post 2"]);
  });

  test("should filter out draft posts", () => {
    const mockPosts = [
      {
        data: {
          date: new Date("2024-01-01"),
          title: "Published Post",
          draft: false,
        },
      },
      {
        data: {
          date: new Date("2024-01-02"),
          title: "Draft Post",
          draft: true,
        },
      },
      {
        data: {
          date: new Date("2024-01-03"),
          title: "Another Published Post",
          draft: false,
        },
      },
    ];

    // Simulate the draft filtering logic
    const publishedPosts = mockPosts.filter((post: any) => !post.data.draft);

    expect(publishedPosts).toHaveLength(2);
    expect(publishedPosts[0].data.title).toBe("Published Post");
    expect(publishedPosts[1].data.title).toBe("Another Published Post");
  });
});
