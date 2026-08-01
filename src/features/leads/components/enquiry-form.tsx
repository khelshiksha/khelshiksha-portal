"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/locale-context";
import { submitLead } from "../actions";
import type { ActionResult, LeadType } from "../schema";

/**
 * Forms are audience-scaled: parent 3 fields, teacher 1, school 5,
 * government 8+. Asking a parent for their annual budget is how you lose a
 * parent.
 *
 * Progressive enhancement: this is a real <form action={…}>, so it submits
 * and works with JavaScript disabled. The client hook only adds inline
 * feedback on top.
 */
export function EnquiryForm({
  type,
  productId,
  sourcePath,
  showOrganisation = true,
  showDistrict = true,
  showSlot = false,
  showMessage = true,
  submitLabel,
}: {
  type: LeadType;
  productId?: string;
  sourcePath?: string;
  showOrganisation?: boolean;
  showDistrict?: boolean;
  showSlot?: boolean;
  showMessage?: boolean;
  submitLabel?: string;
}) {
  const t = useDictionary();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    submitLead,
    null,
  );
  const uid = useId();

  if (state?.ok) {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-[var(--radius-xl)] border border-transparent bg-tint-mint p-8"
      >
        <CheckCircle2 size={26} aria-hidden="true" className="text-pillar-mint" />
        <h3 className="text-h3 font-bold text-ink">{t.form.successTitle}</h3>
        <p className="text-body text-ink-muted">{state.message}</p>
      </div>
    );
  }

  const err = (field: string) => state?.ok === false && state.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="type" value={type} />
      {productId ? (
        <input type="hidden" name="productId" value={productId} />
      ) : null}
      {sourcePath ? (
        <input type="hidden" name="sourcePath" value={sourcePath} />
      ) : null}

      {/* Honeypot — visually hidden, off the tab order, and told not to
          autofill so a password manager never populates it for a real user. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-cw`}>Company website</label>
        <input
          id={`${uid}-cw`}
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state?.ok === false && !state.fieldErrors ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[var(--radius-md)] bg-tint-blush p-4 text-body-sm text-ink"
        >
          <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-magenta" />
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${uid}-name`}
          name="name"
          label={t.form.name}
          autoComplete="name"
          required
          error={err("name")}
        />
        <Field
          id={`${uid}-phone`}
          name="phone"
          label={t.form.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={err("phone")}
        />

        {showOrganisation ? (
          <Field
            id={`${uid}-org`}
            name="organisation"
            label={type === "school-demo" ? t.form.school : t.form.organisation}
            autoComplete="organization"
            required={type === "school-demo"}
            error={err("organisation")}
          />
        ) : null}

        {showDistrict ? (
          <Field
            id={`${uid}-district`}
            name="district"
            label={t.form.district}
            autoComplete="address-level2"
            error={err("district")}
          />
        ) : null}

        <Field
          id={`${uid}-email`}
          name="email"
          label={t.form.email}
          type="email"
          inputMode="email"
          autoComplete="email"
          error={err("email")}
          className={showSlot ? undefined : "sm:col-span-2"}
        />

        {showSlot ? (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${uid}-slot`}
              className="text-[0.8125rem] font-bold text-ink"
            >
              {t.form.preferredTime}{" "}
              <span className="font-medium text-ink-subtle">
                ({t.form.optional})
              </span>
            </label>
            <select
              id={`${uid}-slot`}
              name="preferredSlot"
              defaultValue="either"
              className="h-12 rounded-[var(--radius-md)] border border-rule-strong bg-surface px-3 text-body text-ink"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="either">Either</option>
            </select>
          </div>
        ) : null}
      </div>

      {showMessage ? (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${uid}-message`}
            className="text-[0.8125rem] font-bold text-ink"
          >
            {t.form.message}{" "}
            <span className="font-medium text-ink-subtle">
              ({t.form.optional})
            </span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            className="rounded-[var(--radius-md)] border border-rule-strong bg-surface p-3 text-body text-ink"
          />
        </div>
      ) : null}

      <label className="flex items-start gap-3 text-body-sm text-ink-muted">
        {/* Never pre-checked. */}
        <input
          type="checkbox"
          name="consentMarketing"
          value="true"
          className="mt-1 size-4 accent-[var(--brand)]"
        />
        {t.form.consent}
      </label>

      <SubmitButton label={submitLabel ?? t.form.submit} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const t = useDictionary();
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
      {pending ? t.form.submitting : label}
    </Button>
  );
}

function Field({
  id,
  name,
  label,
  error,
  required = false,
  className,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  error?: string | false;
  required?: boolean;
  className?: string;
} & React.ComponentPropsWithoutRef<"input">) {
  const t = useDictionary();

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className="text-[0.8125rem] font-bold text-ink">
        {label}{" "}
        {!required ? (
          <span className="font-medium text-ink-subtle">
            ({t.form.optional})
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-12 rounded-[var(--radius-md)] border border-rule-strong bg-surface px-3 text-body text-ink aria-invalid:border-magenta"
        {...rest}
      />
      {/* Errors are tied by aria-describedby and say HOW to fix it. */}
      {error ? (
        <p id={`${id}-error`} className="text-[0.8125rem] font-medium text-magenta">
          {error}
        </p>
      ) : null}
    </div>
  );
}
