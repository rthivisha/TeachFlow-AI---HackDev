import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Send, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface FormFields {
  name: string
  email: string
  role: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  role?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    role: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const roles = [
    'Teacher',
    'School Administrator',
    'Government Official',
    'EdTech Partner',
    'Researcher',
    'Other'
  ]

  const validate = (): boolean => {
    const tempErrors: FormErrors = {}
    if (!fields.name.trim()) tempErrors.name = 'Name is required'
    if (!fields.email.trim()) {
      tempErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
      tempErrors.email = 'Invalid email address'
    }
    if (!fields.role) tempErrors.role = 'Please select a role'
    if (!fields.subject.trim()) tempErrors.subject = 'Subject is required'
    if (!fields.message.trim()) {
      tempErrors.message = 'Message content is required'
    } else if (fields.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    // Clear error
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setSubmitError(null)

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: fields.name,
        email: fields.email,
        role: fields.role,
        subject: fields.subject,
        message: fields.message
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      console.error('Submit contact error:', err)
      setSubmitError(err.message || 'Failed to submit form. Please verify your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-bgSecondary border border-borderCustom rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm"
      >
        {/* Draw Checkmark SVG */}
        <div className="w-16 h-16 bg-accentTeal/10 border border-accentTeal/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-accentTeal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="font-playfair text-2xl font-semibold text-textPrimary mb-2">
          Message Received
        </h3>
        <p className="font-sans text-sm text-textSecondary max-w-sm leading-relaxed">
          Thank you for reaching out. A representative from Synora Intel will respond within 48 hours.
        </p>

        <button
          onClick={() => {
            setSuccess(false)
            setFields({ name: '', email: '', role: '', subject: '', message: '' })
          }}
          className="mt-8 px-6 py-2.5 bg-bgPrimary hover:bg-bgPrimary/80 border border-borderCustom text-textPrimary font-syne text-xs font-semibold uppercase tracking-wider rounded-lg transition-all"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-bgSecondary border border-borderCustom rounded-xl p-8 shadow-sm">
      {submitError && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-1.5 font-semibold">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={fields.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-bgPrimary/40 border ${
              errors.name ? 'border-red-500' : 'border-borderCustom'
            } rounded-lg text-sm focus:outline-none focus:border-accentPurple focus:ring-1 focus:ring-accentPurple transition-colors`}
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-1.5 font-semibold">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@school.org"
            value={fields.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-bgPrimary/40 border ${
              errors.email ? 'border-red-500' : 'border-borderCustom'
            } rounded-lg text-sm focus:outline-none focus:border-accentPurple focus:ring-1 focus:ring-accentPurple transition-colors`}
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.email}</p>}
        </div>

        {/* Role Select */}
        <div>
          <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-1.5 font-semibold">
            Your Role
          </label>
          <select
            name="role"
            value={fields.role}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-bgPrimary/40 border ${
              errors.role ? 'border-red-500' : 'border-borderCustom'
            } rounded-lg text-sm focus:outline-none focus:border-accentPurple focus:ring-1 focus:ring-accentPurple transition-colors text-textPrimary`}
            disabled={loading}
          >
            <option value="" disabled>Select your role...</option>
            {roles.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
          {errors.role && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.role}</p>}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-1.5 font-semibold">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            placeholder="School Integration / Feedback"
            value={fields.subject}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-bgPrimary/40 border ${
              errors.subject ? 'border-red-500' : 'border-borderCustom'
            } rounded-lg text-sm focus:outline-none focus:border-accentPurple focus:ring-1 focus:ring-accentPurple transition-colors`}
            disabled={loading}
          />
          {errors.subject && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block text-[10px] font-syne uppercase tracking-wider text-textSecondary mb-1.5 font-semibold">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            placeholder="Type your message here..."
            value={fields.message}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-bgPrimary/40 border ${
              errors.message ? 'border-red-500' : 'border-borderCustom'
            } rounded-lg text-sm focus:outline-none focus:border-accentPurple focus:ring-1 focus:ring-accentPurple transition-colors resize-none`}
            disabled={loading}
          />
          {errors.message && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-textPrimary hover:bg-textPrimary/90 text-white font-syne font-semibold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Submit Form <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
