"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/** A password field with a show/hide button. */
export function PasswordInput({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { className: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={shown ? "text" : "password"} className={`${className} pr-12`} />
      <button
        type="button"
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        onClick={() => setShown(!shown)}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-ink/50 hover:text-ink"
      >
        <Icon name={shown ? "eyeOff" : "eye"} />
      </button>
    </div>
  );
}
