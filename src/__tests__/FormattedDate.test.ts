import { describe, expect, test } from "vitest";

import FormattedDate from "@components/FormattedDate.astro";
import { renderAstroComponent } from "./helpers";

describe("FormattedDate", () => {
  test("should render the date in the correct format", async () => {
    // Arrange
    const testDate = new Date("2024-01-15T12:00:00Z");

    // Act
    const result = await renderAstroComponent(FormattedDate, {
      props: { date: testDate },
    });
    const resultText = result.textContent?.trim();

    // Assert
    expect(result.querySelector("time")?.getAttribute("datetime")).toBe(
      testDate.toISOString(),
    );
    expect(resultText).toBe("Jan 15, 2024");
  });

  test("should handle another date correctly", async () => {
    // Arrange
    const anotherTestDate = new Date("2023-05-20T12:00:00Z");

    // Act
    const result = await renderAstroComponent(FormattedDate, {
      props: { date: anotherTestDate },
    });
    const resultText = result.textContent?.trim();

    // Assert
    expect(result.querySelector("time")?.getAttribute("datetime")).toBe(
      anotherTestDate.toISOString(),
    );
    expect(resultText).toBe("May 20, 2023");
  });
});
