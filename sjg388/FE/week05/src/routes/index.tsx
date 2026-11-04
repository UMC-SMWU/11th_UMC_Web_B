import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/movies/home-page";

export const Route = createFileRoute("/")({
  component: HomePage,
});