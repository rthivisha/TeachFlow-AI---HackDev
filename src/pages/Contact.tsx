import { Link } from 'react-router-dom'

import { Linkedin, Mail, School, ArrowRight } from 'lucide-react'
import Navbar from '../components/ui/navbar'
import ContactForm from '../components/ui/contact-form'

export function ContactPage() {
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 max-w-6xl mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="font-display-h1 text-4xl md:text-5xl lg:text-[52px] text-textPrimary leading-tight">
            Get in touch.
          </h1>
          <p className="font-sans text-textSecondary text-base mt-3 max-w-md mx-auto">
            For partnerships, school integrations, and feedback.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* LEFT COLUMN: Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="font-syne text-[10px] tracking-[0.25em] text-accentPurple uppercase font-semibold block">
                Contact Synora Intel
              </span>
              <h2 className="font-playfair text-2xl font-bold text-textPrimary">
                TeachFlow AI
              </h2>
              <p className="font-sans text-sm text-textSecondary leading-relaxed">
                Synora Intelligence Discovery Router is built by the Synora Intel engineering group. We are on a mission to optimize educational workflows and support classroom teachers globally.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-4 border-t border-borderCustom">
              <div className="flex items-center gap-3 text-textSecondary hover:text-textPrimary transition-colors">
                <div className="w-8 h-8 rounded-full bg-accentTeal/10 text-accentTeal flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/60 block">Email Us</span>
                  <a href="mailto:hello@synoraIntel.com" className="font-sans text-sm font-semibold">
                    hello@synoraIntel.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-textSecondary hover:text-textPrimary transition-colors">
                <div className="w-8 h-8 rounded-full bg-accentBlue/10 text-accentBlue flex items-center justify-center shrink-0">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-syne uppercase tracking-wider text-textSecondary/60 block">Social</span>
                  <a
                    href="https://linkedin.com/company/synora-intel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm font-semibold hover:underline"
                  >
                    Connect on LinkedIn →
                  </a>
                </div>
              </div>
            </div>

            {/* School Card */}
            <div className="bg-bgSecondary border border-borderCustom rounded-xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-lg bg-accentPurple/10 text-accentPurple flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-card-h3 text-base text-textPrimary">
                  For Schools & Institutions
                </h3>
                <p className="font-sans text-xs text-textSecondary mt-1.5 leading-relaxed">
                  Representing a school, state education board, or academy group? We'd love to talk about bespoke curriculum integrations, offline indexing, and district licensing.
                </p>
              </div>
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 text-[11px] font-syne font-bold uppercase tracking-wider text-accentPurple hover:opacity-85 transition-opacity"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

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

export default ContactPage
