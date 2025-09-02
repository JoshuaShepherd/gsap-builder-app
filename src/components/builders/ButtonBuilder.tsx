"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, Search, ArrowRight, Plus, Settings, Heart, Star } from "lucide-react"

interface ButtonConfig {
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size: "default" | "sm" | "lg" | "icon"
  text: string
  icon?: string
  iconPosition: "left" | "right" | "only"
  disabled: boolean
  loading: boolean
  fullWidth: boolean
  rounded: "none" | "sm" | "md" | "lg" | "full"
  customPadding: { x: number; y: number }
}

interface ButtonBuilderProps {
  onConfigChange: (config: ButtonConfig) => void
}

const variants = [
  { value: "default", label: "Default", description: "Primary button with solid background" },
  { value: "destructive", label: "Destructive", description: "Red button for dangerous actions" },
  { value: "outline", label: "Outline", description: "Button with border and transparent background" },
  { value: "secondary", label: "Secondary", description: "Secondary button with muted background" },
  { value: "ghost", label: "Ghost", description: "Transparent button with hover effect" },
  { value: "link", label: "Link", description: "Text-only button styled as link" }
]

const sizes = [
  { value: "sm", label: "Small", description: "Compact button for tight spaces" },
  { value: "default", label: "Default", description: "Standard button size" },
  { value: "lg", label: "Large", description: "Larger button for emphasis" },
  { value: "icon", label: "Icon", description: "Square button for icons only" }
]

const icons = [
  { value: "search", label: "Search", component: Search },
  { value: "arrow-right", label: "Arrow Right", component: ArrowRight },
  { value: "plus", label: "Plus", component: Plus },
  { value: "settings", label: "Settings", component: Settings },
  { value: "heart", label: "Heart", component: Heart },
  { value: "star", label: "Star", component: Star },
  { value: "download", label: "Download", component: Download },
  { value: "copy", label: "Copy", component: Copy }
]

const iconPositions = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "only", label: "Icon Only" }
]

const roundedOptions = [
  { value: "none", label: "None", class: "rounded-none" },
  { value: "sm", label: "Small", class: "rounded-sm" },
  { value: "md", label: "Medium", class: "rounded-md" },
  { value: "lg", label: "Large", class: "rounded-lg" },
  { value: "full", label: "Full", class: "rounded-full" }
]

export function ButtonBuilder({ onConfigChange }: ButtonBuilderProps) {
  const [config, setConfig] = useState<ButtonConfig>({
    variant: "default",
    size: "default",
    text: "Button Text",
    icon: undefined,
    iconPosition: "left",
    disabled: false,
    loading: false,
    fullWidth: false,
    rounded: "md",
    customPadding: { x: 16, y: 8 }
  })

  const updateConfig = (updates: Partial<ButtonConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return null
    const icon = icons.find(i => i.value === iconName)
    return icon ? icon.component : null
  }

  const generateTailwindClasses = () => {
    const baseClasses = ["inline-flex", "items-center", "justify-center"]
    
    // Variant classes
    const variantClasses: { [key: string]: string[] } = {
      default: ["bg-primary", "text-primary-foreground", "hover:bg-primary/90"],
      destructive: ["bg-destructive", "text-destructive-foreground", "hover:bg-destructive/90"],
      outline: ["border", "border-input", "bg-background", "hover:bg-accent", "hover:text-accent-foreground"],
      secondary: ["bg-secondary", "text-secondary-foreground", "hover:bg-secondary/80"],
      ghost: ["hover:bg-accent", "hover:text-accent-foreground"],
      link: ["text-primary", "underline-offset-4", "hover:underline"]
    }

    // Size classes
    const sizeClasses: { [key: string]: string[] } = {
      default: ["h-10", "px-4", "py-2"],
      sm: ["h-9", "rounded-md", "px-3"],
      lg: ["h-11", "rounded-md", "px-8"],
      icon: ["h-10", "w-10"]
    }

    const classes = [
      ...baseClasses,
      ...variantClasses[config.variant],
      ...sizeClasses[config.size],
      roundedOptions.find(r => r.value === config.rounded)?.class || "rounded-md"
    ]

    if (config.disabled) {
      classes.push("pointer-events-none", "opacity-50")
    }

    if (config.fullWidth) {
      classes.push("w-full")
    }

    return classes.join(" ")
  }

  const generateReactCode = () => {
    const IconComponent = getIconComponent(config.icon)
    const iconName = config.icon ? icons.find(i => i.value === config.icon)?.label : ""
    
    let iconElement = ""
    if (IconComponent && config.icon && iconName) {
      iconElement = `<${iconName.replace(" ", "")} className="h-4 w-4" />`
    }

    let buttonContent = ""
    if (config.iconPosition === "only" && iconElement) {
      buttonContent = iconElement
    } else if (config.iconPosition === "left" && iconElement) {
      buttonContent = `${iconElement}\n  ${config.text}`
    } else if (config.iconPosition === "right" && iconElement) {
      buttonContent = `${config.text}\n  ${iconElement}`
    } else {
      buttonContent = config.text
    }

    return `<Button
  variant="${config.variant}"
  size="${config.size}"${config.disabled ? '\n  disabled' : ''}${config.fullWidth ? '\n  className="w-full"' : ''}
>
  ${buttonContent}
</Button>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const IconComponent = getIconComponent(config.icon)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Variant */}
        <div className="space-y-2">
          <Label>Variant</Label>
          <Select value={config.variant} onValueChange={(value: any) => updateConfig({ variant: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {variants.map((variant) => (
                <SelectItem key={variant.value} value={variant.value}>
                  <div>
                    <div className="font-medium">{variant.label}</div>
                    <div className="text-xs text-muted-foreground">{variant.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label>Size</Label>
          <Select value={config.size} onValueChange={(value: any) => updateConfig({ size: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {sizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  <div>
                    <div className="font-medium">{size.label}</div>
                    <div className="text-xs text-muted-foreground">{size.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Button Text */}
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={config.text}
            onChange={(e) => updateConfig({ text: e.target.value })}
            placeholder="Enter button text"
          />
        </div>

        {/* Icon */}
        <div className="space-y-2">
          <Label>Icon</Label>
          <Select value={config.icon || "none"} onValueChange={(value) => updateConfig({ icon: value === "none" ? undefined : value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="none">No Icon</SelectItem>
              {icons.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  <div className="flex items-center gap-2">
                    <icon.component className="h-4 w-4" />
                    {icon.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Icon Position */}
        {config.icon && (
          <div className="space-y-2">
            <Label>Icon Position</Label>
            <Select value={config.iconPosition} onValueChange={(value: any) => updateConfig({ iconPosition: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {iconPositions.map((position) => (
                  <SelectItem key={position.value} value={position.value}>
                    {position.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Rounded */}
        <div className="space-y-2">
          <Label>Rounded Corners</Label>
          <Select value={config.rounded} onValueChange={(value: any) => updateConfig({ rounded: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {roundedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="disabled"
            checked={config.disabled}
            onCheckedChange={(checked) => updateConfig({ disabled: checked })}
          />
          <Label htmlFor="disabled">Disabled</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="loading"
            checked={config.loading}
            onCheckedChange={(checked) => updateConfig({ loading: checked })}
          />
          <Label htmlFor="loading">Loading</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="fullWidth"
            checked={config.fullWidth}
            onCheckedChange={(checked) => updateConfig({ fullWidth: checked })}
          />
          <Label htmlFor="fullWidth">Full Width</Label>
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
            <div className="flex flex-col gap-4">
              {/* Button Preview */}
              <div className={config.fullWidth ? "w-full" : "w-fit"}>
                <Button
                  variant={config.variant}
                  size={config.size}
                  disabled={config.disabled}
                  className={config.fullWidth ? "w-full" : ""}
                >
                  {config.iconPosition === "left" && IconComponent && (
                    <IconComponent className="h-4 w-4 mr-2" />
                  )}
                  {config.iconPosition !== "only" && config.text}
                  {config.iconPosition === "right" && IconComponent && (
                    <IconComponent className="h-4 w-4 ml-2" />
                  )}
                  {config.iconPosition === "only" && IconComponent && (
                    <IconComponent className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Button States */}
              <div className="flex flex-wrap gap-2">
                <Button variant={config.variant} size={config.size}>
                  Normal
                </Button>
                <Button variant={config.variant} size={config.size} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">React/ShadCN</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(generateReactCode())}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
              {generateReactCode()}
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
