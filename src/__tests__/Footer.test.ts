import { describe, expect, test } from "vitest";

import Footer from "@components/Footer.astro";
import { SITE } from "@consts";
import { renderAstroComponent } from "./helpers";

describe("Footer", () => {
  test("should render the copyright and theme buttons", async () => {
    // Act
    const result = await renderAstroComponent(Footer);
    const resultText = result.textContent;

    // Assert for copyright
    expect(resultText).toContain(`© 2024 | ${SITE.NAME}`);

    // Assert for theme buttons
    const lightThemeButton = result.querySelector("#light-theme-button");
    expect(lightThemeButton).not.toBeNull();
    expect(lightThemeButton?.getAttribute("aria-label")).toBe("Light theme");

    const darkThemeButton = result.querySelector("#dark-theme-button");
    expect(darkThemeButton).not.toBeNull();
    expect(darkThemeButton?.getAttribute("aria-label")).toBe("Dark theme");

    const systemThemeButton = result.querySelector("#system-theme-button");
    expect(systemThemeButton).not.toBeNull();
    expect(systemThemeButton?.getAttribute("aria-label")).toBe("System theme");
  });
});
