import { describe, expect, test } from "vitest";

import BackToPrev from "@components/BackToPrev.astro";
import { renderAstroComponent } from "./helpers";

describe("BackToPrev", () => {
  test("should render the link with correct href and slot content", async () => {
    // Arrange
    const href = "/previous-page";
    const content = "Go Back";

    // Act
    const result = await renderAstroComponent(BackToPrev, {
      props: { href },
      slots: {
        default: content,
      },
    });
    const resultText = result.textContent;
    const link = result.querySelector("a");

    // Assert
    expect(resultText).toContain(content);
    expect(link?.getAttribute("href")).toBe(href);
  });
});
