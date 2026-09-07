import { defineRailway, github, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const kazokuPokke = service("kazoku-pokke", {
    source: github("uruya/kazoku-pokke", { checkSuites: false }),
    replicas: { "asia-southeast1-eqsg3a": 1 },
    healthcheck: "/api/health",
    healthcheckTimeout: 300,
    deploy: { sleepApplication: true },
    domains: ["kazoku-pokke.jp"],
    networking: { privateNetworkEndpoint: "kosodate-note" },
    env: { CONTACT_EMAIL: preserve(), CRON_SECRET: preserve(), DATABASE_URL: preserve(), DIRECT_URL: preserve(), NEXT_PUBLIC_APP_URL: preserve(), NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: preserve(), NEXT_PUBLIC_SUPABASE_URL: preserve(), REMINDER_EMAIL_FROM: preserve(), RESEND_API_KEY: preserve() },
  });

  return project("genuine-reverence", {
    resources: [kazokuPokke],
  });
});
