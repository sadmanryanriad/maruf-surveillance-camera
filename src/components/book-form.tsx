import { FormShell } from "./form-shell";
import { Field, SelectField, TextArea } from "./ui/field";

export function BookForm() {
  return (
    <FormShell
      submitLabel="Confirm booking"
      successTitle="Booking requested."
      successBody="Your slot is pencilled in. We'll confirm the exact time by phone or email shortly."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="b-name" name="name" label="Full name" placeholder="Jordan Rivera" required />
        <Field id="b-email" name="email" type="email" label="Email" placeholder="you@email.com" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="b-phone" name="phone" label="Phone" placeholder="+1 (555) 000-0000" required />
        <SelectField id="b-service" name="service" label="Appointment type" defaultValue="" required>
          <option value="" disabled>Select…</option>
          <option>Free site survey</option>
          <option>New installation</option>
          <option>System upgrade</option>
          <option>Maintenance visit</option>
        </SelectField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="b-date" name="date" type="date" label="Preferred date" required />
        <SelectField id="b-time" name="time" label="Preferred time" defaultValue="" required>
          <option value="" disabled>Select…</option>
          <option>Morning (8am–12pm)</option>
          <option>Afternoon (12pm–5pm)</option>
          <option>Evening (5pm–8pm)</option>
        </SelectField>
      </div>
      <Field id="b-address" name="address" label="Property address" placeholder="Street, city" required />
      <TextArea id="b-notes" name="notes" label="Notes (optional)" rows={3} placeholder="Access details, parking, what you'd like to cover…" />
    </FormShell>
  );
}
