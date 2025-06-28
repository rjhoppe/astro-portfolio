import { describe, expect, test } from "vitest";

import ArrowCard from "@components/ArrowCard.astro";
import type { CollectionEntry } from "astro:content";
import { renderAstroComponent } from "./helpers";

describe("ArrowCard", () => {
  test("should render a blog post entry correctly", async () => {
    // Arrange
    const mockPost: Partial<CollectionEntry<"blog">> = {
      collection: "blog",
      slug: "test-post",
      data: {
        title: "Test Post Title",
        description: "A short description for the test post.",
        date: new Date(),
        draft: false,
      },
    };

    // Act
    const result = await renderAstroComponent(ArrowCard, {
      props: { entry: mockPost as CollectionEntry<"blog"> },
    });
    const resultText = result.textContent;
    const link = result.querySelector("a");

    // Assert
    expect(resultText).toContain("Test Post Title");
    expect(resultText).toContain("A short description for the test post.");
    expect(link?.getAttribute("href")).toBe("/blog/test-post");
  });

  test("should render a project entry correctly", async () => {
    // Arrange
    const mockProject: Partial<CollectionEntry<"projects">> = {
      collection: "projects",
      slug: "test-project",
      data: {
        title: "Test Project Title",
        description: "A short description for the test project.",
        date: new Date(),
        draft: false,
      },
    };

    // Act
    const result = await renderAstroComponent(ArrowCard, {
      props: { entry: mockProject as CollectionEntry<"projects"> },
    });
    const resultText = result.textContent;
    const link = result.querySelector("a");

    // Assert
    expect(resultText).toContain("Test Project Title");
    expect(resultText).toContain("A short description for the test project.");
    expect(link?.getAttribute("href")).toBe("/projects/test-project");
  });
});
