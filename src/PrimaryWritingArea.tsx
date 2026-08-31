interface PrimaryWritingAreaProps {
  traceName?: string
  traceText?: string
  height?: number
  align?: 'left' | 'center'
  horizontalPadding?: number
  traceVariant?: 'solid' | 'dotted'
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
  traceText,
  height = 80,
  align = 'center',
  horizontalPadding = 12,
  traceVariant = 'solid',
}: PrimaryWritingAreaProps) {
  const text = traceText ?? traceName
  const viewWidth = 1000
  const padding = horizontalPadding
  const topY = 10
  const midY = height / 2
  const baseY = height - 10

  const xHeight = baseY - midY
  const fontSize = Math.round(xHeight / 0.52)
  const availableWidth = viewWidth - padding * 2
  const textWidthUnits = text
    ? Math.max(
      1,
      Array.from(text).reduce((sum, character) => sum + (character === ' ' ? 0.35 : 0.62), 0),
    )
    : 1
  const scaledFontSize = text
    ? Math.max(18, Math.min(fontSize, Math.floor((availableWidth - 8) / (textWidthUnits * 1.02))))
    : fontSize
  const textX = align === 'left' ? padding + 8 : viewWidth / 2
  const isDotted = traceVariant === 'dotted'

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${viewWidth} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* solid top line */}
      <line
        x1={padding} y1={topY}
        x2={viewWidth - padding} y2={topY}
        stroke="#555" strokeWidth={1.2}
      />

      {/* dashed midline */}
      <line
        x1={padding} y1={midY}
        x2={viewWidth - padding} y2={midY}
        stroke="#888" strokeWidth={1}
        strokeDasharray="6 4"
      />

      {/* solid baseline */}
      <line
        x1={padding} y1={baseY}
        x2={viewWidth - padding} y2={baseY}
        stroke="#555" strokeWidth={1.2}
      />

      {/* tracing text anchored to baseline */}
      {text && (
        <text
          x={textX}
          y={baseY}
          textAnchor={align === 'left' ? 'start' : 'middle'}
          dominantBaseline="alphabetic"
          fontSize={scaledFontSize}
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          fontWeight="normal"
          fill={isDotted ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.18)'}
          stroke={isDotted ? 'rgba(0,0,0,0.24)' : 'rgba(0,0,0,0.10)'}
          strokeWidth={isDotted ? 1.15 : 0.5}
          strokeDasharray={isDotted ? '1.5 3.2' : undefined}
          strokeLinecap={isDotted ? 'round' : undefined}
          style={{ userSelect: 'none' }}
        >
          {text}
        </text>
      )}
    </svg>
  )
}
