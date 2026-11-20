import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountSession, useAccount, useSignOut } from "@/components/AccountSession";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(), signOut: vi.fn(), onAuthStateChange: vi.fn(),
  cancelQueries: vi.fn(), clear: vi.fn(), invalidateQueries: vi.fn(),
  invalidate: vi.fn(), navigate: vi.fn(), unbindUser: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: mocks } }));
vi.mock("@tanstack/react-query", () => ({ useQueryClient: () => mocks }));
vi.mock("@tanstack/react-router", () => ({ useRouter: () => mocks, useNavigate: () => mocks.navigate }));
vi.mock("@/lib/store", () => ({ unbindUser: mocks.unbindUser }));

function AccountProbe() {
  const { user, loading } = useAccount();
  return <output>{loading ? "pending" : user?.id ?? "signed-out"}</output>;
}
function SignOutProbe() {
  const signOut = useSignOut();
  return <button onClick={signOut}>Exit</button>;
}

describe("Remembered accounts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    mocks.getUser.mockResolvedValue({ data: { user: { id: "returning-user" } } });
    mocks.signOut.mockResolvedValue({ error: null });
  });
  afterEach(cleanup);

  it("restores a verified returning account without another signup", async () => {
    render(<AccountSession><AccountProbe /></AccountSession>);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("returning-user"));
    expect(mocks.getUser).toHaveBeenCalledOnce();
  });

  it("does not restore a stale account after sign-out during verification", async () => {
    let finish: ((value: { data: { user: { id: string } } }) => void) | undefined;
    mocks.getUser.mockReturnValue(new Promise((resolve) => { finish = resolve; }));
    render(<AccountSession><AccountProbe /></AccountSession>);
    const callback = mocks.onAuthStateChange.mock.calls[0]?.[0];
    if (!callback || !finish) throw new Error("Account verification did not start");
    await act(async () => {
      callback("SIGNED_OUT", null);
      finish?.({ data: { user: { id: "stale-user" } } });
    });
    expect(screen.getByRole("status")).toHaveTextContent("signed-out");
  });

  it("logs out only this browser and clears personal queries before ending its session", async () => {
    render(<SignOutProbe />);
    await act(async () => screen.getByRole("button", { name: "Exit" }).click());
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(mocks.cancelQueries.mock.invocationCallOrder[0]).toBeLessThan(mocks.clear.mock.invocationCallOrder[0] ?? 0);
    expect(mocks.clear.mock.invocationCallOrder[0]).toBeLessThan(mocks.signOut.mock.invocationCallOrder[0] ?? 0);
    expect(mocks.unbindUser).toHaveBeenCalledOnce();
    expect(mocks.navigate).toHaveBeenCalledWith({ to: "/auth", replace: true });
  });
});