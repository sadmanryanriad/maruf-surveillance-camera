import fs from "fs";
import path from "path";

export type LeadType = "quote" | "book" | "contact";
export type LeadStatus = "new" | "contacted" | "in_progress" | "completed";

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email?: string;
  phone: string;
  propertyType?: string;
  cameraCount?: string;
  preferredDate?: string;
  service?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

// Default initial leads for demonstration
const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-101",
    type: "quote",
    name: "Rahim Chowdhury",
    email: "rahim.c@example.com",
    phone: "+880 1712-345678",
    propertyType: "Commercial Warehouse",
    cameraCount: "8-16 Cameras",
    status: "new",
    notes: "Need complete CCTV surveillance setup for a 5,000 sq ft warehouse in Dhaka.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead-102",
    type: "book",
    name: "Tariq Hasan",
    email: "tariq.hasan@example.com",
    phone: "+880 1819-876543",
    preferredDate: "2026-07-30",
    service: "Residential CCTV Installation",
    status: "contacted",
    notes: "Wants a technician visit to survey 3-story duplex home.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "lead-103",
    type: "contact",
    name: "Sabrina Ahmed",
    email: "sabrina.a@example.com",
    phone: "+880 1911-223344",
    status: "completed",
    notes: "Inquired about Hikvision vs Dahua 4K IP cameras.",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function ensureFileExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(INITIAL_LEADS, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error creating leads store file:", err);
  }
}

export function getAllLeads(): Lead[] {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return INITIAL_LEADS;
  }
}

export function getLeadById(id: string): Lead | undefined {
  const leads = getAllLeads();
  return leads.find((l) => l.id === id);
}

export function createLead(data: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt">): Lead {
  const leads = getAllLeads();
  const newLead: Lead = {
    ...data,
    id: `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus): Lead | null {
  const leads = getAllLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  leads[index] = {
    ...leads[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  saveLeads(leads);
  return leads[index];
}

export function deleteLead(id: string): boolean {
  let leads = getAllLeads();
  const initialCount = leads.length;
  leads = leads.filter((l) => l.id !== id);
  if (leads.length === initialCount) return false;

  saveLeads(leads);
  return true;
}

function saveLeads(leads: Lead[]) {
  ensureFileExists();
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving leads store:", err);
  }
}
