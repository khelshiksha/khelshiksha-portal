"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/ui/mascot";
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

  /* THE ONE MOMENT ON THIS SITE WORTH DECORATING.

     Someone has just handed over their name, phone number, school and
     district, and until now the whole reward was a stock checkmark. Every
     conversion surface routes here - the contact page, the inline enquiry
     block, and each of the four audience hubs - so one placement warms the
     end of four funnels.

     It is also the one placement that cannot cost a submission, because it
     only ever renders AFTER the lead is captured. That is the entire argument
     for putting a cartoon here and not on the pages where someone is still
     deciding whether we look like a real company.

     The bust crop, not the standing figure: at this size the full body would
     put the die head below the ~96px at which it stops reading as a die. */
  if (state?.ok) {
    return (
      <div
        role="status"
        className="bg-tint-mint flex flex-col items-start gap-3 overflow-hidden rounded-[var(--radius-xl)] border border-transparent p-8 sm:flex-row sm:items-end sm:gap-6 sm:pb-0"
      >
        <div className="flex flex-col items-start gap-3 sm:pb-8">
          <CheckCircle2
            size={26}
            aria-hidden="true"
            className="text-pillar-mint"
          />
          <h3 className="text-h3 text-ink font-bold">{t.form.successTitle}</h3>
          <p className="text-body text-ink-muted">{state.message}</p>
        </div>

        {/* Sat on the bottom edge of the panel rather than floating inside it.
            The artwork has no contact shadow - the alpha beneath it is 0, see
            ui/mascot.tsx - so a cut-out with clear space under it reads as a
            sticker pasted on. Cropping it against the panel edge instead makes
            it look like it is leaning in over the message. That is what
            sm:pb-0 on the parent and -mb-px here are for; the overflow-hidden
            lets the rounded corner do the clipping. */}
        <Mascot
          crop="bust"
          size="md"
          className="-mb-px hidden shrink-0 self-end sm:block"
        />
      </div>
    );
  }

  const err = (field: string) =>
    state?.ok === false && state.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="type" value={type} />
      {productId ? (
        <input type="hidden" name="productId" value={productId} />
      ) : null}
      {sourcePath ? (
        <input type="hidden" name="sourcePath" value={sourcePath} />
      ) : null}

      {/* Honeypot - visually hidden, off the tab order, and told not to
          autofill so a password manager never populates it for a real user. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
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
          className="bg-tint-blush text-body-sm text-ink flex items-start gap-2 rounded-[var(--radius-md)] p-4"
        >
          <AlertCircle
            size={18}
            aria-hidden="true"
            className="text-magenta mt-0.5 shrink-0"
          />
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
              className="text-ink text-[0.8125rem] font-bold"
            >
              {t.form.preferredTime}{" "}
              <span className="text-ink-subtle font-medium">
                ({t.form.optional})
              </span>
            </label>
            <select
              id={`${uid}-slot`}
              name="preferredSlot"
              defaultValue="either"
              className="border-rule-strong bg-surface text-body text-ink h-12 rounded-[var(--radius-md)] border px-3"
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
            className="text-ink text-[0.8125rem] font-bold"
          >
            {t.form.message}{" "}
            <span className="text-ink-subtle font-medium">
              ({t.form.optional})
            </span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            className="border-rule-strong bg-surface text-body text-ink rounded-[var(--radius-md)] border p-3"
          />
        </div>
      ) : null}

      <label className="text-body-sm text-ink-muted flex items-start gap-3">
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
      <label htmlFor={id} className="text-ink text-[0.8125rem] font-bold">
        {label}{" "}
        {!required ? (
          <span className="text-ink-subtle font-medium">
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
        className="border-rule-strong bg-surface text-body text-ink aria-invalid:border-magenta h-12 rounded-[var(--radius-md)] border px-3"
        {...rest}
      />
      {/* Errors are tied by aria-describedby and say HOW to fix it. */}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-magenta text-[0.8125rem] font-medium"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
