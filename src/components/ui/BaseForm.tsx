"use client"

import { useId, useState, type ReactNode } from "react"
import { useForm, ValidationError } from "@formspree/react"
import { useTranslations } from "next-intl"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Callout } from "@/components/ui/Callout"
import { Select } from "@/components/ui/Select"

type ContactFormFields = {
  firstName: string
  lastName: string
  email: string
  phone: string
  inquiryType: string
  message: string
}

const INQUIRY_TYPE_OPTIONS = [
  "1-2M",
  "2-5M",
  "5-10M",
  "10-20M",
  "over20M",
] as const

type InquiryTypeOption = (typeof INQUIRY_TYPE_OPTIONS)[number]

const FORM_FIELD_CLASSNAME = cn(
  "w-full rounded-[4px] border border-dark-gray bg-transparent px-4 py-3",
  "type-body-2 text-white placeholder:text-gray",
  "transition-colors duration-200",
  "focus:border-white focus:outline-none",
)

type FormFieldProps = {
  id: string
  label: string
  children: ReactNode
}

function FormField({ id, label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
    </div>
  )
}

function requiredPlaceholder(value: string) {
  return `${value} *`
}

export function BaseForm() {
  const t = useTranslations("contactForm")
  const formInstanceId = useId()

  const [state, handleSubmit] = useForm<ContactFormFields>("mqejwayl")
  const [inquiryType, setInquiryType] = useState("")

  const firstNameErrorId = `${formInstanceId}-firstName-error`
  const lastNameErrorId = `${formInstanceId}-lastName-error`
  const emailErrorId = `${formInstanceId}-email-error`
  const phoneErrorId = `${formInstanceId}-phone-error`
  const inquiryTypeErrorId = `${formInstanceId}-inquiryType-error`
  const messageErrorId = `${formInstanceId}-message-error`

  const hasFirstNameError = Boolean(
    state.errors?.getFieldErrors("firstName")?.length,
  )
  const hasLastNameError = Boolean(
    state.errors?.getFieldErrors("lastName")?.length,
  )
  const hasEmailError = Boolean(state.errors?.getFieldErrors("email")?.length)
  const hasPhoneError = Boolean(state.errors?.getFieldErrors("phone")?.length)
  const hasInquiryTypeError = Boolean(
    state.errors?.getFieldErrors("inquiryType")?.length,
  )
  const hasMessageError = Boolean(
    state.errors?.getFieldErrors("message")?.length,
  )

  const hasFormError = Boolean(state.errors?.getFormErrors().length)

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-5"
      aria-label={t("formAriaLabel")}
    >
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
        <FormField
          id={`${formInstanceId}-firstName`}
          label={t("firstNameLabel")}
        >
          <input
            id={`${formInstanceId}-firstName`}
            type="text"
            name="firstName"
            autoComplete="given-name"
            required
            aria-required="true"
            aria-invalid={hasFirstNameError}
            aria-describedby={hasFirstNameError ? firstNameErrorId : undefined}
            placeholder={requiredPlaceholder(t("firstNamePlaceholder"))}
            className={FORM_FIELD_CLASSNAME}
          />
          <ValidationError
            id={firstNameErrorId}
            prefix={t("firstNameLabel")}
            field="firstName"
            errors={state.errors}
            className="type-body-3 text-gray"
          />
        </FormField>

        <FormField id={`${formInstanceId}-lastName`} label={t("lastNameLabel")}>
          <input
            id={`${formInstanceId}-lastName`}
            type="text"
            name="lastName"
            autoComplete="family-name"
            required
            aria-required="true"
            aria-invalid={hasLastNameError}
            aria-describedby={hasLastNameError ? lastNameErrorId : undefined}
            placeholder={requiredPlaceholder(t("lastNamePlaceholder"))}
            className={FORM_FIELD_CLASSNAME}
          />
          <ValidationError
            id={lastNameErrorId}
            prefix={t("lastNameLabel")}
            field="lastName"
            errors={state.errors}
            className="type-body-3 text-gray"
          />
        </FormField>

        <FormField id={`${formInstanceId}-email`} label={t("emailLabel")}>
          <input
            id={`${formInstanceId}-email`}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            aria-required="true"
            aria-invalid={hasEmailError}
            aria-describedby={hasEmailError ? emailErrorId : undefined}
            placeholder={requiredPlaceholder(t("emailPlaceholder"))}
            className={FORM_FIELD_CLASSNAME}
          />
          <ValidationError
            id={emailErrorId}
            prefix={t("emailLabel")}
            field="email"
            errors={state.errors}
            className="type-body-3 text-gray"
          />
        </FormField>

        <FormField id={`${formInstanceId}-phone`} label={t("phoneLabel")}>
          <input
            id={`${formInstanceId}-phone`}
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            required
            aria-required="true"
            aria-invalid={hasPhoneError}
            aria-describedby={hasPhoneError ? phoneErrorId : undefined}
            placeholder={requiredPlaceholder(t("phonePlaceholder"))}
            className={FORM_FIELD_CLASSNAME}
          />
          <ValidationError
            id={phoneErrorId}
            prefix={t("phoneLabel")}
            field="phone"
            errors={state.errors}
            className="type-body-3 text-gray"
          />
        </FormField>
      </div>

      <FormField
        id={`${formInstanceId}-inquiryType`}
        label={t("inquiryTypeLabel")}
      >
        <Select
          id={`${formInstanceId}-inquiryType`}
          name="inquiryType"
          required
          value={inquiryType}
          onChange={setInquiryType}
          placeholder={requiredPlaceholder(t("inquiryTypePlaceholder"))}
          aria-invalid={hasInquiryTypeError}
          aria-describedby={
            hasInquiryTypeError ? inquiryTypeErrorId : undefined
          }
          options={INQUIRY_TYPE_OPTIONS.map((option) => ({
            value: option,
            label: t(`inquiryTypeOptions.${option as InquiryTypeOption}`),
          }))}
        />
        <ValidationError
          id={inquiryTypeErrorId}
          prefix={t("inquiryTypeLabel")}
          field="inquiryType"
          errors={state.errors}
          className="type-body-3 text-gray"
        />
      </FormField>

      <FormField id={`${formInstanceId}-message`} label={t("messageLabel")}>
        <textarea
          id={`${formInstanceId}-message`}
          name="message"
          rows={6}
          required
          aria-required="true"
          aria-invalid={hasMessageError}
          aria-describedby={hasMessageError ? messageErrorId : undefined}
          placeholder={t("messagePlaceholder")}
          className={cn(FORM_FIELD_CLASSNAME, "min-h-[160px] resize-y")}
        />
        <ValidationError
          id={messageErrorId}
          prefix={t("messageLabel")}
          field="message"
          errors={state.errors}
          className="type-body-3 text-gray"
        />
      </FormField>

      <div>
        <Button
          type="submit"
          disabled={state.submitting || state.succeeded}
          aria-busy={state.submitting}
        >
          {state.submitting ? t("submittingLabel") : t("buttonLabel")}
        </Button>
      </div>

      {state.succeeded ? (
        <Callout variant="success" message={t("successMessage")} />
      ) : hasFormError ? (
        <Callout variant="error" message={t("errorMessage")} />
      ) : null}
    </form>
  )
}
