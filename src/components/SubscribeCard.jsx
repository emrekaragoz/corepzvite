import React, { useState } from 'react'

function SubscribeCard() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSuccess(true)
    setEmail('')
    setIsSubmitting(false)
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-cyan-950/40 p-4 backdrop-blur-sm sm:p-6">

      <div className="mb-2 text-center">
        <h3 className="text-base font-semibold text-white sm:text-lg">
          Stay Ahead of the Market
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          Get exclusive trading signals and market insights delivered to your inbox
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 rounded-xl border border-cyan-500/30 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full rounded-xl px-6 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 sm:w-auto ${
              isSuccess
                ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                : 'border border-cyan-500/30 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]'
            } ${
              isSubmitting || isSuccess ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : isSuccess ? (
              '✓ Subscribed!'
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubscribeCard