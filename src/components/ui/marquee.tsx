import { Search, Cpu, Globe, Share2 } from 'lucide-react'


const marqueeData = [
  "How do I find Class 8 CBSE science videos?",
  "Where can I get Tamil medium worksheets?",
  "What simulation tools work for biology labs?",
  "How do I find NCERT-aligned resources?",
  "Which AI tools generate quiz questions?",
  "Can I search by board and grade together?",
  "How do I get flowcharts for lesson planning?",
  "Are there free simulation labs for physics?",
  "How do I find resources in Kannada medium?",
  "What tools help create explainer videos?",
  "Can I save and share my resource bundle?",
  "How accurate is the curriculum alignment?",
]

const features = [
  {
    icon: Search,
    title: "Instant discovery",
    description: "No more tab-switching. One prompt returns videos, diagrams, simulations and worksheets — filtered for your board, grade, and language."
  },
  {
    icon: Cpu,
    title: "AI does the work",
    description: "Our router expands your query, searches across every category simultaneously, and verifies alignment before returning results."
  },
  {
    icon: Globe,
    title: "Every language, every board",
    description: "Tamil, Hindi, Telugu, Kannada and more. CBSE, ICSE, Samacheer Kalvi and all major state boards — all supported."
  },
  {
    icon: Share2,
    title: "Bundle and share",
    description: "Save any resource to your lesson bundle. Share with students via link, WhatsApp, or export as PDF in one click."
  }
]

export function FeaturesMarqueeSection() {
  // Split data into 3 rows
  const row1 = [...marqueeData.slice(0, 4), ...marqueeData.slice(0, 4)]
  const row2 = [...marqueeData.slice(4, 8), ...marqueeData.slice(4, 8)]
  const row3 = [...marqueeData.slice(8, 12), ...marqueeData.slice(8, 12)]

  return (
    <section id="features" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px', marginTop: '0' }} className="bg-bgPrimary relative overflow-hidden w-full">
      <div style={{ textAlign: 'center', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '48px' }}>
        <span className="font-eyebrow text-xs text-accentPurple tracking-[0.2em] font-semibold block">
          Seamless Workflow
        </span>
        <h2 className="font-section-h2 text-4xl md:text-5xl mt-3 text-textPrimary">
          Removing the friction from teaching.
        </h2>
        <p className="font-sans text-textSecondary text-lg max-w-2xl mx-auto mt-4">
          We cut through the noise so teachers can focus on what matters.
        </p>
      </div>

      {/* Marquee Wrapper with side fade masks */}
      <div className="relative w-full py-10 flex flex-col gap-6 overflow-hidden">
        {/* Left and Right Fade Gradients */}
        <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-bgPrimary to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-bgPrimary to-transparent z-10 pointer-events-none"></div>

        {/* Row 1: Left to Right (Duration 45s) */}
        <div className="flex w-max gap-6 [--gap:1.5rem] [--duration:45s] animate-marquee [animation-direction:reverse]">
          {row1.map((item, idx) => (
            <div
              key={`row1-${idx}`}
              className="bg-bgSecondary border border-borderCustom rounded-full px-6 py-3 font-syne text-sm font-semibold text-textPrimary shadow-sm hover:border-accentPurple/30 transition-colors shrink-0"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Row 2: Right to Left (Duration 50s) */}
        <div className="flex w-max gap-6 [--gap:1.5rem] [--duration:50s] animate-marquee">
          {row2.map((item, idx) => (
            <div
              key={`row2-${idx}`}
              className="bg-bgSecondary border border-borderCustom rounded-full px-6 py-3 font-syne text-sm font-semibold text-textPrimary shadow-sm hover:border-accentPurple/30 transition-colors shrink-0"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Row 3: Left to Right (Duration 42s) */}
        <div className="flex w-max gap-6 [--gap:1.5rem] [--duration:42s] animate-marquee [animation-direction:reverse]">
          {row3.map((item, idx) => (
            <div
              key={`row3-${idx}`}
              className="bg-bgSecondary border border-borderCustom rounded-full px-6 py-3 font-syne text-sm font-semibold text-textPrimary shadow-sm hover:border-accentPurple/30 transition-colors shrink-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* 4-Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feat, idx) => {
          const IconComp = feat.icon
          return (
            <div
              key={idx}
              className="bg-bgSecondary border border-borderCustom rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-10 h-10 bg-accentPurple/10 border border-accentPurple/10 rounded-lg flex items-center justify-center mb-4 text-accentPurple">
                <IconComp className="w-5 h-5" />
              </div>
              <h3 className="font-card-h3 text-lg text-textPrimary mb-2">
                {feat.title}
              </h3>
              <p className="font-sans text-sm text-textSecondary leading-relaxed">
                {feat.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturesMarqueeSection
