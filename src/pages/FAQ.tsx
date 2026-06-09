import { useState } from 'react'
import { Link } from 'react-router-dom'

import { motion } from 'framer-motion'
import { HelpCircle, ArrowRight } from 'lucide-react'
import Navbar from '../components/ui/navbar'
import Accordion from '../components/ui/accordion'

const faqCategories = [
  'Getting Started',
  'The AI',
  'Boards & Languages',
  'Privacy',
  'Schools'
]

const faqData = [
  {
    category: 'Getting Started',
    question: "How do I get started with TeachFlow AI?",
    answer: "Simply click 'Start Discovering' on the homepage to go directly to the Discovery Wizard. There is no account creation or sign-in required to begin searching."
  },
  {
    category: 'Getting Started',
    question: "How do I start a new resource discovery search?",
    answer: "Simply follow the three steps in the Discovery Wizard: choose your board, grade, and language medium; type or speak your lesson topic; choose which resource types you need, and search!"
  },
  {
    category: 'Getting Started',
    question: "Is TeachFlow AI free to use for individual teachers?",
    answer: "Yes, the core TeachFlow AI search and workspace is 100% free for individual classroom teachers. We want to make high-quality educational resources accessible to everyone."
  },
  {
    category: 'The AI',
    question: "Where does the AI get its search results from?",
    answer: "TeachFlow AI queries across top educational websites and specialized tool indices simultaneously using Tavily Search. When results are sparse, the Gemini API is automatically triggered to recommend targeted, highly relevant curriculum resources."
  },
  {
    category: 'The AI',
    question: "What categories of tools are searched by default?",
    answer: "Our intelligent discovery engines cover: 1) AI Video & Explainer Tools, 2) AI Image & Stock Generators, 3) AI Flowchart & Mindmap Tools, 4) AI Quiz & Question Generators, and 5) AI Simulation & Virtual Labs."
  },
  {
    category: 'The AI',
    question: "How does the AI determine curriculum alignment?",
    answer: "The discovery router checks search indexing fields and metadata matching, and leverages LLM verification models to score each resource. If the board parameters match the syllabus keywords, the resource is flagged with a '✓ Verified Aligned' badge."
  },
  {
    category: 'Boards & Languages',
    question: "Which educational boards are supported?",
    answer: "We support major national and state syllabus systems: CBSE, ICSE, IB, IGCSE, Tamil Nadu (Samacheer Kalvi), Maharashtra, Karnataka, Kerala, Andhra Pradesh, Telangana, UP, Rajasthan, Gujarat, West Bengal, Delhi, Bihar, and MP Board."
  },
  {
    category: 'Boards & Languages',
    question: "What languages can I search in?",
    answer: "You can discover resources in 13 languages: English, Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Odia, Punjabi, Urdu, and Sanskrit."
  },
  {
    category: 'Boards & Languages',
    question: "How do I filter results by language?",
    answer: "You can select your preferred mediums in the Discovery Wizard, and further refine results using the live sidebar filters in the Results Workspace."
  },
  {
    category: 'Privacy',
    question: "Is my search history private and secure?",
    answer: "Yes. All searches and saved lesson bundles are linked to your secure Supabase user profile. We do not sell or share user search queries or lesson materials with third parties."
  },
  {
    category: 'Privacy',
    question: "Does the voice assistant record my microphone audio?",
    answer: "No. The Web Speech API operates directly inside your local browser. No voice audio is recorded, stored, or transmitted to external servers. Only the final typed text is passed to our search engines."
  },
  {
    category: 'Schools',
    question: "Can I integrate TeachFlow AI into my school or LMS?",
    answer: "Yes! We offer integrations for school systems, custom curriculum maps, and dashboard reporting. Please visit our Contact page and select 'School Administrator' or 'EdTech Partner' to request a school demo."
  }
]

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('Getting Started')

  const filteredFaqs = faqData.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accentPurple/10 text-accentPurple mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="font-display-h1 text-4xl md:text-5xl text-textPrimary">
            Frequently asked questions.
          </h1>
          <p className="font-sans text-textSecondary text-base mt-3 max-w-lg mx-auto">
            Everything you need to know about the TeachFlow AI discovery router.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-borderCustom pb-6">
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-syne text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-accentPurple text-white shadow-sm'
                  : 'bg-bgSecondary border border-borderCustom text-textSecondary hover:border-accentPurple/20 hover:text-textPrimary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions grid (2 cols desktop) */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto"
        >
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="h-fit">
              <Accordion question={faq.question} answer={faq.answer} />
            </div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <div className="text-center mt-20 p-8 bg-bgSecondary border border-borderCustom rounded-2xl max-w-3xl mx-auto shadow-sm">
          <h3 className="font-playfair text-xl font-semibold text-textPrimary mb-2">
            Still have questions?
          </h3>
          <p className="font-sans text-textSecondary text-sm mb-6 max-w-md mx-auto">
            Can't find the answer you are looking for? Please contact our team and we'll get right back to you.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-textPrimary hover:bg-textPrimary/95 text-white font-syne text-xs font-semibold uppercase tracking-wider rounded-lg transition-all"
          >
            Contact Us <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-borderCustom py-12 bg-bgSecondary">
        <div className="max-w-6xl mx-auto px-6 text-center text-textSecondary text-xs">
          <p>© 2025 Synora Intel · All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default FAQPage
