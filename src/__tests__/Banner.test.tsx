import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Banner } from "@/components/Banner";

test("renders banner when isVisible is true", () => {
  render(<Banner isVisible={true} />);

  expect(
    screen.getByText(/you've made updates to the table/i),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/please submit your changes to save them/i),
  ).toBeInTheDocument();
});

test("does not render when isVisible is false", () => {
  render(<Banner isVisible={false} />);

  expect(screen.queryByRole("region")).not.toBeInTheDocument();
});
