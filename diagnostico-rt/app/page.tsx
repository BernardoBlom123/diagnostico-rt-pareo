'use client'

import { useEffect, useRef } from 'react'

const HERO_ICONS = [
  '/hero-icon.svg',
  '/hero-icon-2.svg',
  '/hero-icon-3.svg',
  '/hero-icon-4.svg',
]

/* CSS-pixel translation para cada canto ao abrir */
const CORNER_OPEN = [
  'translate(-6.5px,-6.5px)',
  'translate(-6.5px, 6.5px)',
  'translate( 6.5px,-6.5px)',
  'translate( 6.5px, 6.5px)',
]

export default function Home() {
  const photosRef  = useRef<HTMLImageElement[]>([])
  const cornersRef = useRef<SVGGElement[]>([])
  const currentRef = useRef(0)
  const busyRef    = useRef(false)

  useEffect(() => {
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

    const cycle = async () => {
      if (busyRef.current) return
      busyRef.current = true

      const photos  = photosRef.current
      const corners = cornersRef.current
      const cur     = currentRef.current
      const next    = (cur + 1) % photos.length
      const outP    = photos[cur]
      const inP     = photos[next]

      /* Estacionar próxima foto fora à direita (sem transição) */
      inP.style.transition = 'none'
      inP.style.transform  = 'translateX(60px)'
      await sleep(16)

      /* 1 ── Frame abre */
      corners.forEach((c, i) => { c.style.transform = CORNER_OPEN[i] })
      await sleep(300)

      /* 2 ── Swipe */
      outP.style.transition = 'transform 0.44s cubic-bezier(0.4,0,0.2,1)'
      outP.style.transform  = 'translateX(-60px)'
      inP.style.transition  = 'transform 0.44s cubic-bezier(0.4,0,0.2,1)'
      inP.style.transform   = 'translateX(0)'
      await sleep(460)

      /* 3 ── Frame fecha */
      corners.forEach(c => { c.style.transform = '' })
      await sleep(400)

      /* Repor foto sainte para ciclos futuros */
      outP.style.transition = 'none'
      outP.style.transform  = 'translateX(60px)'

      currentRef.current = next
      busyRef.current    = false
    }

    const id = setInterval(cycle, 4400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-screen overflow-hidden flex flex-col">

      {/* ── Navbar ── */}
      <header className="w-full px-8 pt-[35px] pb-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/header-logo.svg" alt="CLA Brasil" style={{ height: 44 }} />
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/language-switch.svg" alt="Idioma: PT" style={{ height: 40 }} />
            <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#848484] text-[#8E8E8E] text-sm font-medium hover:bg-black/5 transition-colors whitespace-nowrap">
              Fale com um especialista
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-6">

        {/*
          Avatar — duas camadas:
          1. photo-track: clip circular com overflow:hidden → fotos fazem swipe aqui
          2. frame-svg: cantos SVG independentes → abrem / fecham via refs
        */}
        <div className="mb-8" style={{ position: 'relative', width: 60, height: 60 }}>

          {/* Camada 1 — clip circular; 50%/50% garante centralização perfeita */}
          <div style={{ position: 'absolute', inset: 0, clipPath: 'circle(22.5px at 50% 50%)' }}>
            {HERO_ICONS.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                ref={el => { if (el) photosRef.current[i] = el }}
                src={src}
                alt={i === 0 ? 'Especialista Páreo' : ''}
                aria-hidden={i !== 0 || undefined}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: 60, height: 60,
                  transform: i === 0 ? 'translateX(0)' : 'translateX(60px)',
                }}
              />
            ))}
          </div>

          {/* Camada 2 — frame SVG (cantos animados) */}
          <svg
            viewBox="0 0 175 175"
            width={60}
            height={60}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="fg-tl" x1="22.25"  y1="0.5"  x2="22.25"  y2="44"    gradientUnits="userSpaceOnUse"><stop stopColor="#00D9BD"/><stop offset="1" stopColor="#666"/></linearGradient>
              <linearGradient id="fg-bl" x1="22.25"  y1="131"  x2="22.25"  y2="174.5" gradientUnits="userSpaceOnUse"><stop stopColor="#00D9BD"/><stop offset="1" stopColor="#666"/></linearGradient>
              <linearGradient id="fg-tr" x1="152.75" y1="0.5"  x2="152.75" y2="44"    gradientUnits="userSpaceOnUse"><stop stopColor="#00D9BD"/><stop offset="1" stopColor="#666"/></linearGradient>
              <linearGradient id="fg-br" x1="152.75" y1="131"  x2="152.75" y2="174.5" gradientUnits="userSpaceOnUse"><stop stopColor="#00D9BD"/><stop offset="1" stopColor="#666"/></linearGradient>
            </defs>

            <g ref={el => { if (el) cornersRef.current[0] = el }} style={{ transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)' }}>
              <path d="M0.5 44V22.25C0.5 16.4815 2.79151 10.9493 6.87043 6.87043C10.9493 2.79151 16.4815 0.5 22.25 0.5H44" stroke="url(#fg-tl)" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <g ref={el => { if (el) cornersRef.current[1] = el }} style={{ transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)' }}>
              <path d="M0.5 131V152.75C0.5 158.518 2.79151 164.051 6.87043 168.13C10.9493 172.208 16.4815 174.5 22.25 174.5H44" stroke="url(#fg-bl)" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <g ref={el => { if (el) cornersRef.current[2] = el }} style={{ transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)' }}>
              <path d="M131 0.5H152.75C158.518 0.5 164.051 2.79151 168.13 6.87043C172.208 10.9493 174.5 16.4815 174.5 22.25V44" stroke="url(#fg-tr)" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <g ref={el => { if (el) cornersRef.current[3] = el }} style={{ transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)' }}>
              <path d="M131 174.5H152.75C158.518 174.5 164.051 172.208 168.13 168.13C172.208 164.051 174.5 158.518 174.5 152.75V131" stroke="url(#fg-br)" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>

        </div>

        {/* Headline */}
        <h1 className="text-[52px] leading-[1.12] tracking-[-0.5px] mb-5 font-normal text-[#464646]">
          A Reforma Tributária chegou
          <br />
          Sua cadeia de fornecedores está pronta?
        </h1>

        {/* Descrição */}
        <p className="text-[#9CA3AF] text-[15px] max-w-[480px] mb-12 leading-relaxed">
          Descubra em minutos se os fornecedores expõem sua empresa a perda de
          créditos, bloqueios no split payment e riscos fiscais invisíveis.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <button className="px-7 py-3.5 rounded-full border border-[#848484] text-[#8E8E8E] text-sm font-medium hover:bg-black/5 transition-colors">
            Fale com um especialista
          </button>
          <button className="px-7 py-3.5 rounded-full bg-[#3D425D] text-white text-sm font-medium hover:bg-[#31364E] transition-colors">
            Analisar minha cadeia agora
          </button>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="w-full text-center pt-6 pb-[39px]">
        <p className="text-[#9CA3AF] text-[12px]">© 2026 CLA Brasil — todos os direitos reservados</p>
      </footer>

    </div>
  )
}
