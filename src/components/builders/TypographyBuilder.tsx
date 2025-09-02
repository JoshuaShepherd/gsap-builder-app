"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download } from "lucide-react"

interface TypographyConfig {
  family: string
  size: number
  weight: string
  color: string
  lineHeight: number
  letterSpacing: number
  textAlign: string
  textTransform: string
  decoration: string
}

interface TypographyBuilderProps {
  onConfigChange: (config: TypographyConfig) => void
}

const fontFamilies = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Nunito",
  "Poppins",
  "Source Sans Pro",
  "Raleway",
  "Work Sans",
  "Georgia",
  "Times New Roman",
  "serif",
  "Courier New",
  "Monaco",
  "monospace"
]

const fontWeights = [
  { value: "100", label: "Thin" },
  { value: "200", label: "Extra Light" },
  { value: "300", label: "Light" },
  { value: "400", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" }
]

const colors = [
  { value: "#000000", label: "Black" },
  { value: "#374151", label: "Gray 700" },
  { value: "#6B7280", label: "Gray 500" },
  { value: "#9CA3AF", label: "Gray 400" },
  { value: "#EF4444", label: "Red" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#10B981", label: "Emerald" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#8B5CF6", label: "Violet" },
  { value: "#EC4899", label: "Pink" }
]

const textAlignments = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" }
]

const textTransforms = [
  { value: "none", label: "None" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "capitalize", label: "Capitalize" }
]

const textDecorations = [
  { value: "none", label: "None" },
  { value: "underline", label: "Underline" },
  { value: "overline", label: "Overline" },
  { value: "line-through", label: "Line Through" }
]

export function TypographyBuilder({ onConfigChange }: TypographyBuilderProps) {
  const [config, setConfig] = useState<TypographyConfig>({
    family: "Inter",
    size: 16,
    weight: "400",
    color: "#000000",
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: "left",
    textTransform: "none",
    decoration: "none"
  })

  const updateConfig = (updates: Partial<TypographyConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const generateCSS = () => {
    return `font-family: ${config.family};
font-size: ${config.size}px;
font-weight: ${config.weight};
color: ${config.color};
line-height: ${config.lineHeight};
letter-spacing: ${config.letterSpacing}px;
text-align: ${config.textAlign};
text-transform: ${config.textTransform};
text-decoration: ${config.decoration};`
  }

  const generateTailwindClasses = () => {
    const fontSizeMap: { [key: number]: string } = {
      12: "text-xs",
      14: "text-sm",
      16: "text-base",
      18: "text-lg",
      20: "text-xl",
      24: "text-2xl",
      30: "text-3xl",
      36: "text-4xl",
      48: "text-5xl",
      60: "text-6xl"
    }

    const weightMap: { [key: string]: string } = {
      "100": "font-thin",
      "200": "font-extralight",
      "300": "font-light",
      "400": "font-normal",
      "500": "font-medium",
      "600": "font-semibold",
      "700": "font-bold",
      "800": "font-extrabold",
      "900": "font-black"
    }

    const alignMap: { [key: string]: string } = {
      "left": "text-left",
      "center": "text-center",
      "right": "text-right",
      "justify": "text-justify"
    }

    const transformMap: { [key: string]: string } = {
      "none": "",
      "uppercase": "uppercase",
      "lowercase": "lowercase",
      "capitalize": "capitalize"
    }

    const decorationMap: { [key: string]: string } = {
      "none": "",
      "underline": "underline",
      "overline": "overline",
      "line-through": "line-through"
    }

    const classes = [
      fontSizeMap[config.size] || `text-[${config.size}px]`,
      weightMap[config.weight],
      alignMap[config.textAlign],
      transformMap[config.textTransform],
      decorationMap[config.decoration]
    ].filter(Boolean).join(" ")

    return classes
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={config.family} onValueChange={(value) => updateConfig({ family: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label>Font Size: {config.size}px</Label>
          <Slider
            value={[config.size]}
            onValueChange={([value]) => updateConfig({ size: value })}
            min={8}
            max={72}
            step={1}
          />
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select value={config.weight} onValueChange={(value) => updateConfig({ weight: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {fontWeights.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={config.color}
              onChange={(e) => updateConfig({ color: e.target.value })}
              className="w-12 h-10 rounded border"
            />
            <Select value={config.color} onValueChange={(value) => updateConfig({ color: value })}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {colors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <Label>Line Height: {config.lineHeight}</Label>
          <Slider
            value={[config.lineHeight]}
            onValueChange={([value]) => updateConfig({ lineHeight: value })}
            min={0.8}
            max={3}
            step={0.1}
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <Label>Letter Spacing: {config.letterSpacing}px</Label>
          <Slider
            value={[config.letterSpacing]}
            onValueChange={([value]) => updateConfig({ letterSpacing: value })}
            min={-2}
            max={8}
            step={0.1}
          />
        </div>

        {/* Text Align */}
        <div className="space-y-2">
          <Label>Text Align</Label>
          <Select value={config.textAlign} onValueChange={(value) => updateConfig({ textAlign: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {textAlignments.map((align) => (
                <SelectItem key={align.value} value={align.value}>
                  {align.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <Label>Text Transform</Label>
          <Select value={config.textTransform} onValueChange={(value) => updateConfig({ textTransform: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {textTransforms.map((transform) => (
                <SelectItem key={transform.value} value={transform.value}>
                  {transform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Decoration */}
        <div className="space-y-2">
          <Label>Text Decoration</Label>
          <Select value={config.decoration} onValueChange={(value) => updateConfig({ decoration: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {textDecorations.map((decoration) => (
                <SelectItem key={decoration.value} value={decoration.value}>
                  {decoration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white">
            <div
              style={{
                fontFamily: config.family,
                fontSize: `${config.size}px`,
                fontWeight: config.weight,
                color: config.color,
                lineHeight: config.lineHeight,
                letterSpacing: `${config.letterSpacing}px`,
                textAlign: config.textAlign as any,
                textTransform: config.textTransform as any,
                textDecoration: config.decoration
              }}
            >
              <h1>This is a heading example</h1>
              <p>This is a paragraph example with multiple lines of text to demonstrate how the typography settings affect readability and visual hierarchy. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p>Another paragraph to show consistency in styling across different text blocks.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSS</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(generateCSS())}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
              {generateCSS()}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tailwind Classes</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(generateTailwindClasses())}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
              {generateTailwindClasses()}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
