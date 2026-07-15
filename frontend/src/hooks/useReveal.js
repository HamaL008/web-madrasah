import { useEffect } from 'react'

/**
 * Pasang di komponen root (App atau Home).
 * Semua elemen dengan class "reveal" akan muncul saat masuk viewport.
 */
export function useRevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const attach = () => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    }

    // Attach sekarang + watch DOM mutations (komponen lazy)
    attach()
    const mut = new MutationObserver(attach)
    mut.observe(document.body, { childList: true, subtree: true })

    return () => { observer.disconnect(); mut.disconnect() }
  }, [])
}
