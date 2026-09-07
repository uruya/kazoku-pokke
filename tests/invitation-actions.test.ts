import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteMany: vi.fn(),
  revalidatePath: vi.fn(),
  requireHousehold: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/invitations", () => ({
  createInvitationToken: vi.fn(),
  hashInvitationToken: vi.fn(),
  invitationExpiresAt: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    householdInvitation: { create: vi.fn(), deleteMany: mocks.deleteMany },
    $transaction: vi.fn(),
  },
}));
vi.mock("@/lib/session", () => ({
  getCurrentUser: vi.fn(),
  requireHousehold: mocks.requireHousehold,
  setActiveHouseholdCookie: vi.fn(),
}));

import { revokeInvitation } from "../app/actions/invitations";

describe("招待リンクの無効化", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireHousehold.mockResolvedValue({
      householdId: "household-1",
      membership: { role: "OWNER" },
    });
  });

  it("対象リンクを削除して家庭管理画面を再検証する", async () => {
    mocks.deleteMany.mockResolvedValue({ count: 1 });

    await expect(revokeInvitation("invitation-1")).resolves.toEqual({
      success: true,
      message: "招待リンクを無効にしました。",
    });
    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "invitation-1",
        householdId: "household-1",
        acceptedAt: null,
      },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/households");
  });

  it("対象が存在しない場合は成功扱いにしない", async () => {
    mocks.deleteMany.mockResolvedValue({ count: 0 });

    await expect(revokeInvitation("invitation-1")).resolves.toEqual({
      success: false,
      message: "この招待リンクはすでに無効か、使用済みです。",
    });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
