import { ArrowLeft } from 'lucide-react'
import { images } from '../../lib/images'

const sampleRows = [
  { name: 'Grocery run', cat: 'food', amt: '-86.20', up: false },
  { name: 'Salary · Acme', cat: 'income', amt: '+2,450.00', up: true },
  { name: 'Streaming', cat: 'media', amt: '-15.99', up: false },
  { name: 'Side project', cat: 'income', amt: '+640.00', up: true },
]

export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:grid lg:grid-cols-12">
      {/* form side */}
      <div className="relative flex w-full flex-col lg:col-span-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 pattern-grid mask-fade-b opacity-70" />
        <div className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" aria-label="Finance Flow home">
            <img
              src="/logo/logo-light-transparent.png"
              alt="Finance Flow"
              className="h-8 w-auto"
            />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-widest text-ink-mute transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </a>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <p className="relative z-10 px-5 pb-6 text-center text-[10px] font-mono uppercase tracking-[0.18em] text-ink-faint sm:px-8">
          encrypted · private · free forever
        </p>
      </div>

      {/* visual side */}
      <div className="relative hidden overflow-hidden border-l border-line lg:col-span-5 lg:block">
        <img
          src={images.plan}
          alt="Financial planning documents on a desk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-canvas-deep/70" />
        <div className="absolute inset-0 pattern-grid opacity-40" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <p className="text-[10px] font-pixel uppercase tracking-wide text-money-400">
            finance flow · personal ledger
          </p>

          <div className="rounded-xl border border-line bg-canvas-deep/85 p-6 shadow-pop backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-pixel uppercase text-ink-mute">today · live</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-money-500 animate-blink" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-money-400">
                  synced
                </span>
              </span>
            </div>
            <div className="space-y-3.5">
              {sampleRows.map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${row.up ? 'bg-money-500' : 'bg-amber-400/80'}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink">{row.name}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">
                        {row.cat}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-sm tabular ${
                      row.up ? 'text-money-400' : 'text-amber-300/90'
                    }`}
                  >
                    {row.amt}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-faint">
                net position
              </span>
              <span className="font-display text-lg font-semibold tabular text-money-400">
                +$2,987.81
              </span>
            </div>
          </div>

          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ink-faint">
            no noise · no nagging · just the ledger
          </p>
        </div>
      </div>
    </div>
  )
}
