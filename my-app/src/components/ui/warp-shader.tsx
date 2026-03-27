"use client"

import { Warp } from "@paper-design/shaders-react"

interface WarpShaderBackgroundProps {
  className?: string
  speed?: number
  colors?: string[]
}

export default function WarpShaderBackground({
  className = "",
  speed = 1,
  colors,
}: WarpShaderBackgroundProps) {
  const brandColors = colors || [
    "hsl(220, 73%, 40%)",
    "hsl(217, 91%, 60%)",
    "hsl(215, 80%, 25%)",
    "hsl(213, 94%, 68%)",
  ]

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Warp
        style={{ height: "100%", width: "100%" }}
        proportion={0.45}
        softness={1}
        distortion={0.25}
        swirl={0.8}
        swirlIterations={10}
        shape="checks"
        shapeScale={0.1}
        scale={1}
        rotation={0}
        speed={speed}
        colors={brandColors}
      />
    </div>
  )
}
