import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("defaults to type=button", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("forwards extra props like disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
