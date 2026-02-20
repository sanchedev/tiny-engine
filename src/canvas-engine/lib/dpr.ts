export function getDPRFromCtx(ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio ?? 1

  const { width: w, height: h } = ctx.canvas.getBoundingClientRect()

  const ratio = (dpr * w) / ctx.canvas.width

  const width = w * dpr
  const height = h * dpr

  return { width, height, ratio }
}
