import { describe, expect, it } from "vitest";
import {
  createInvitationToken,
  hashInvitationToken,
  invitationExpiresAt,
  isUsableInvitation,
} from "../lib/invitations";

describe("household invitations", () => {
  it("stores a hash instead of the invitation token", () => {
    const invitation = createInvitationToken();

    expect(invitation.token).not.toBe(invitation.tokenHash);
    expect(invitation.tokenHash).toBe(
      hashInvitationToken(invitation.token),
    );
    expect(invitation.tokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("expires seven days after creation", () => {
    const from = new Date("2026-08-25T00:00:00.000Z");

    expect(invitationExpiresAt(from).toISOString()).toBe(
      "2026-09-01T00:00:00.000Z",
    );
  });

  it("only accepts an unused invitation before expiry", () => {
    const now = new Date("2026-08-25T00:00:00.000Z");

    expect(
      isUsableInvitation(
        {
          acceptedAt: null,
          expiresAt: new Date("2026-08-26T00:00:00.000Z"),
        },
        now,
      ),
    ).toBe(true);
    expect(
      isUsableInvitation(
        {
          acceptedAt: now,
          expiresAt: new Date("2026-08-26T00:00:00.000Z"),
        },
        now,
      ),
    ).toBe(false);
    expect(
      isUsableInvitation(
        {
          acceptedAt: null,
          expiresAt: now,
        },
        now,
      ),
    ).toBe(false);
  });
});
