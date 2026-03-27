import { BoardState } from "./types";

/** Initial board state with representative dummy data. */
export const initialBoardState: BoardState = {
  columns: [
    { id: "col-1", title: "Backlog" },
    { id: "col-2", title: "To Do" },
    { id: "col-3", title: "In Progress" },
    { id: "col-4", title: "Review" },
    { id: "col-5", title: "Done" },
  ],
  cards: [
    {
      id: "card-1",
      title: "Set up project repository",
      details: "Initialize git repo, add .gitignore, set up branch protection rules.",
      columnId: "col-5",
    },
    {
      id: "card-2",
      title: "Design database schema",
      details: "Define tables for users, projects and tasks with proper foreign keys.",
      columnId: "col-5",
    },
    {
      id: "card-3",
      title: "Build authentication API",
      details: "Implement JWT-based login and registration endpoints.",
      columnId: "col-4",
    },
    {
      id: "card-4",
      title: "Create dashboard UI",
      details: "Design the main dashboard layout with sidebar navigation and header.",
      columnId: "col-3",
    },
    {
      id: "card-5",
      title: "Integrate payment gateway",
      details: "Add Stripe integration for subscription billing.",
      columnId: "col-3",
    },
    {
      id: "card-6",
      title: "Write API documentation",
      details: "Document all REST endpoints using OpenAPI/Swagger spec.",
      columnId: "col-2",
    },
    {
      id: "card-7",
      title: "Add email notifications",
      details: "Send automated emails on signup, password reset and key events.",
      columnId: "col-2",
    },
    {
      id: "card-8",
      title: "Performance audit",
      details: "Profile core pages with Lighthouse and address bottlenecks.",
      columnId: "col-1",
    },
    {
      id: "card-9",
      title: "Mobile responsive layout",
      details: "Ensure all pages render correctly on mobile and tablet breakpoints.",
      columnId: "col-1",
    },
  ],
};
