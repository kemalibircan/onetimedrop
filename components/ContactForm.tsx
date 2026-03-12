"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface ContactFormProps {
  lang: string;
  dict: any;
}

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
  website: string;
}

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  message: "",
  website: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapErrorCodeToMessage(code: string, dict: any): string {
  switch (code) {
    case "NAME_REQUIRED":
      return dict.errors.name_required;
    case "NAME_LENGTH":
      return dict.errors.name_length;
    case "EMAIL_REQUIRED":
      return dict.errors.email_required;
    case "EMAIL_INVALID":
      return dict.errors.email_invalid;
    case "MESSAGE_REQUIRED":
      return dict.errors.message_required;
    case "MESSAGE_LENGTH":
      return dict.errors.message_length;
    case "RATE_LIMITED":
      return dict.errors.rate_limited;
    case "UNAVAILABLE":
      return dict.errors.unavailable;
    default:
      return dict.errors.generic;
  }
}

function validateForm(values: ContactFormValues, dict: any): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (!trimmedName) {
    errors.name = dict.errors.name_required;
  } else if (trimmedName.length < 2 || trimmedName.length > 80) {
    errors.name = dict.errors.name_length;
  }

  if (!trimmedEmail) {
    errors.email = dict.errors.email_required;
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = dict.errors.email_invalid;
  }

  if (!trimmedMessage) {
    errors.message = dict.errors.message_required;
  } else if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
    errors.message = dict.errors.message_length;
  }

  return errors;
}

export default function ContactForm({ lang, dict }: ContactFormProps) {
  const { addToast } = useToast();
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field: keyof ContactFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field === "name" || field === "email" || field === "message") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(values, dict);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast(Object.values(nextErrors)[0] || dict.errors.generic, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": lang,
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          website: values.website,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 400 && payload?.error === "VALIDATION" && payload.fieldErrors) {
          const serverErrors = Object.fromEntries(
            Object.entries(payload.fieldErrors).map(([field, code]) => [
              field,
              mapErrorCodeToMessage(String(code), dict),
            ])
          ) as FieldErrors;
          setErrors(serverErrors);
          addToast(Object.values(serverErrors)[0] || dict.errors.generic, "error");
          return;
        }

        addToast(mapErrorCodeToMessage(String(payload?.error || ""), dict), "error");
        return;
      }

      setValues(INITIAL_VALUES);
      setErrors({});
      addToast(dict.success_toast, "success");
    } catch (error) {
      console.error("[contact-form]", error);
      addToast(dict.errors.generic, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="card space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
          {dict.name_label}
        </label>
        <input
          id="contact-name"
          type="text"
          value={values.name}
          onChange={(event) => handleFieldChange("name", event.target.value)}
          placeholder={dict.name_placeholder}
          className="input-field"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.name ? (
          <p id="contact-name-error" className="mt-1.5 text-sm text-red-600 dark:text-red-300">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
          {dict.email_label}
        </label>
        <input
          id="contact-email"
          type="email"
          value={values.email}
          onChange={(event) => handleFieldChange("email", event.target.value)}
          placeholder={dict.email_placeholder}
          className="input-field"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.email ? (
          <p id="contact-email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-300">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-msg" className="block text-sm font-medium mb-1.5">
          {dict.message_label}
        </label>
        <textarea
          id="contact-msg"
          rows={5}
          value={values.message}
          onChange={(event) => handleFieldChange("message", event.target.value)}
          placeholder={dict.message_placeholder}
          className="input-field resize-none"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.message ? (
          <p
            id="contact-message-error"
            className="mt-1.5 text-sm text-red-600 dark:text-red-300"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">{dict.hidden_website_label}</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => handleFieldChange("website", event.target.value)}
        />
      </div>

      <button className="btn-primary w-full disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSubmitting ? dict.submitting : dict.submit}
      </button>

      <p className="text-xs text-center text-[var(--color-muted)]">{dict.response_time}</p>
    </form>
  );
}
