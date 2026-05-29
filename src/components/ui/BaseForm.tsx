"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useForm, ValidationError } from "@formspree/react"
import { useTranslations } from "next-intl"

import { cn } from "@/utils/classNames"

import { Button } from "@/components/ui/Button"
import { Callout } from "@/components/ui/Callout"
import { Modal } from "@/components/ui/Modal"
import { Select } from "@/components/ui/Select"

const SUCCESS_MODAL_DELAY_MS = 800

type ContactFormFields = {
  firstName: string
  lastName: string
  email: string
  phone: string
  budget: string
  message: string
}

const BUDGET_OPTIONS = ["1-2M", "2-5M", "5-10M", "10-20M", "over20M"] as const

type BudgetOption = (typeof BUDGET_OPTIONS)[number]

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "budget",
] as const

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
  const [budget, setBudget] = useState("")
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [emptyFields, setEmptyFields] = useState<Set<string>>(new Set())

  const formRef = useRef<HTMLFormElement | null>(null)

  /* CLEAR THE "EMPTY" FLAG */
  const clearEmptyFlag = useCallback((field: string) => {
    setEmptyFields((prev) => {
      if (!prev.has(field)) return prev
      const next = new Set(prev)
      next.delete(field)
      return next
    })
  }, [])

  /* WHEN USER TYPES IN ANY FIELD, RE-EVALUATE WHICH ONES ARE STILL EMPTY */
  const handleFormChange = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      if (!target?.name) return
      if (typeof target.value === "string" && target.value.trim() !== "") {
        clearEmptyFlag(target.name)
      }
    },
    [clearEmptyFlag],
  )

  /* BUDGET IS A HIDDEN INPUT UPDATED PROGRAMMATICALLY  */
  useEffect(() => {
    if (budget.trim() !== "") clearEmptyFlag("budget")
  }, [budget, clearEmptyFlag])

  /* GATE SUBMIT: ON EMPTY REQUIRED FIELDS, BLOCK + FLAG */
  const handleGuardedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    const formData = new FormData(form)
    const missing = REQUIRED_FIELDS.filter((field) => {
      const value = formData.get(field)
      return typeof value !== "string" || value.trim() === ""
    })

    if (missing.length > 0) {
      event.preventDefault()
      setEmptyFields(new Set(missing))
      return
    }

    setEmptyFields(new Set())
    handleSubmit(event)
  }

  /* OPEN MODAL */
  useEffect(() => {
    if (!state.succeeded) return
    const timer = setTimeout(
      () => setSuccessModalOpen(true),
      SUCCESS_MODAL_DELAY_MS,
    )
    return () => clearTimeout(timer)
  }, [state.succeeded])

  const firstNameErrorId = `${formInstanceId}-firstName-error`
  const lastNameErrorId = `${formInstanceId}-lastName-error`
  const emailErrorId = `${formInstanceId}-email-error`
  const phoneErrorId = `${formInstanceId}-phone-error`
  const budgetErrorId = `${formInstanceId}-budget-error`
  const messageErrorId = `${formInstanceId}-message-error`

  const hasFirstNameError = Boolean(
    state.errors?.getFieldErrors("firstName")?.length,
  )
  const hasLastNameError = Boolean(
    state.errors?.getFieldErrors("lastName")?.length,
  )
  const hasEmailError = Boolean(state.errors?.getFieldErrors("email")?.length)
  const hasPhoneError = Boolean(state.errors?.getFieldErrors("phone")?.length)
  const hasBudgetError = Boolean(state.errors?.getFieldErrors("budget")?.length)
  const hasMessageError = Boolean(
    state.errors?.getFieldErrors("message")?.length,
  )

  const hasFormError = Boolean(state.errors?.getFormErrors().length)

  return (
    <form
      ref={formRef}
      onSubmit={handleGuardedSubmit}
      onChange={handleFormChange}
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
            aria-invalid={hasFirstNameError || emptyFields.has("firstName")}
            aria-describedby={hasFirstNameError ? firstNameErrorId : undefined}
            placeholder={requiredPlaceholder(t("firstNamePlaceholder"))}
            className={cn(
              FORM_FIELD_CLASSNAME,
              emptyFields.has("firstName") && "border-red-500",
            )}
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
            aria-invalid={hasLastNameError || emptyFields.has("lastName")}
            aria-describedby={hasLastNameError ? lastNameErrorId : undefined}
            placeholder={requiredPlaceholder(t("lastNamePlaceholder"))}
            className={cn(
              FORM_FIELD_CLASSNAME,
              emptyFields.has("lastName") && "border-red-500",
            )}
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
            aria-invalid={hasEmailError || emptyFields.has("email")}
            aria-describedby={hasEmailError ? emailErrorId : undefined}
            placeholder={requiredPlaceholder(t("emailPlaceholder"))}
            className={cn(
              FORM_FIELD_CLASSNAME,
              emptyFields.has("email") && "border-red-500",
            )}
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
            aria-invalid={hasPhoneError || emptyFields.has("phone")}
            aria-describedby={hasPhoneError ? phoneErrorId : undefined}
            placeholder={requiredPlaceholder(t("phonePlaceholder"))}
            className={cn(
              FORM_FIELD_CLASSNAME,
              emptyFields.has("phone") && "border-red-500",
            )}
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

      <FormField id={`${formInstanceId}-budget`} label={t("budgetLabel")}>
        <Select
          id={`${formInstanceId}-budget`}
          name="budget"
          required
          value={budget}
          onChange={setBudget}
          placeholder={requiredPlaceholder(t("budgetPlaceholder"))}
          invalid={emptyFields.has("budget")}
          aria-invalid={hasBudgetError || emptyFields.has("budget")}
          aria-describedby={hasBudgetError ? budgetErrorId : undefined}
          options={BUDGET_OPTIONS.map((option) => ({
            value: option,
            label: t(`budgetOptions.${option as BudgetOption}`),
          }))}
        />
        <ValidationError
          id={budgetErrorId}
          prefix={t("budgetLabel")}
          field="budget"
          errors={state.errors}
          className="type-body-3 text-gray"
        />
      </FormField>

      <FormField id={`${formInstanceId}-message`} label={t("messageLabel")}>
        <textarea
          id={`${formInstanceId}-message`}
          name="message"
          rows={6}
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
          variant="primary"
          highlight
          disabled={state.submitting || state.succeeded}
          aria-busy={state.submitting}
        >
          {state.submitting ? t("submittingLabel") : t("buttonLabel")}
        </Button>
      </div>

      {state.succeeded && !successModalOpen ? (
        <Callout variant="success" message={t("successMessage")} />
      ) : hasFormError ? (
        <Callout variant="error" message={t("errorMessage")} />
      ) : null}

      <Modal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title={t("successModalTitle")}
      >
        <p className="type-body-2 text-white text-center">
          {t("successModalText")}
        </p>
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="primary" onClick={() => setSuccessModalOpen(false)}>
            {t("successModalCloseButton")}
          </Button>
        </div>
      </Modal>
    </form>
  )
}
