"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Palette, Eye, Download } from "lucide-react"

interface ColorPalette {
  name: string
  colors: ColorVariant[]
}

interface ColorVariant {
  shade: string
  hex: string
  rgb: string
  hsl: string
}

interface ColorConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  grayScale: string
  mode: "light" | "dark"
  customPalettes: ColorPalette[]
  contrastRatio: number
}

interface ColorBuilderProps {
  onConfigChange: (config: ColorConfig) => void
}

const predefinedPalettes = [
  {
    name: "Blue",
    base: "#3B82F6",
    shades: {
      50: "#EFF6FF",
      100: "#DBEAFE", 
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#3B82F6",
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A"
    }
  },
  {
    name: "Green",
    base: "#10B981",
    shades: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#10B981",
      600: "#059669",
      700: "#047857",
      800: "#065F46",
      900: "#064E3B"
    }
  },
  {
    name: "Purple",
    base: "#8B5CF6",
    shades: {
      50: "#F5F3FF",
      100: "#EDE9FE",
      200: "#DDD6FE",
      300: "#C4B5FD",
      400: "#A78BFA",
      500: "#8B5CF6",
      600: "#7C3AED",
      700: "#6D28D9",
      800: "#5B21B6",
      900: "#4C1D95"
    }
  },
  {
    name: "Gray",
    base: "#6B7280",
    shades: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827"
    }
  }
]

export function ColorBuilder({ onConfigChange }: ColorBuilderProps) {
  const [config, setConfig] = useState<ColorConfig>({
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981", 
    accentColor: "#F59E0B",
    grayScale: "#6B7280",
    mode: "light",
    customPalettes: [],
    contrastRatio: 4.5
  })

  const [selectedPalette, setSelectedPalette] = useState(predefinedPalettes[0])
  const [customColor, setCustomColor] = useState("#000000")

  const updateConfig = (updates: Partial<ColorConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const { r, g, b } = rgb
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    const diff = max - min

    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)

      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)
          break
        case gNorm:
          h = (bNorm - rNorm) / diff + 2
          break
        case bNorm:
          h = (rNorm - gNorm) / diff + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const generateShades = (baseColor: string) => {
    const base = hexToHsl(baseColor)
    if (!base) return {}

    const shades: { [key: string]: string } = {}
    const lightness = [95, 90, 80, 65, 50, base.l, 45, 35, 25, 15]
    const shadeNames = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

    shadeNames.forEach((shade, index) => {
      const l = lightness[index]
      shades[shade] = `hsl(${base.h}, ${base.s}%, ${l}%)`
    })

    return shades
  }

  const calculateContrast = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    
    if (!rgb1 || !rgb2) return 1

    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
  }

  const generateCSS = () => {
    const primaryShades = generateShades(config.primaryColor)
    const secondaryShades = generateShades(config.secondaryColor)
    const grayShades = generateShades(config.grayScale)

    let css = `:root {\n`
    css += `  /* Primary Colors */\n`
    Object.entries(primaryShades).forEach(([shade, color]) => {
      css += `  --primary-${shade}: ${color};\n`
    })
    
    css += `\n  /* Secondary Colors */\n`
    Object.entries(secondaryShades).forEach(([shade, color]) => {
      css += `  --secondary-${shade}: ${color};\n`
    })
    
    css += `\n  /* Gray Scale */\n`
    Object.entries(grayShades).forEach(([shade, color]) => {
      css += `  --gray-${shade}: ${color};\n`
    })
    
    css += `\n  /* Accent */\n`
    css += `  --accent: ${config.accentColor};\n`
    css += `}\n`

    return css
  }

  const generateTailwindConfig = () => {
    const primaryShades = generateShades(config.primaryColor)
    const secondaryShades = generateShades(config.secondaryColor)
    const grayShades = generateShades(config.grayScale)

    return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          ${Object.entries(primaryShades).map(([shade, color]) => `${shade}: '${color}'`).join(',\n          ')}
        },
        secondary: {
          ${Object.entries(secondaryShades).map(([shade, color]) => `${shade}: '${color}'`).join(',\n          ')}
        },
        gray: {
          ${Object.entries(grayShades).map(([shade, color]) => `${shade}: '${color}'`).join(',\n          ')}
        },
        accent: '${config.accentColor}'
      }
    }
  }
}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const contrastRating = (ratio: number) => {
    if (ratio >= 7) return { rating: "AAA", color: "text-green-600" }
    if (ratio >= 4.5) return { rating: "AA", color: "text-blue-600" }
    if (ratio >= 3) return { rating: "AA Large", color: "text-yellow-600" }
    return { rating: "Fail", color: "text-red-600" }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="palette" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="palette">Color Palette</TabsTrigger>
          <TabsTrigger value="generator">Color Generator</TabsTrigger>
          <TabsTrigger value="contrast">Contrast Checker</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="palette" className="space-y-6">
          {/* Main Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Primary Colors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="w-12 h-10 rounded border"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded border"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => updateConfig({ accentColor: e.target.value })}
                    className="w-12 h-10 rounded border"
                  />
                  <Input
                    value={config.accentColor}
                    onChange={(e) => updateConfig({ accentColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Predefined Palettes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Predefined Palettes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {predefinedPalettes.map((palette) => (
                <Card 
                  key={palette.name} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPalette.name === palette.name ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPalette(palette)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{palette.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-1">
                      {Object.entries(palette.shades).slice(0, 5).map(([shade, color]) => (
                        <div
                          key={shade}
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: color }}
                          title={`${shade}: ${color}`}
                        />
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => updateConfig({ primaryColor: palette.base })}
                    >
                      Use as Primary
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Color Shades Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Shades</h3>
            
            <div className="space-y-4">
              {[
                { name: "Primary", color: config.primaryColor },
                { name: "Secondary", color: config.secondaryColor },
                { name: "Gray", color: config.grayScale }
              ].map((colorGroup) => {
                const shades = generateShades(colorGroup.color)
                return (
                  <div key={colorGroup.name}>
                    <h4 className="font-medium mb-2">{colorGroup.name}</h4>
                    <div className="grid grid-cols-10 gap-2">
                      {Object.entries(shades).map(([shade, color]) => {
                        const rgb = hexToRgb(color.includes('hsl') ? colorGroup.color : color)
                        const isLight = rgb ? (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186 : false
                        
                        return (
                          <div 
                            key={shade}
                            className="group relative"
                          >
                            <div
                              className="w-full h-16 rounded-md shadow-sm cursor-pointer"
                              style={{ backgroundColor: color }}
                              onClick={() => copyToClipboard(color)}
                            />
                            <div className={`text-xs mt-1 text-center ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                              {shade}
                            </div>
                            <div className="text-xs text-center text-gray-500 truncate" title={color}>
                              {color.length > 8 ? color.substring(0, 7) + '...' : color}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Color Generator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Base Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-10 rounded border"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => updateConfig({ primaryColor: customColor })}
                    className="w-full"
                  >
                    Set as Primary
                  </Button>
                  <Button
                    onClick={() => updateConfig({ secondaryColor: customColor })}
                    variant="outline"
                    className="w-full"
                  >
                    Set as Secondary
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Generated Shades</Label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(generateShades(customColor)).slice(0, 10).map(([shade, color]) => (
                    <div key={shade} className="text-center">
                      <div
                        className="w-full h-12 rounded shadow-sm cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                        title={`Click to copy: ${color}`}
                      />
                      <div className="text-xs mt-1">{shade}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contrast" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contrast Checker</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Color Combinations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { bg: config.primaryColor, fg: "#FFFFFF", name: "Primary + White" },
                    { bg: config.primaryColor, fg: "#000000", name: "Primary + Black" },
                    { bg: config.secondaryColor, fg: "#FFFFFF", name: "Secondary + White" },
                    { bg: config.secondaryColor, fg: "#000000", name: "Secondary + Black" },
                    { bg: "#FFFFFF", fg: config.primaryColor, name: "White + Primary" },
                    { bg: "#000000", fg: config.primaryColor, name: "Black + Primary" }
                  ].map((combo) => {
                    const ratio = calculateContrast(combo.bg, combo.fg)
                    const rating = contrastRating(ratio)
                    
                    return (
                      <div key={combo.name} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-8 rounded flex items-center justify-center text-sm font-medium"
                            style={{ backgroundColor: combo.bg, color: combo.fg }}
                          >
                            Aa
                          </div>
                          <div>
                            <div className="font-medium text-sm">{combo.name}</div>
                            <div className="text-xs text-gray-500">{ratio.toFixed(2)}:1</div>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${rating.color}`}>
                          {rating.rating}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Accessibility Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>AAA:</strong> 7:1 contrast ratio (Best)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span><strong>AA:</strong> 4.5:1 contrast ratio (Good)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span><strong>AA Large:</strong> 3:1 ratio for large text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span><strong>Fail:</strong> Below 3:1 ratio</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Export Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CSS Variables</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(generateCSS())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto max-h-64">
                    {generateCSS()}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tailwind Config</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(generateTailwindConfig())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto max-h-64">
                    {generateTailwindConfig()}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
