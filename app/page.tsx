"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Layers3,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PenTool,
  Phone,
  Train,
  Zap,
} from "lucide-react";
import { FormEvent, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const courses = [
  {
    name: "Best 3D Animation Course in Noida",
    description: (
      <>
        Master the full pipeline from <strong>Maya</strong> to <strong>ZBrush</strong> with an{" "}
        <strong>Animation Degree</strong>-level learning path. Build character sculpting, rigging, and cinematic
        animation skills for studio careers in Noida and Ghaziabad.
      </>
    ),
    icon: Palette,
  },
  {
    name: "Advanced VFX Degree Programs in Delhi NCR",
    description: (
      <>
        Advanced compositing in <strong>Nuke</strong> and simulations in <strong>Houdini</strong>. Our{" "}
        <strong>VFX Degree Courses</strong> are designed for students seeking high-end careers in Film &amp; Media.
      </>
    ),
    icon: Layers3,
  },
  {
    name: "Best UI UX Course in Noida",
    description: (
      <>
        Logic meets design. Master <strong>Figma</strong>, user psychology, and product prototyping for Noida&apos;s
        tech-agency hub with professional certification and portfolio reviews.
      </>
    ),
    icon: MonitorSmartphone,
  },
  {
    name: "Best Game Design Course in Delhi NCR",
    description: (
      <>
        Build AAA-style titles with <strong>Unreal Engine 5</strong>. Covers game art, environment design, AR/VR, and
        career-ready production workflows for Delhi NCR studios.
      </>
    ),
    icon: Gamepad2,
  },
  {
    name: "Best Interior Visualization Course in Noida",
    description: (
      <>
        Photorealistic architectural visualization using <strong>3ds Max</strong> and <strong>V-Ray</strong> for
        real-time walkthroughs, professional certification, and creative careers across Noida and Delhi NCR.
      </>
    ),
    icon: PenTool,
  },
];

const flagshipTracks = [
  {
    name: "Creator X",
    description:
      "The ultimate track for Content Creators. Master video editing, 2D motion graphics, and AI-assisted storytelling for YouTube & Social Media.",
    icon: MonitorSmartphone,
  },
  {
    name: "Career X",
    description:
      "Ranking as the Best Animation Course in Ghaziabad & Noida, our curriculum includes Career X placement support, mock interviews, and a job-winning showreel.",
    icon: BadgeCheck,
  },
];

const advantages = [
  {
    label: "5 Minutes from Electronic City Metro",
    detail: "Reach the centre quickly from across Noida, Ghaziabad, and East Delhi.",
    icon: Train,
  },
  {
    label: "100+ Digital Agencies Nearby",
    detail: "Study in H-Block with direct proximity to Noida's active tech-agency hub.",
    icon: Building2,
  },
  {
    label: "Close to Sector 16 Film City",
    detail: "Stay connected to the production ecosystem where portfolios become opportunities.",
    icon: Zap,
  },
];

const degreeHighlights = [
  "Bachelor's degree pathway focused on Animation Degree and VFX production skills.",
  "UGC-recognized Scope Global Skills University academic association.",
  "Portfolio-led training for studio, broadcast, gaming, and digital content careers.",
];

const studentWorks = [
  {
    title: "Futuristic UI Concept",
    category: "UI/UX",
    alt: "Best UI UX Course Noida student work from MAAC Sector 63",
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=640&q=72&fm=webp",
  },
  {
    title: "3D Cafe Environment",
    category: "3D Animation",
    alt: "MAAC Ghaziabad Animation Labs 3D student environment artwork",
    image:
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=640&q=72&fm=webp",
  },
  {
    title: "Editing Studio Setup",
    category: "VFX",
    alt: "Best VFX Course Noida student work editing and compositing setup",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=640&q=72&fm=webp",
  },
  {
    title: "Action Shot Composite",
    category: "VFX",
    alt: "VFX Degree Noida student work action shot composite",
    image:
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=640&q=72&fm=webp",
  },
  {
    title: "Game World Design",
    category: "Game Design",
    alt: "Best Game Design Course Delhi NCR student game world design",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=640&q=72&fm=webp",
  },
  {
    title: "Character Lighting Study",
    category: "Animation",
    alt: "Best Animation Course in Ghaziabad and Noida character lighting student work",
    image:
      "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=640&q=72&fm=webp",
  },
];

const mapUrl =
  "https://www.google.com/maps?q=MAAC%20Noida-63%20H-58%20H%20Block%20Lower%20Ground%20Floor%20Sector%2063%20Noida%20Uttar%20Pradesh%20201309&output=embed";
const mapLink =
  "https://www.google.com/maps/search/?api=1&query=MAAC%20Noida-63%20H-58%20H%20Block%20Lower%20Ground%20Floor%20Sector%2063%20Noida%20Uttar%20Pradesh%20201309";

function trackLeadFormConversion() {
  window.gtag?.("event", "conversion", {
    send_to: "AW-18141074024/5TRhCLfWt6gcEOikq8pD",
    value: 1.0,
    currency: "INR",
  });
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    course: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    setFormMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Could not submit your request.");
      }

      trackLeadFormConversion();
      setFormStatus("success");
      setFormMessage(result.message || "Thanks. Our admissions team will call you shortly.");
      setFormData({ name: "", mobile: "", course: "" });
    } catch (error) {
      setFormStatus("error");
      setFormMessage(error instanceof Error ? error.message : "Could not submit your request.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-studio text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-studio/90 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="relative h-12 w-32 shrink-0 sm:h-14 sm:w-44" aria-label="MAAC Noida home">
            <Image
              src="/maacnoida.png"
              alt="MAAC Noida Sector 63 best animation and VFX institute in Delhi NCR"
              fill
              priority
              sizes="(max-width: 640px) 128px, 176px"
              className="object-contain"
            />
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
            {[
              ["Courses", "#courses"],
              ["Degree", "#degree"],
              ["Student Work", "#student-work"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-bold text-white/68 transition hover:bg-maacGold hover:text-black"
              >
                {label}
              </a>
            ))}
          </div>

          <a
            href="tel:08048032030"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-maacGold px-4 py-2.5 text-sm font-extrabold text-black shadow-gold transition hover:scale-105 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-maacGold focus:ring-offset-2 focus:ring-offset-studio"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>Call Center</span>
          </a>
        </nav>
      </header>

      <section className="relative isolate">
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=75&fm=webp"
          alt="Best VFX Course Noida student work creative studio at MAAC Sector 63"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.22),transparent_34%),linear-gradient(180deg,rgba(10,10,10,0.68),#0a0a0a_88%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/3 animate-shimmer bg-hero-shimmer opacity-70" />

        <div className="mx-auto grid min-h-[calc(100svh-65px)] w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.08fr_0.92fr] md:py-14 lg:px-8">
          <div className="max-w-3xl pt-2">
            <h1 className="text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-7xl">
              The Most Recommended Animation &amp; VFX Degree Courses in Noida and Delhi NCR.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-white/78 sm:text-xl">
              Join MAAC <span className="text-maacGold">Noida Sector 63</span> for 2026 industry-ready 3D Animation,
              <strong> VFX Degree Courses</strong>, Gaming, and UI/UX training featuring AI-integrated workflows and{" "}
              <strong>Unreal Engine 5</strong>.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/62 sm:text-base">
              Train at MAAC Animation in <span className="font-bold text-maacGold">Noida Sector 63</span>, minutes from
              H-Block studios, Film City networks, and NCR&apos;s growing creative production corridor.
            </p>
            <div className="mt-7 flex flex-col gap-3 min-[390px]:flex-row">
              <a
                href="#lead-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maacGold px-5 py-3 text-sm font-extrabold text-black shadow-gold transition hover:scale-105 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-maacGold focus:ring-offset-2 focus:ring-offset-studio sm:px-6 sm:py-3.5 sm:text-base"
              >
                Request Callback
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </a>
              <a
                href="#courses"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:scale-105 hover:border-maacGold/70 hover:text-maacGold sm:px-6 sm:py-3.5 sm:text-base"
              >
                Explore Courses
              </a>
            </div>
          </div>

          <LeadForm
            formData={formData}
            formStatus={formStatus}
            formMessage={formMessage}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <section id="courses" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-maacGold">Career Tracks</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Best animation, VFX degree, UI UX, gaming, and design courses in Noida.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <article
                key={course.name}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 transition hover:scale-105 hover:border-maacGold/60 hover:bg-maacGold/10"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-maacGold text-black">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-extrabold">{course.name}</h2>
                <p className="mt-3 text-sm leading-6 text-white/64">{course.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="x-factors" className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-maacGold">Flagship X Factors</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Creator X and Career X at MAAC <span className="text-maacGold">Noida Sector 63</span>.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/68">
              Build creator-first skills and a placement-ready portfolio with focused tracks designed for today&apos;s{" "}
              <strong>Animation Degree</strong>, VFX, gaming, and digital content careers.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {flagshipTracks.map((track) => {
              const Icon = track.icon;
              return (
                <article key={track.name} className="rounded-[2rem] border border-maacGold/20 bg-black/35 p-5 sm:p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-maacGold text-black">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-black">{track.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/68 sm:text-base">{track.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="degree" className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-maacGold/25 bg-gradient-to-br from-maacGold/[0.16] via-white/[0.045] to-white/[0.02] p-5 shadow-gold sm:p-8 lg:p-10">
          <div className="absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full bg-maacGold/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-maacGold/35 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-maacGold">
                Degree Program
              </p>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                B.Voc in Animation &amp; VFX
              </h2>
              <p className="mt-4 text-base leading-7 text-white/68">
                A bachelor&apos;s degree track for students who want degree equivalency, professional certification, and
                practical studio-oriented skills in animation, compositing, visual effects, and digital production.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/45 p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-maacGold text-black">
                  <GraduationCap className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/50">In association with</p>
                  <h3 className="text-xl font-black">Scope Global Skills University</h3>
                </div>
              </div>

              <div className="grid gap-3">
                {degreeHighlights.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-maacGold" aria-hidden="true" />
                    <p className="text-sm leading-6 text-white/68">{item}</p>
                  </div>
                ))}
              </div>

              <a
                href="#lead-form"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-maacGold px-5 py-3 text-sm font-black text-black shadow-gold transition hover:scale-105 hover:bg-yellow-300 sm:w-auto"
              >
                Request Degree Details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="student-work" className="bg-white py-12 text-black sm:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black tracking-tight sm:text-4xl">
            Projects Created By <span className="text-red-600">Our Students</span>
          </h2>
        </div>

        <div className="mt-8 overflow-hidden">
          <div className="flex w-max gap-5 motion-safe:animate-marquee sm:gap-8">
            {[...studentWorks, ...studentWorks].map((work, index) => (
              <article
                key={`${work.title}-${index}`}
                className="group w-[240px] shrink-0 overflow-hidden rounded-3xl bg-neutral-100 shadow-lg shadow-black/10 sm:w-[300px]"
                aria-hidden={index >= studentWorks.length}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={work.image}
                    alt={work.alt}
                    fill
                    sizes="(max-width: 640px) 240px, 300px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-maacGold">{work.category}</p>
                    <h3 className="mt-1 text-base font-black">{work.title}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2.5rem] border border-maacGold/20 bg-maacGold/[0.055] p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-maacGold">Sector 63 Advantage</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Why choose MAAC <span className="text-maacGold">Noida Sector 63</span>?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/68">
              We are located at the heart of Noida&apos;s H-Block tech hub, just 5 minutes from the Electronic City Metro
              Station. Our students benefit from direct proximity to 100+ digital agencies and the Sector 16 Film City
              ecosystem, making MAAC Sector 63 a strong choice for MAAC Noida, MAAC Ghaziabad, and MAAC Delhi NCR
              course searches.
            </p>
          </div>

          <div className="grid gap-4">
            {advantages.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-4 rounded-3xl border border-white/10 bg-black/35 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-maacGold text-black">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-extrabold">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/62">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-maacGold">Social Proof</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Studios and tools students aspire to.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/62">
              Static single-block logo art keeps requests low while giving students instant industry context.
            </p>
          </div>

          <svg
            role="img"
            aria-label="Partner logos including Netflix, Ubisoft, Prime Video, MPC, Technicolor, DNEG, Adobe, and Autodesk"
            viewBox="0 0 760 184"
            className="mt-8 h-auto w-full overflow-visible"
          >
            <defs>
              <rect id="logoTile" width="170" height="76" rx="22" />
            </defs>
            {[
              ["Netflix", 0, 0],
              ["Ubisoft", 196, 0],
              ["Prime Video", 392, 0],
              ["MPC", 588, 0],
              ["Technicolor", 0, 108],
              ["DNEG", 196, 108],
              ["Adobe", 392, 108],
              ["Autodesk", 588, 108],
            ].map(([label, x, y]) => (
              <g key={label} transform={`translate(${x} ${y})`}>
                <use href="#logoTile" className="fill-black/35 stroke-white/10" />
                <text
                  x="85"
                  y="43"
                  textAnchor="middle"
                  className="fill-white/75 text-[15px] font-black uppercase tracking-[0.22em]"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-5 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-maacGold">Visit Our Centre</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">MAAC Noida-63</h2>

            <div className="mt-6 grid gap-4 text-white/72">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-maacGold" aria-hidden="true" />
                <p className="text-sm leading-6 sm:text-base">
                  H-58, H Block, Lower Ground Floor, Sector 63, Noida, Uttar Pradesh - 201309
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-maacGold" aria-hidden="true" />
                <a href="tel:08048032030" className="text-sm font-bold text-white transition hover:text-maacGold sm:text-base">
                  08048032030
                </a>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 min-[390px]:flex-row">
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-maacGold px-5 py-3 text-sm font-black text-black shadow-gold transition hover:scale-105 hover:bg-yellow-300"
              >
                Open in Google Maps
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="tel:08048032030"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:scale-105 hover:border-maacGold/70 hover:text-maacGold"
              >
                Call Centre
              </a>
            </div>
          </div>

          <div className="min-h-[300px] border-t border-white/10 lg:border-l lg:border-t-0">
            <iframe
              title="Map to MAAC Noida-63"
              src={mapUrl}
              className="h-full min-h-[300px] w-full border-0 grayscale invert-[0.9] contrast-125"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-maacGold">MAAC Noida-63</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">
              H-58, H Block, Lower Ground Floor, Sector 63, Noida, Uttar Pradesh - 201309
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/58 sm:items-end">
            <a href="tel:08048032030" className="font-bold text-white transition hover:text-maacGold">
              Contact No: 08048032030
            </a>
            <p>© 2026 MAAC Sector 63, Noida. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/919319477255?text=Hi%20I%20want%20to%20know%20more%20about%20MAAC%20Courses"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-black text-black shadow-2xl shadow-black/35 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-studio sm:bottom-6 sm:right-6 sm:px-5"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </main>
  );
}

type LeadFormProps = {
  formData: {
    name: string;
    mobile: string;
    course: string;
  };
  formStatus: "idle" | "submitting" | "success" | "error";
  formMessage: string;
  setFormData: (value: { name: string; mobile: string; course: string }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function LeadForm({ formData, formStatus, formMessage, setFormData, onSubmit }: LeadFormProps) {
  const isSubmitting = formStatus === "submitting";

  return (
    <form
      id="lead-form"
      onSubmit={onSubmit}
      className="w-full rounded-[2rem] border border-white/12 bg-black/72 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6"
    >
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-maacGold">Request a Callback</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight">
          Start your MAAC <span className="text-maacGold">Noida Sector 63</span> admission enquiry.
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Share your details to explore 2026 Animation Degree, VFX Degree Courses, Gaming, UI UX, and design options.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-white/82">
          Name
          <input
            required
            minLength={2}
            name="name"
            autoComplete="name"
            disabled={isSubmitting}
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            placeholder="Your full name"
            className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-maacGold focus:ring-2 focus:ring-maacGold/25"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-white/82">
          Mobile
          <input
            required
            type="tel"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            name="mobile"
            autoComplete="tel"
            disabled={isSubmitting}
            value={formData.mobile}
            onChange={(event) => setFormData({ ...formData, mobile: event.target.value })}
            placeholder="10-digit mobile number"
            title="Enter a valid 10-digit Indian mobile number"
            className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-maacGold focus:ring-2 focus:ring-maacGold/25"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-white/82">
          Course Interest
          <select
            required
            name="course"
            disabled={isSubmitting}
            value={formData.course}
            onChange={(event) => setFormData({ ...formData, course: event.target.value })}
            className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition focus:border-maacGold focus:ring-2 focus:ring-maacGold/25"
          >
            <option value="" className="bg-studio">
              Select a course
            </option>
            <option className="bg-studio">3D Animation</option>
            <option className="bg-studio">VFX &amp; ADVFX</option>
            <option className="bg-studio">UI UX</option>
            <option className="bg-studio">Gaming</option>
            <option className="bg-studio">Interior</option>
            <option className="bg-studio">Creator X</option>
            <option className="bg-studio">Career X</option>
            <option className="bg-studio">B.Voc in Animation &amp; VFX</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-maacGold px-5 py-3 text-base font-black text-black shadow-gold transition hover:scale-105 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-maacGold focus:ring-offset-2 focus:ring-offset-black"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {formMessage ? (
        <p
          className={`mt-4 flex items-start gap-2 rounded-2xl border p-3 text-sm leading-6 ${
            formStatus === "success"
              ? "border-maacGold/30 bg-maacGold/10 text-maacGold"
              : "border-red-400/30 bg-red-500/10 text-red-200"
          }`}
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formMessage}
        </p>
      ) : null}
    </form>
  );
}
