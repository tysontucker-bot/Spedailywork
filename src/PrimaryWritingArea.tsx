interface PrimaryWritingAreaProps {
  traceName?: string
  traceText?: string
  height?: number
  lineCount?: number
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
  height = 72,
  lineCount = 1,
  align = 'center',
  horizontalPadding = 12,
  traceVariant = 'solid',
}: PrimaryWritingAreaProps) {
  const text = traceText ?? traceName
  const viewWidth = 1000
  const padding = horizontalPadding
  const normalizedLineCount = Math.max(1, Math.floor(lineCount))
  const groupHeight = height / normalizedLineCount
  const lineGap = groupHeight / 3
  const traceFontSize = 48
  const textX = align === 'left' ? padding + 8 : viewWidth / 2
  const isDotted = traceVariant === 'dotted'
  const lineGroups = Array.from({ length: normalizedLineCount }, (_, index) => {
   const groupTop = index * groupHeight
   const topY = groupTop + lineGap / 2
   const midY = topY + lineGap
   const baseY = midY + lineGap

   return {
     topY,
     midY,
     baseY,
   }
  })

  return (
   <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${viewWidth} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {lineGroups.map(({ topY, midY, baseY }, index) => (
        <g key={`primary-line-${index}`}>
          <line
            x1={padding} y1={topY}
            x2={viewWidth - padding} y2={topY}
            stroke="#555" strokeWidth={1.2}
          />
          <line
            x1={padding} y1={midY}
            x2={viewWidth - padding} y2={midY}
            stroke="#888" strokeWidth={1}
            strokeDasharray="6 4"
          />
          <line
            x1={padding} y1={baseY}
            x2={viewWidth - padding} y2={baseY}
            stroke="#555" strokeWidth={1.2}
          />
          {text && (
            <text
              x={textX}
              y={baseY}
              textAnchor={align === 'left' ? 'start' : 'middle'}
              dominantBaseline="alphabetic"
              fontSize={traceFontSize}
              fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
              fontWeight="normal"
              fill={isDotted ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.18)'}
              stroke={isDotted ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.10)'}
              strokeWidth={isDotted ? 1.15 : 0.5}
              strokeDasharray={isDotted ? '1.5 3.2' : undefined}
              strokeLinecap={isDotted ? 'round' : undefined}
              style={{ userSelect: 'none' }}
            >
              {text}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
