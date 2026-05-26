import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  mobile?: unknown;
  course?: unknown;
  pageUrl?: unknown;
};

type CentreDetails = {
  centre_id?: number;
  state_id?: number;
  city_id?: number;
  courses?: Array<{
    course_id?: number;
    course_name?: string;
  }>;
};

type CourseListResponse = {
  all_courses?: Array<{
    course_id?: number;
    course_name?: string;
  }>;
};

type CentreDetailsResponse = {
  centre_details?: CentreDetails;
};

type AptrackSaveResponse = {
  IsSuccess?: boolean;
  Message?: string;
  EnqNo?: string;
};

const validCourses = new Set([
  "3D Animation",
  "VFX & ADVFX",
  "UI UX",
  "Gaming",
  "B.Voc in Animation & VFX",
  "Other Short Term Courses",
]);

const courseAliases: Record<string, string[]> = {
  "VFX & ADVFX": ["vfx", "advfx", "advanced visual effects"],
  "UI UX": ["ui ux", "ui/ux", "user interface", "user experience"],
  Gaming: ["gaming", "game design", "gaming and id"],
  "B.Voc in Animation & VFX": ["b voc", "bvoc", "animation vfx"],
  "Other Short Term Courses": ["short term", "short-term", "other"],
};

function getAptrackUrls() {
  const environment = process.env.APTRACK_ENV || "uat";

  if (environment === "production") {
    return {
      save: process.env.APTRACK_SAVE_URL || "https://aptrack.online/aptrack-api-prod/api/crm/save-student-enquiry-rootle",
      courseList: process.env.APTRACK_COURSE_LIST_URL || "https://api.aptech-worldwide.com/v2/student-enquiry/course-list",
      centreDetails:
        process.env.APTRACK_CENTRE_DETAILS_URL || "https://api.aptech-worldwide.com/v2/student-enquiry/centre-details",
    };
  }

  return {
    save:
      process.env.APTRACK_SAVE_URL ||
      "https://nonprod-uat.aptrack.asia/aptrack-api-uat/api/crm/save-student-enquiry-rootle",
    courseList:
      process.env.APTRACK_COURSE_LIST_URL || "https://api.aptech-worldwide.com/uat/student-enquiry/course-list",
    centreDetails:
      process.env.APTRACK_CENTRE_DETAILS_URL || "https://api.aptech-worldwide.com/uat/student-enquiry/centre-details",
  };
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function splitName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || name,
    lastName: parts.slice(1).join(" "),
  };
}

function getCourseMap() {
  const rawMap = process.env.APTRACK_COURSE_MAP_JSON;

  if (!rawMap) {
    return {};
  }

  try {
    return JSON.parse(rawMap) as Record<string, number>;
  } catch {
    console.error("Invalid APTRACK_COURSE_MAP_JSON.");
    return {};
  }
}

function findCourseId(courseName: string, courses: NonNullable<CentreDetails["courses"]>) {
  const selected = normalize(courseName);
  const aliases = [selected, ...(courseAliases[courseName] || []).map(normalize)];

  const exactMatch = courses.find((course) => course.course_name && aliases.includes(normalize(course.course_name)));

  if (exactMatch?.course_id) {
    return exactMatch.course_id;
  }

  const fuzzyMatch = courses.find((course) => {
    if (!course.course_name) {
      return false;
    }

    const candidate = normalize(course.course_name);
    return aliases.some((alias) => candidate.includes(alias) || alias.includes(candidate));
  });

  return fuzzyMatch?.course_id;
}

async function postJson<T>(url: string, headers: HeadersInit, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as T | null;

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data &&
      "Message" in data &&
      typeof (data as { Message?: unknown }).Message === "string"
        ? (data as { Message: string }).Message
        : "Aptrack request failed.";

    throw new Error(message);
  }

  return data;
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const mobile = typeof payload.mobile === "string" ? payload.mobile.trim() : "";
  const course = typeof payload.course === "string" ? payload.course.trim() : "";
  const pageUrl = typeof payload.pageUrl === "string" ? payload.pageUrl.trim() : "";

  if (name.length < 2) {
    return NextResponse.json({ message: "Please enter a valid name." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json({ message: "Please enter a valid 10-digit mobile number." }, { status: 400 });
  }

  if (!validCourses.has(course)) {
    return NextResponse.json({ message: "Please select a valid course." }, { status: 400 });
  }

  const authKey = process.env.APTRACK_AUTH_KEY;
  const sapCode = process.env.APTRACK_CENTRE_SAP_CODE || process.env.ROOTLE_SAP_CODES?.split(",")[0]?.trim();
  const brandId = Number(process.env.APTRACK_BRAND_ID || 104);
  const countryId = Number(process.env.APTRACK_COUNTRY_ID || 1);

  if (!authKey || !sapCode) {
    return NextResponse.json({ message: "Aptrack lead capture is not configured yet." }, { status: 500 });
  }

  const urls = getAptrackUrls();
  const sharedHeaders = {
    "X-Auth-Key": authKey,
    "Content-Type": "application/json",
  };

  try {
    const centreData = await postJson<CentreDetailsResponse>(urls.centreDetails, sharedHeaders, {
      brand_id: brandId,
      country_id: countryId,
      sap_code: sapCode,
    });
    const centreDetails = centreData?.centre_details;

    if (!centreDetails?.centre_id || !centreDetails.state_id || !centreDetails.city_id) {
      throw new Error("Could not fetch valid centre details from Aptrack.");
    }

    const courseMap = getCourseMap();
    let courseId: number | undefined = courseMap[course];

    if (!courseId) {
      courseId = findCourseId(course, centreDetails.courses || []);
    }

    if (!courseId) {
      const courseData = await postJson<CourseListResponse>(urls.courseList, sharedHeaders, {
        brand_id: brandId,
        country_id: countryId,
      });
      courseId = findCourseId(course, courseData?.all_courses || []);
    }

    if (!courseId) {
      throw new Error("Could not map the selected course to an Aptrack course ID.");
    }

    const { firstName, lastName } = splitName(name);
    const saveResult = await postJson<AptrackSaveResponse>(
      urls.save,
      {
        ...sharedHeaders,
        "X-Username": process.env.APTRACK_USERNAME || "SUPER_LEAP",
      },
      {
        I_Brand_ID: brandId,
        S_First_Name: firstName,
        S_Last_Name: lastName,
        S_Email_ID: email,
        S_Mobile_No: mobile,
        S_Phone_No: "",
        I_CourseEnquiryMaster_ID: courseId,
        I_Pref_State_ID: centreDetails.state_id,
        I_City_ID: centreDetails.city_id,
        I_Pref_Center_ID: centreDetails.centre_id,
        S_P_Source: "Center",
        S_S_Source: `CL-${sapCode}`,
        S_Comments: `Course interest: ${course}`,
        S_CurrentlyDoing: "",
        S_Brand_Code: "MAAC",
        S_Ip_Address_Location: "",
        S_Form_Name: "MAAC Sector 63 Landing Page",
        S_Network: "",
        S_Creative: "",
        S_Keyword: "",
        S_Placement: "",
        S_Adposition: "",
        S_MatchType: "",
        S_accid: "",
        S_Page_URL: pageUrl,
        S_Pages_Visited: pageUrl,
        S_LeadProfile: "",
        S_LeadProfileAttributes: "",
        S_LeadScore: null,
        CRMEnquiryId: "",
        EnquiryCategoryId: 0,
        StatusId: 0,
        EnquiryStatusId: 0,
        EnquirySubStatusId: 0,
        S_Meeting_Comments: "",
        S_Meeting_ScheduleAt: null,
        S_Pushed_To_AptrackAt: null,
      }
    );

    if (!saveResult?.IsSuccess) {
      throw new Error(saveResult?.Message || "Aptrack could not save the enquiry.");
    }
  } catch (error) {
    console.error("Aptrack lead submission failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ message: "Could not save your request. Please call us directly." }, { status: 500 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json({ message: "Thanks. Our admissions team will call you shortly." });
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
  }

  return NextResponse.json({ message: "Thanks. Our admissions team will call you shortly." });
}
