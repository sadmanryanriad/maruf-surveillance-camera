"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import countries, { Country } from "@/lib/countries";
import { Button } from "./ui/button";

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [message, setMessage] = useState("");
  const [companyUrl, setCompanyUrl] = useState(""); // Honeypot field for spam prevention

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPhoneDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry: Country =
    countries.find((c) => c.dial === countryCode) || countries[0];

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dial.includes(countrySearch)
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot check: If honeypot field is filled by bot, silently discard
    if (companyUrl.trim()) {
      setSent(true);
      return;
    }

    setSending(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim() || "Visitor";
      const fullPhone = `${countryCode} ${phone}`.trim();

      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: fullName,
          email,
          phone: fullPhone,
          notes: message,
        }),
      });
    } catch (err) {
      console.error("Failed to submit contact inquiry:", err);
    } finally {
      setSending(false);
      setSent(true);
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-4 rounded-2xl border border-primary/40 bg-surface p-8 shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
              ✓
            </span>
            <h3 className="font-display text-xl font-bold text-foreground">Message received.</h3>
            <p className="text-sm text-muted">
              Thanks for reaching out — our surveillance engineering team will get back to you within 24 hours.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Quick Contact & Copy Bar */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/80 p-4 shadow-sm">
                <a href="mailto:info@marufsecurity.com" className="flex items-center gap-3 overflow-hidden">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                    ✉
                  </span>
                  <div className="truncate">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Direct Email</p>
                    <p className="text-xs font-semibold text-foreground truncate">info@marufsecurity.com</p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy("info@marufsecurity.com", "email")}
                  className="rounded-lg border border-line px-2 py-1 text-[11px] font-bold text-muted hover:text-foreground"
                  title="Copy Email"
                >
                  {copiedId === "email" ? "✓ Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/80 p-4 shadow-sm">
                <a href="https://wa.me/8801760345435" target="_blank" rel="noreferrer" className="flex items-center gap-3 overflow-hidden">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    💬
                  </span>
                  <div className="truncate">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">WhatsApp / Phone</p>
                    <p className="text-xs font-semibold text-foreground truncate">+880 1760-345435</p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy("+8801760345435", "whatsapp")}
                  className="rounded-lg border border-line px-2 py-1 text-[11px] font-bold text-muted hover:text-foreground"
                  title="Copy WhatsApp"
                >
                  {copiedId === "whatsapp" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Main Form */}
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="grid gap-5 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xl"
            >
              {/* Honeypot Spam Filter Field */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  height: 0,
                  overflow: "hidden",
                }}
              >
                <label htmlFor="company_url">Company URL</label>
                <input
                  type="text"
                  id="company_url"
                  name="company_url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jordan"
                    required
                    className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Rivera"
                    required
                    className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Email Address <span className="text-[#c8102e]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Phone with Flag Dropdown Selector */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  Phone / WhatsApp Number <span className="text-[#c8102e]">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      aria-label="Select country code"
                      onClick={() => {
                        setPhoneDropdownOpen(!phoneDropdownOpen);
                        setCountrySearch("");
                      }}
                      className="flex h-full items-center gap-2 rounded-xl border border-line bg-background px-3.5 py-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    >
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span>{selectedCountry.dial}</span>
                      <span className="text-muted text-[10px]">▼</span>
                    </button>

                    {phoneDropdownOpen && (
                      <div className="absolute top-full left-0 z-50 mt-2 w-64 max-h-60 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl flex flex-col">
                        <div className="p-2 border-b border-line">
                          <input
                            type="text"
                            autoFocus
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country…"
                            className="w-full rounded-lg border border-line bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 p-1">
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(c.dial);
                                setPhoneDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-surface-2 ${
                                c.dial === countryCode ? "bg-primary/10 text-primary font-bold" : "text-foreground"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-base">{c.flag}</span>
                                <span className="truncate max-w-[110px]">{c.name}</span>
                              </span>
                              <span className="font-mono text-muted">{c.dial}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01760-345435"
                    required
                    className="flex-1 rounded-xl border border-line bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your property, camera requirements, or timeline…"
                  required
                  className="w-full rounded-xl border border-line bg-background p-4 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <Button type="submit" size="lg" disabled={sending} className="justify-self-start font-bold">
                {sending ? "Sending Message…" : "Send Message →"}
              </Button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
