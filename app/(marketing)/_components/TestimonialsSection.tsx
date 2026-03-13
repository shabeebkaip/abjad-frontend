import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Al-Rashid",
    role: "Mathematics Teacher",
    school: "Placed at Al-Noor International, Dubai",
    quote:
      "I uploaded my profile on a Monday and had three interview requests by Thursday. Abjad is genuinely different — schools here are serious about finding quality teachers.",
    avatar: "FA",
    color: "#2bbdc5",
  },
  {
    name: "Omar Hassan",
    role: "HR Director",
    school: "Manarat Al-Riyadh Schools",
    quote:
      "We used to spend weeks sifting through applications. With Abjad, we get pre-filtered candidates that actually match our requirements. It cut our hiring time in half.",
    avatar: "OH",
    color: "#0e7a81",
  },
  {
    name: "Sara Al-Mutairi",
    role: "English & Literature Teacher",
    school: "Placed at The British School, Kuwait",
    quote:
      "The profile builder asked all the right questions and the matching actually worked. I found a school that aligns with my teaching philosophy perfectly.",
    avatar: "SM",
    color: "#6366f1",
  },
  {
    name: "Khalid Bin Nasser",
    role: "Principal",
    school: "Al-Fajr Academy, Jeddah",
    quote:
      "We've been using Abjad for two years and it's now our primary hiring channel. The quality of applicants is consistently higher than any other platform we've tried.",
    avatar: "KN",
    color: "#f59e0b",
  },
  {
    name: "Mona Youssef",
    role: "Science Teacher",
    school: "Placed at Emirates Future School, Abu Dhabi",
    quote:
      "As a teacher returning from a career break, I was worried about job hunting. Abjad made it easy to showcase my experience and connect with schools that valued it.",
    avatar: "MY",
    color: "#ec4899",
  },
  {
    name: "Ahmad Al-Sayed",
    role: "Academic Director",
    school: "The Learning Tree, Bahrain",
    quote:
      "The built-in messaging and scheduling tools saved us so much back-and-forth. We interviewed 12 candidates in one week and found our new head of department.",
    avatar: "AS",
    color: "#10b981",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "#e0f7f8", color: "#2bbdc5" }}
          >
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Loved by teachers & schools
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Don&apos;t take our word for it. Here&apos;s what real users are saying.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Quote size={20} style={{ color: "#2bbdc5" }} className="mb-4 opacity-50" />
              <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                  <p className="text-xs mt-0.5" style={{ color: t.color }}>{t.school}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
