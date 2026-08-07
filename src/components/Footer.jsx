import React from 'react'

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-cyan-500/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500 sm:gap-4 sm:text-[11px]">
          <span>© 2026 Copyright</span>
          <span className="hidden h-3 w-px bg-cyan-500/30 sm:block" />
          <span>Emre Karagöz</span>
          <span className="hidden h-3 w-px bg-cyan-500/30 sm:block" />
          <a
            href="https://emrekaragoz.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/80 transition-all duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          >
            DEV.KARAGOZ@GMAIL.COM
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer