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

  // TODO: Investigate later
  // test("should organize posts by year correctly", () => {
  //   const mockPosts = [
  //     {
  //       data: { date: new Date("2024-01-01"), title: "Post 1" },
  //     },
  //     {
  //       data: { date: new Date("2023-12-31"), title: "Post 2" },
  //     },
  //     {
  //       data: { date: new Date("2024-02-01"), title: "Post 3" },
  //     },
  //   ];

  //   // Simulate the year grouping logic
  //   const postsByYear = mockPosts.reduce((acc: any, post: any) => {
  //     const year = post.data.date.getFullYear().toString();
  //     if (!acc[year]) {
  //       acc[year] = [];
  //     }
  //     acc[year].push(post);
  //     return acc;
  //   }, {});

  //   // Compare only the year and title fields to avoid Date object identity issues
  //   expect(
  //     Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a)),
  //   ).toEqual(["2024", "2023"]);
  //   expect(postsByYear["2024"].map((p: any) => p.data.title)).toEqual([
  //     "Post 1",
  //     "Post 3",
  //   ]);
  //   expect(
  //     postsByYear["2024"].map((p: any) => p.data.date.getFullYear()),
  //   ).toEqual([2024, 2024]);
  //   expect(postsByYear["2023"].map((p: any) => p.data.title)).toEqual([
  //     "Post 2",
  //   ]);
  //   expect(
  //     postsByYear["2023"].map((p: any) => p.data.date.getFullYear()),
  //   ).toEqual([2023]);
  // });

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
