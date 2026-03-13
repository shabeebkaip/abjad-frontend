import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abjad – Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "#2bbdc5" }}
      >
        {/* Background decorative circles */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ backgroundColor: "#ffffff" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: "#ffffff" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: "#ffffff" }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Logo */}
          <div className="mb-8">
            <svg width="180" height="90" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Arabic calligraphy stylized */}
              <text
                x="150"
                y="75"
                textAnchor="middle"
                fontSize="72"
                fontFamily="Georgia, serif"
                fill="white"
                fontWeight="300"
                letterSpacing="2"
              >
                أبجد
              </text>
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-light text-white tracking-widest mb-4">
            ABJAD
          </h1>
          <div className="w-16 h-0.5 bg-white/50 mb-6" />
          <p className="text-white/90 text-lg font-light leading-relaxed max-w-sm">
            Connecting talented teachers with schools that inspire
          </p>
          <p className="text-white/60 text-sm mt-4 max-w-xs">
            The premier hiring platform for education professionals
          </p>

          {/* Stats */}
          <div className="flex gap-12 mt-12">
            <div className="text-center">
              <p className="text-white text-2xl font-semibold">500+</p>
              <p className="text-white/70 text-xs mt-1">Schools</p>
            </div>
            <div className="text-center">
              <p className="text-white text-2xl font-semibold">2K+</p>
              <p className="text-white/70 text-xs mt-1">Teachers</p>
            </div>
            <div className="text-center">
              <p className="text-white text-2xl font-semibold">1K+</p>
              <p className="text-white/70 text-xs mt-1">Placed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div
          className="lg:hidden flex flex-col items-center mb-8"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "#2bbdc5" }}
          >
            <span className="text-white text-2xl font-serif">أ</span>
          </div>
          <span className="text-xl font-serif tracking-widest text-gray-800">ABJAD</span>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
