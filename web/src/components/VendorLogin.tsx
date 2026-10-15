import { useState, type FormEvent } from "react";
import { RollingText } from "./RollingText";
import { signIn } from "../lib/vendor";

/** Email and access code, written as label/value rows like the rest of the page. */
export function VendorLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("Enter");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return flash("Check the email address");
    setBusy(true);
    setStatus("Checking");
    const result = await signIn(email, code);
    setBusy(false);
    if (result.ok) return onSignedIn();
    flash(result.error);
  }
  function flash(message: string) {
    setStatus(message);
    setTimeout(() => setStatus("Enter"), 1800);
  }

  return (
    <form className="vendor-login" onSubmit={submit} noValidate>
      <div className="half">
        <span>Vendor access</span>
        <span>Pricing is for authorized vendors. Sign in with your email and access code.</span>
      </div>
      <div className="blank" />
      <div className="half">
        <label htmlFor="vendor-email">Email</label>
        <input
          id="vendor-email"
          className="field"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="half">
        <label htmlFor="vendor-code">Access code</label>
        <input
          id="vendor-code"
          className="field"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="0000-0000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div className="half">
        <span />
        <span>
          <button type="submit" className="u" disabled={busy}>
            <RollingText text={status} stagger={8} />
          </button>
        </span>
      </div>
    </form>
  );
}
