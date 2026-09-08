import {
  defineRailway,
  fn,
  github,
  preserve,
  project,
  service,
} from "railway/iac";

export default defineRailway(() => {
  const source = github("uruya/kazoku-pokke", { checkSuites: false });
  const kazokuPokke = service("kazoku-pokke", {
    source,
    replicas: { "asia-southeast1-eqsg3a": 1 },
    healthcheck: "/api/health",
    healthcheckTimeout: 300,
    deploy: { sleepApplication: true },
    domains: ["kazoku-pokke.jp"],
    networking: { privateNetworkEndpoint: "kosodate-note" },
    env: {
      CONTACT_EMAIL: preserve(),
      CRON_SECRET: preserve(),
      DATABASE_URL: preserve(),
      DIRECT_URL: preserve(),
      NEXT_PUBLIC_APP_URL: preserve(),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: preserve(),
      NEXT_PUBLIC_SUPABASE_URL: preserve(),
      NEXT_PUBLIC_VAPID_PUBLIC_KEY: preserve(),
      REMINDER_EMAIL_FROM: preserve(),
      RESEND_API_KEY: preserve(),
      VAPID_PRIVATE_KEY: preserve(),
      VAPID_SUBJECT: preserve(),
    },
  });

  const reminders = fn("reminders", {
    source,
    start: "npm run reminders:trigger",
    deploy: {
      cronSchedule: "0 23 * * *",
      restartPolicyType: "NEVER",
    },
    env: {
      CRON_SECRET: kazokuPokke.env.CRON_SECRET,
      NEXT_PUBLIC_APP_URL: kazokuPokke.env.NEXT_PUBLIC_APP_URL,
    },
  });

  return project("genuine-reverence", {
    resources: [kazokuPokke, reminders],
  });
});
