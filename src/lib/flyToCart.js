export function flyToCart(startElement, imageUrl) {
  const cartEl = document.getElementById('cart-icon')
  if (!cartEl || !startElement) return

  const startRect = startElement.getBoundingClientRect()
  const cartRect = cartEl.getBoundingClientRect()

  const startX = startRect.left + startRect.width / 2
  const startY = startRect.top + startRect.height / 2
  const endX = cartRect.left + cartRect.width / 2
  const endY = cartRect.top + cartRect.height / 2

  // Titik kontrol lengkungan (parabola) — dinaikkan ke atas biar melengkung
  const controlX = (startX + endX) / 2
  const controlY = Math.min(startY, endY) - 150

  const flyer = document.createElement('div')
  flyer.className = 'fly-to-cart'
  if (imageUrl) {
    flyer.style.backgroundImage = `url(${imageUrl})`
  }
  document.body.appendChild(flyer)

  const duration = 700
  const startTime = performance.now()

  function animate(now) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // easeInOutQuad

    // Bezier kuadratik: lengkung dari start -> control -> end
    const x = (1 - ease) ** 2 * startX + 2 * (1 - ease) * ease * controlX + ease ** 2 * endX
    const y = (1 - ease) ** 2 * startY + 2 * (1 - ease) * ease * controlY + ease ** 2 * endY

    const scale = 1 - ease * 0.75
    const opacity = 1 - Math.max(0, ease - 0.7) / 0.3

    flyer.style.transform = `translate(${x - 24}px, ${y - 24}px) scale(${scale}) rotate(${ease * 360}deg)`
    flyer.style.opacity = opacity

    if (t < 1) {
      requestAnimationFrame(animate)
    } else {
      flyer.remove()
      cartEl.classList.add('cart-bump')
      setTimeout(() => cartEl.classList.remove('cart-bump'), 300)
    }
  }

  requestAnimationFrame(animate)
}