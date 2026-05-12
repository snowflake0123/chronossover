import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Message } from "@/domain/message";
import { MessageListItem } from "./MessageListItem";

const message: Message = {
  id: "abc-123",
  user: { id: "hikari2051", name: "光ちゃん" },
  date: "2051-04-12T14:23:56+09:00",
  body: "今日のランチは超美味しかった！",
};

describe("MessageListItem", () => {
  it("renders the user name, id, and body", () => {
    render(
      <MemoryRouter>
        <MessageListItem message={message} />
      </MemoryRouter>,
    );
    expect(screen.getByText("光ちゃん")).toBeInTheDocument();
    expect(screen.getByText("@hikari2051")).toBeInTheDocument();
    expect(screen.getByText(/今日のランチ/)).toBeInTheDocument();
  });

  it("links to /message/:id", () => {
    render(
      <MemoryRouter>
        <MessageListItem message={message} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/message/abc-123");
  });
});
