import React from 'react'

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-cyan-500/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-slate-500 sm:flex-row sm:gap-4">
          
          <span>© 2026 Copyright</span>
          
          {/* Yatay Ayırıcı (Desktop'ta görünür) */}
          <span className="hidden h-3 w-px bg-cyan-500/30 sm:block" />
          
          <span>Emre Karagöz</span>
          
          {/* Yatay Ayırıcı (Desktop'ta görünür) */}
          <span className="hidden h-3 w-px bg-cyan-500/30 sm:block" />
          
          <a
            href="https://emrekaragoz.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/80 transition-all duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          >
            emrekaragoz.dev
          </a>

        </div>
      </div>
    </footer>
  )
}

export default Footer