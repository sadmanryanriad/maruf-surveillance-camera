import { services } from "@/lib/site";
import { FormShell } from "./form-shell";
import { Field, SelectField, TextArea } from "./ui/field";

export function QuoteForm() {
  return (
    <FormShell
      submitLabel="Request my quote"
      successTitle="Quote request received."
      successBody="We'll review your details and send a tailored, fixed-price quote within one business day."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="q-name" name="name" label="Full name" placeholder="Jordan Rivera" required />
        <Field id="q-email" name="email" type="email" label="Email" placeholder="you@email.com" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="q-phone" name="phone" label="Phone" placeholder="+1 (555) 000-0000" required />
        <SelectField id="q-type" name="propertyType" label="Property type" defaultValue="" required>
          <option value="" disabled>Select…</option>
          <option>Home / apartment</option>
          <option>Shop / retail</option>
          <option>Office</option>
          <option>Warehouse / site</option>
          <option>Other</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="q-cameras" name="cameras" label="Cameras needed" defaultValue="" required>
          <option value="" disabled>Select…</option>
          <option>1–2</option>
          <option>3–4</option>
          <option>5–8</option>
          <option>9–16</option>
          <option>Not sure yet</option>
        </SelectField>
        <SelectField id="q-service" name="service" label="Main interest" defaultValue="">
          <option value="" disabled>Select…</option>
          {services.map((s) => (
            <option key={s.id}>{s.title}</option>
          ))}
        </SelectField>
      </div>
      <Field id="q-address" name="address" label="Property address" placeholder="Street, city" />
      <TextArea id="q-notes" name="notes" label="Anything else we should know?" rows={3} placeholder="Blind spots, existing cameras, timeline…" />
    </FormShell>
  );
}
