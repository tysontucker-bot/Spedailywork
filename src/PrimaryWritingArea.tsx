interface PrimaryWritingAreaProps {
  traceName?: string
  height?: number
}

/**
 * Renders a primary handwriting area with:
 *   - solid top line
 *   - dashed midline
 *   - solid baseline
 *
 * When traceName is provided the name is rendered as tracing text
 * anchored to the baseline so that lowercase letters sit between
 * the midline and baseline and ascenders/descenders align correctly.
 */
export function PrimaryWritingArea({
  traceName,
  height = 80,
}: PrimaryWritingAreaProps) {
  const padding = 12          // horizontal margin inside svg
  const topY    = 10          // y of the solid top line
  const midY    = height / 2  // y of the dashed midline
  const baseY   = height - 10 // y of the solid baseline

  // Font size so x-height fills mid→base zone.
  // A typical font x-height ratio is ~0.52 of the em size.
  const xHeight  = baseY - midY
  const fontSize = Math.round(xHeight / 0.52)

  return (
    <svg
      width="100%"
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* solid top line */}
      <line
        x1={padding} y1={topY}
        x2="100%" y2={topY}
        stroke="#555" strokeWidth={1.2}
      />

      {/* dashed midline */}
      <line
        x1={padding} y1={midY}
        x2="100%" y2={midY}
        stroke="#888" strokeWidth={1}
        strokeDasharray="6 4"
      />

      {/* solid baseline */}
      <line
        x1={padding} y1={baseY}
        x2="100%" y2={baseY}
        stroke="#555" strokeWidth={1.2}
      />

      {/* tracing text anchored to baseline */}
      {traceName && (
        <text
          x="50%"
          y={baseY}
          textAnchor="middle"
          dominantBaseline="alphabetic"
          fontSize={fontSize}
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          fontWeight="normal"
          fill="rgba(0,0,0,0.18)"
          stroke="rgba(0,0,0,0.10)"
          strokeWidth={0.5}
          style={{ userSelect: 'none' }}
        >
          {traceName}
        </text>
      )}
    </svg>
  )
}
