import React from 'react'
import { Check } from 'lucide-react'

interface StepProgressProps {
  currentStep: number // 1, 2, or 3
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    { num: 1, label: 'Your Context' },
    { num: 2, label: 'Your Topic' },
    { num: 3, label: 'Resource Types' }
  ]

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-6 border-b border-borderCustom bg-bgPrimary/80 backdrop-blur-md sticky top-[72px] z-20 flex items-center justify-between">
      {steps.map((step, idx) => {
        const isActive = step.num === currentStep
        const isComplete = step.num < currentStep
        const isLast = idx === steps.length - 1

        return (
          <React.Fragment key={step.num}>
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-syne font-bold transition-all duration-300 ${
                  isComplete
                    ? 'bg-accentTeal text-white'
                    : isActive
                    ? 'bg-accentPurple text-white ring-4 ring-accentPurple/20'
                    : 'bg-white border border-borderCustom text-textSecondary/40'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
              </div>
              <span
                className={`text-[10px] font-syne uppercase tracking-wider font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-accentPurple'
                    : isComplete
                    ? 'text-accentTeal'
                    : 'text-textSecondary/40'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div className="flex-grow h-[2px] bg-borderCustom mx-4 relative -top-3.5">
                <div
                  className="absolute left-0 top-0 h-full bg-accentTeal transition-all duration-500"
                  style={{
                    width: isComplete ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default StepProgress
