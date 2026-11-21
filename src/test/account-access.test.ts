import { describe, expect, it, vi } from "vitest";
import { signUpAndSignIn } from "@/lib/account-access";

describe("Immediate email signup", () => {
  it("returns the new signed-in session without an inbox link or extra login request", async () => {
    const result = { data: { session: { user: { id: "new-user" } } }, error: null };
    const auth = { signUp: vi.fn().mockResolvedValue(result), signInWithPassword: vi.fn() };
    expect(await signUpAndSignIn(auth, " new@example.com ", "a-strong-password", " New User ", "https://pulse.example")).toEqual(result);
    expect(auth.signUp).toHaveBeenCalledWith({ email: "new@example.com", password: "a-strong-password", options: { emailRedirectTo: "https://pulse.example", data: { display_name: "New User" } } });
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("attempts password sign-in if signup has not returned a session", async () => {
    const session = { data: { session: { user: { id: "returning-user" } } }, error: null };
    const auth = { signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: null }), signInWithPassword: vi.fn().mockResolvedValue(session) };
    expect(await signUpAndSignIn(auth, " new@example.com ", "a-strong-password", "", "https://pulse.example")).toEqual(session);
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: "new@example.com", password: "a-strong-password" });
  });

  it("returns signup errors without retrying invalid credentials", async () => {
    const result = { data: { session: null }, error: { message: "User already registered" } };
    const auth = { signUp: vi.fn().mockResolvedValue(result), signInWithPassword: vi.fn() };
    expect(await signUpAndSignIn(auth, "new@example.com", "a-strong-password", "", "https://pulse.example")).toEqual(result);
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });
});