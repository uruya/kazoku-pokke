import { isValidCronAuthorization } from "@/lib/cron-auth";
import { runDueDateReminders } from "@/lib/reminder-runner";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (
    !isValidCronAuthorization(
      request.headers.get("authorization"),
      process.env.CRON_SECRET,
    )
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runDueDateReminders();
  return Response.json(result, { status: result.failed > 0 ? 500 : 200 });
}
