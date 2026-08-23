import {
  Badge,
  Button,
  EmptyState,
  PALETTE_AREA,
  ROUTES_AREA,
  SIDEBAR_NAV_AREA,
  host,
  useQuery,
  useValue
} from "@hermes/plugin-sdk";
import { jsx, jsxs } from "react/jsx-runtime";

const ID = "hermes-mission-control";
const REFRESH_MS = 15_000;
const panel = {
  border: "1px solid var(--ui-stroke-secondary)",
  borderRadius: "8px",
  padding: "1rem",
};
const grid = {
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
};
const muted = { color: "var(--ui-text-secondary)" };

function known(value, fallback = "unknown") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function Section({ title, children }) {
  return jsxs("section", { style: panel, children: [jsx("h2", { children: title }), children] });
}

function ProfileCard({ item }) {
  return jsxs("article", {
    style: panel,
    children: [
      jsx("strong", { children: known(item.name) }),
      jsx("div", { style: muted, children: `Model: ${known(item.model)}` }),
      jsx("div", { style: muted, children: `Provider: ${known(item.provider)}` }),
      jsx("div", { style: muted, children: `Skills: ${known(item.skill_count)}` }),
    ],
  });
}

function ScheduleRow({ item }) {
  const outcome = item.last_status ?? "unavailable";
  return jsxs("article", {
    style: panel,
    children: [
      jsxs("div", { children: [jsx("strong", { children: known(item.display_name, "Cron job") }), " ", jsx(Badge, { children: item.enabled === true ? "enabled" : item.enabled === false ? "disabled" : "unknown" })] }),
      jsx("div", { style: muted, children: `Schedule: ${known(item.schedule, "unavailable")}` }),
      jsx("div", { style: muted, children: `State: ${known(item.state)}` }),
      jsx("div", { style: muted, children: `Next run: ${known(item.next_run_at, "unavailable")}` }),
      jsx("div", { style: muted, children: `Last run: ${known(item.last_run_at, "unavailable")}` }),
      jsx("div", { style: muted, children: `Last outcome: ${known(outcome, "unavailable")}` }),
    ],
  });
}

function MissionControl() {
  const gateway = useValue(host.state.gateway);
  const connectionId = useValue(host.state.connectionId);
  const profile = useValue(host.state.profile);
  const model = useValue(host.state.model);
  const busy = useValue(host.state.busy);
  const busyBySession = useValue(host.state.busyBySession);
  const connectionKey = connectionId ?? "local";
  const activeWork = busyBySession === null || typeof busyBySession !== "object" ? "unknown" : Object.values(busyBySession).some((value) => value === true) ? "present" : "none";

  const profiles = useQuery({
    queryKey: [ID, "profiles", connectionKey, profile],
    queryFn: async () => {
      const result = await host.request("profiles.list", { include_sessions: false });
      const items = Array.isArray(result) ? result : Array.isArray(result?.profiles) ? result.profiles : [];
      return items.map(({ name, model: itemModel, provider, skill_count }) => ({ name, model: itemModel, provider, skill_count }));
    },
    refetchInterval: 15_000,
    enabled: gateway === "open",
  });
  const schedule = useQuery({
    queryKey: [ID, "schedule", connectionKey, profile],
    queryFn: async () => {
      const result = await host.request("cron.manage", { action: "list", include_disabled: true });
      const rawJobs = Array.isArray(result?.jobs) ? result.jobs : [];
      return rawJobs.map(({ job_id, name, prompt_preview, schedule, enabled, state, next_run_at, last_run_at, last_status }) => {
        const promptDerived = typeof name === "string" && name.length > 0 && typeof prompt_preview === "string" && prompt_preview.length > 0 && prompt_preview.startsWith(name);
        const display_name = promptDerived ? job_id : (name || job_id || "Cron job");
        return { display_name, schedule, enabled, state, next_run_at, last_run_at, last_status };
      });
    },
    refetchInterval: REFRESH_MS,
    enabled: gateway === "open",
  });
  const refresh = () => {
    if (gateway !== "open") return;
    return Promise.all([profiles.refetch(), schedule.refetch()]);
  };
  const profileItems = gateway === "open" ? profiles.data ?? [] : [];
  const jobs = gateway === "open" ? schedule.data ?? [] : [];

  return jsxs("main", {
    style: { padding: "1.25rem", display: "grid", gap: "1rem" },
    children: [
      jsxs("header", { children: [jsx("h1", { children: "Mission Control" }), jsx(Button, { onClick: refresh, disabled: gateway !== "open", children: "Refresh" })] }),
      jsx(Section, { title: "Overview", children: jsxs("div", { style: grid, children: [
        jsx("div", { children: `Gateway: ${known(gateway?.status ?? gateway, "unavailable")}` }),
        jsx("div", { children: `Active profile: ${known(profile)}` }),
        jsx("div", { children: `Model: ${known(model)}` }),
        jsx("div", { children: `Busy: ${busy === true ? "yes" : busy === false ? "no" : "unknown"}` }),
        jsx("div", { children: `Active work: ${activeWork}` }),
      ] }) }),
      jsx(Section, { title: "Profiles", children: profiles.isError
        ? jsx(EmptyState, { title: "Profiles unavailable", description: "The profile roster could not be loaded." })
        : profiles.isLoading ? jsx("p", { children: "Profiles unavailable while loading" })
          : profileItems.length ? jsx("div", { style: grid, children: profileItems.map((item) => jsx(ProfileCard, { item }, item.name)) })
            : jsx(EmptyState, { title: "Profiles unavailable", description: "No profile roster is available for this connection." }) }),
      jsx(Section, { title: "Tasks", children: jsx(EmptyState, { title: "Not connected", description: "Use the Hermes Kanban surface." }) }),
      jsx(Section, { title: "Schedule", children: schedule.isError
        ? jsx(EmptyState, { title: "Schedule unavailable", description: "Scheduled jobs could not be loaded." })
        : schedule.isLoading ? jsx("p", { children: "Schedule unavailable while loading" })
          : jobs.length ? jsx("div", { style: grid, children: jobs.map((item, index) => jsx(ScheduleRow, { item }, `${item.display_name}-${index}`)) })
            : jsx(EmptyState, { title: "Schedule unavailable", description: "No scheduled jobs are available for this connection." }) }),
      jsx(Section, { title: "Library", children: jsx(EmptyState, { title: "Not connected", description: "Use an approved Hermes filesystem or library surface." }) }),
    ],
  });
}

export default {
  id: ID,
  name: "Mission Control",
  defaultEnabled: false,
  register(ctx) {
    ctx.register({ id: "route", area: ROUTES_AREA, data: { path: "/mission-control" }, render: () => jsx(MissionControl, {}) });
    ctx.register({ id: "sidebar", area: SIDEBAR_NAV_AREA, data: { path: "/mission-control", label: "Mission Control", codicon: "dashboard" } });
    ctx.register({ id: "palette", area: PALETTE_AREA, data: { id: `${ID}.open`, label: "Open Mission Control", run: () => host.navigate("/mission-control") } });
  },
};
