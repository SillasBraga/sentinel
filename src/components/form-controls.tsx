"use client";

import { useFormStatus } from "react-dom";

export function SelectField({ label, name, children, required = true }: { label: string; name: string; children: React.ReactNode; required?: boolean }) { return <label className="grid gap-2 text-sm font-bold">{label}<select required={required} name={name} className="min-h-13 rounded-2xl border border-[var(--line)] bg-white px-4 font-normal">{children}</select></label>; }
export function TextAreaField({ label, name, placeholder, required = false, defaultValue }: { label: string; name: string; placeholder?: string; required?: boolean; defaultValue?: string }) { return <label className="grid gap-2 text-sm font-bold">{label}<textarea required={required} name={name} rows={4} placeholder={placeholder} defaultValue={defaultValue} className="resize-none rounded-2xl border border-[var(--line)] bg-white p-4 font-normal leading-7" /></label>; }
export function SubmitButton({ children }: { children: React.ReactNode }) { const { pending } = useFormStatus(); return <button disabled={pending} aria-disabled={pending} className="primary-action min-h-13 rounded-full px-6 font-bold">{pending ? "Salvando…" : children}</button>; }
