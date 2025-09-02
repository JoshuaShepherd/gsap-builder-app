"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Copy, Settings, User, Bell } from "lucide-react"

interface CardConfig {
  title: string
  description: string
  content: string
  hasHeader: boolean
  hasFooter: boolean
  footerContent: string
  padding: "none" | "sm" | "md" | "lg"
  shadow: "none" | "sm" | "md" | "lg" | "xl"
  border: "none" | "default" | "dashed"
  borderRadius: "none" | "sm" | "md" | "lg" | "xl"
  maxWidth: number
  background: string
}

interface CardBuilderProps {
  onConfigChange: (config: CardConfig) => void
}

const paddingOptions = [
  { value: "none", label: "None", class: "p-0" },
  { value: "sm", label: "Small", class: "p-2" },
  { value: "md", label: "Medium", class: "p-4" },
  { value: "lg", label: "Large", class: "p-6" }
]

const shadowOptions = [
  { value: "none", label: "None", class: "shadow-none" },
  { value: "sm", label: "Small", class: "shadow-sm" },
  { value: "md", label: "Medium", class: "shadow-md" },
  { value: "lg", label: "Large", class: "shadow-lg" },
  { value: "xl", label: "Extra Large", class: "shadow-xl" }
]

const borderOptions = [
  { value: "none", label: "None", class: "border-0" },
  { value: "default", label: "Solid", class: "border" },
  { value: "dashed", label: "Dashed", class: "border border-dashed" }
]

const radiusOptions = [
  { value: "none", label: "None", class: "rounded-none" },
  { value: "sm", label: "Small", class: "rounded-sm" },
  { value: "md", label: "Medium", class: "rounded-md" },
  { value: "lg", label: "Large", class: "rounded-lg" },
  { value: "xl", label: "Extra Large", class: "rounded-xl" }
]

const backgroundOptions = [
  { value: "white", label: "White", class: "bg-white" },
  { value: "gray-50", label: "Gray 50", class: "bg-gray-50" },
  { value: "blue-50", label: "Blue 50", class: "bg-blue-50" },
  { value: "green-50", label: "Green 50", class: "bg-green-50" },
  { value: "yellow-50", label: "Yellow 50", class: "bg-yellow-50" },
  { value: "red-50", label: "Red 50", class: "bg-red-50" }
]

export function CardBuilder({ onConfigChange }: CardBuilderProps) {
  const [config, setConfig] = useState<CardConfig>({
    title: "Card Title",
    description: "Card description goes here",
    content: "This is the main content of the card. You can put any content here including text, images, or other components.",
    hasHeader: true,
    hasFooter: true,
    footerContent: "Footer content or actions",
    padding: "md",
    shadow: "md",
    border: "default",
    borderRadius: "lg",
    maxWidth: 400,
    background: "white"
  })

  const updateConfig = (updates: Partial<CardConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const generateTailwindClasses = () => {
    const classes = [
      "rounded-lg", 
      "border", 
      "bg-card", 
      "text-card-foreground", 
      "shadow-sm"
    ]

    // Override with custom settings
    const shadowClass = shadowOptions.find(s => s.value === config.shadow)?.class
    const borderClass = borderOptions.find(b => b.value === config.border)?.class
    const radiusClass = radiusOptions.find(r => r.value === config.borderRadius)?.class
    const backgroundClass = backgroundOptions.find(bg => bg.value === config.background)?.class

    // Replace defaults with custom settings
    if (shadowClass) {
      classes[4] = shadowClass
    }
    if (borderClass) {
      classes[1] = borderClass
    }
    if (radiusClass) {
      classes[0] = radiusClass
    }
    if (backgroundClass) {
      classes[2] = backgroundClass
    }

    if (config.maxWidth !== 400) {
      classes.push(`max-w-[${config.maxWidth}px]`)
    }

    return classes.join(" ")
  }

  const generateReactCode = () => {
    let code = `<Card className="${generateTailwindClasses()}">\n`
    
    if (config.hasHeader) {
      code += `  <CardHeader>\n`
      code += `    <CardTitle>${config.title}</CardTitle>\n`
      if (config.description) {
        code += `    <CardDescription>\n      ${config.description}\n    </CardDescription>\n`
      }
      code += `  </CardHeader>\n`
    }
    
    code += `  <CardContent>\n`
    code += `    ${config.content}\n`
    code += `  </CardContent>\n`
    
    if (config.hasFooter) {
      code += `  <CardFooter>\n`
      code += `    ${config.footerContent}\n`
      code += `  </CardFooter>\n`
    }
    
    code += `</Card>`
    
    return code
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Content Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Card Title</Label>
            <Input
              value={config.title}
              onChange={(e) => updateConfig({ title: e.target.value })}
              placeholder="Enter card title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={config.description}
              onChange={(e) => updateConfig({ description: e.target.value })}
              placeholder="Enter card description"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea
            value={config.content}
            onChange={(e) => updateConfig({ content: e.target.value })}
            placeholder="Enter card content"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Footer Content</Label>
          <Input
            value={config.footerContent}
            onChange={(e) => updateConfig({ footerContent: e.target.value })}
            placeholder="Enter footer content"
            disabled={!config.hasFooter}
          />
        </div>
      </div>

      <Separator />

      {/* Layout Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Layout</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hasHeader"
              checked={config.hasHeader}
              onCheckedChange={(checked) => updateConfig({ hasHeader: checked })}
            />
            <Label htmlFor="hasHeader">Show Header</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasFooter"
              checked={config.hasFooter}
              onCheckedChange={(checked) => updateConfig({ hasFooter: checked })}
            />
            <Label htmlFor="hasFooter">Show Footer</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Max Width */}
          <div className="space-y-2">
            <Label>Max Width: {config.maxWidth}px</Label>
            <Slider
              value={[config.maxWidth]}
              onValueChange={([value]) => updateConfig({ maxWidth: value })}
              min={200}
              max={800}
              step={10}
            />
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <Label>Padding</Label>
            <Select value={config.padding} onValueChange={(value: any) => updateConfig({ padding: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {paddingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background */}
          <div className="space-y-2">
            <Label>Background</Label>
            <Select value={config.background} onValueChange={(value) => updateConfig({ background: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {backgroundOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.class}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Styling Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Styling</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Shadow */}
          <div className="space-y-2">
            <Label>Shadow</Label>
            <Select value={config.shadow} onValueChange={(value: any) => updateConfig({ shadow: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {shadowOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Border */}
          <div className="space-y-2">
            <Label>Border</Label>
            <Select value={config.border} onValueChange={(value: any) => updateConfig({ border: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {borderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <Label>Border Radius</Label>
            <Select value={config.borderRadius} onValueChange={(value: any) => updateConfig({ borderRadius: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {radiusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex justify-center">
              <Card 
                className={generateTailwindClasses()}
                style={{ maxWidth: `${config.maxWidth}px` }}
              >
                {config.hasHeader && (
                  <CardHeader>
                    <CardTitle>{config.title}</CardTitle>
                    {config.description && (
                      <CardDescription>{config.description}</CardDescription>
                    )}
                  </CardHeader>
                )}
                
                <CardContent>
                  <p>{config.content}</p>
                </CardContent>
                
                {config.hasFooter && (
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">{config.footerContent}</p>
                  </CardFooter>
                )}
              </Card>
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

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Example Variations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Simple Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Simple Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs">Basic card with minimal styling</p>
              </CardContent>
            </Card>

            {/* Feature Card */}
            <Card className="shadow-md border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Feature Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs">Enhanced card with icon and color</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">Learn More</Button>
              </CardFooter>
            </Card>

            {/* Profile Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Card
                </CardTitle>
                <CardDescription className="text-xs">
                  User information display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs">Rich card with multiple sections</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm">View</Button>
                <Button size="sm" variant="outline">Edit</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
