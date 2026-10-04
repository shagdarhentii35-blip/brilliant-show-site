import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/bonuses")({
  component: BonusesLayout,
});

function BonusesLayout() {
  return <Outlet />;
}
