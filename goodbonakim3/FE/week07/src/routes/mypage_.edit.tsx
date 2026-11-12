import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../pages/members/edit-profile-page";

export const Route = createFileRoute("/mypage_/edit")({ component: EditProfilePage });
