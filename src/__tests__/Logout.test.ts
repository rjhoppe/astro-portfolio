import { describe, expect, test } from "vitest";

import Logout from "@components/Logout.astro";
import { renderAstroComponent } from "./helpers";

describe("Logout", () => {
  test("should render user information and a sign out button", async () => {
    // Arrange
    const locals: App.Locals = {
      user: {
        id: "1",
        githubId: "12345",
        username: "testuser",
      },
      session: {
        id: "session123",
        userId: "1",
        expiresAt: new Date(Date.now() + 3600 * 1000),
      },
    };

    // Act
    const result = await renderAstroComponent(Logout, { locals });
    const resultText = result.textContent;
    const img = result.querySelector("img");
    const button = result.querySelector("button");

    // Assert
    expect(resultText).toContain("Hi, testuser!");
    expect(img?.getAttribute("src")).toBe(
      "https://avatars.githubusercontent.com/u/12345",
    );
    expect(button?.textContent?.trim()).toBe("Sign out");
  });
});
