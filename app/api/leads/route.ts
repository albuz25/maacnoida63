import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type LeadPayload = {
  name?: unknown;
  mobile?: unknown;
  course?: unknown;
};

const validCourses = new Set([
  "3D Animation",
  "VFX & ADVFX",
  "UI UX",
  "Gaming",
  "Interior",
  "Creator X",
  "Career X",
  "B.Voc in Animation & VFX",
]);

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const mobile = typeof payload.mobile === "string" ? payload.mobile.trim() : "";
  const course = typeof payload.course === "string" ? payload.course.trim() : "";

  if (name.length < 2) {
    return NextResponse.json({ message: "Please enter a valid name." }, { status: 400 });
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json({ message: "Please enter a valid 10-digit mobile number." }, { status: 400 });
  }

  if (!validCourses.has(course)) {
    return NextResponse.json({ message: "Please select a valid course." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ message: "Lead capture is not configured yet." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase.from("leads").insert({
    name,
    mobile,
    course_interest: course,
    source: "maac-sector-63-landing",
    status: "new",
    notes: null,
  });

  if (error) {
    console.error("Supabase lead insert failed:", error.message);
    return NextResponse.json({ message: "Could not save your request. Please call us directly." }, { status: 500 });
  }

  return NextResponse.json({ message: "Thanks. Our admissions team will call you shortly." });
}
