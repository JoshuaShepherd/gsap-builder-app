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
import { Copy, Home, Users, Settings, FileText, BarChart3, Mail, Calendar, Search, Plus, ChevronDown, Menu } from "lucide-react"

interface SidebarConfig {
  width: number
  position: "left" | "right"
  variant: "default" | "compact" | "floating"
  background: string
  hasHeader: boolean
  headerTitle: string
  hasFooter: boolean
  footerContent: string
  collapsible: boolean
  defaultCollapsed: boolean
  showIcons: boolean
  showLabels: boolean
  navigation: NavigationItem[]
}

interface NavigationItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: string
  children?: NavigationItem[]
}

interface SidebarBuilderProps {
  onConfigChange: (config: SidebarConfig) => void
}

const icons = [
  { value: "home", label: "Home", component: Home },
  { value: "users", label: "Users", component: Users },
  { value: "settings", label: "Settings", component: Settings },
  { value: "file-text", label: "Documents", component: FileText },
  { value: "bar-chart", label: "Analytics", component: BarChart3 },
  { value: "mail", label: "Mail", component: Mail },
  { value: "calendar", label: "Calendar", component: Calendar },
  { value: "search", label: "Search", component: Search }
]

const backgroundOptions = [
  { value: "white", label: "White", class: "bg-white" },
  { value: "gray-50", label: "Gray 50", class: "bg-gray-50" },
  { value: "gray-900", label: "Gray 900", class: "bg-gray-900 text-white" },
  { value: "blue-900", label: "Blue 900", class: "bg-blue-900 text-white" },
  { value: "slate-800", label: "Slate 800", class: "bg-slate-800 text-white" }
]

const variants = [
  { value: "default", label: "Default", description: "Standard sidebar with border" },
  { value: "compact", label: "Compact", description: "Minimal padding and spacing" },
  { value: "floating", label: "Floating", description: "Elevated sidebar with shadow" }
]

const defaultNavigation: NavigationItem[] = [
  { id: "1", label: "Dashboard", icon: "home", href: "/" },
  { id: "2", label: "Users", icon: "users", href: "/users", badge: "12" },
  { id: "3", label: "Documents", icon: "file-text", href: "/docs" },
  { id: "4", label: "Analytics", icon: "bar-chart", href: "/analytics" },
  { id: "5", label: "Settings", icon: "settings", href: "/settings" }
]

export function SidebarBuilder({ onConfigChange }: SidebarBuilderProps) {
  const [config, setConfig] = useState<SidebarConfig>({
    width: 240,
    position: "left",
    variant: "default",
    background: "white",
    hasHeader: true,
    headerTitle: "Navigation",
    hasFooter: true,
    footerContent: "© 2024 App Name",
    collapsible: true,
    defaultCollapsed: false,
    showIcons: true,
    showLabels: true,
    navigation: defaultNavigation
  })

  const [editingItem, setEditingItem] = useState<string | null>(null)

  const updateConfig = (updates: Partial<SidebarConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const getIconComponent = (iconName: string) => {
    const icon = icons.find(i => i.value === iconName)
    return icon ? icon.component : Home
  }

  const updateNavigationItem = (id: string, updates: Partial<NavigationItem>) => {
    const updatedNav = config.navigation.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    updateConfig({ navigation: updatedNav })
  }

  const addNavigationItem = () => {
    const newItem: NavigationItem = {
      id: Date.now().toString(),
      label: "New Item",
      icon: "home",
      href: "/new"
    }
    updateConfig({ navigation: [...config.navigation, newItem] })
  }

  const removeNavigationItem = (id: string) => {
    const updatedNav = config.navigation.filter(item => item.id !== id)
    updateConfig({ navigation: updatedNav })
  }

  const generateTailwindClasses = () => {
    const baseClasses = ["h-full", "flex", "flex-col"]
    
    // Width
    baseClasses.push(`w-[${config.width}px]`)
    
    // Background
    const bgOption = backgroundOptions.find(bg => bg.value === config.background)
    if (bgOption) {
      baseClasses.push(bgOption.class)
    }
    
    // Variant styling
    switch (config.variant) {
      case "default":
        baseClasses.push("border-r")
        break
      case "compact":
        baseClasses.push("border-r", "p-2")
        break
      case "floating":
        baseClasses.push("shadow-lg", "rounded-lg", "m-4")
        break
    }
    
    return baseClasses.join(" ")
  }

  const generateReactCode = () => {
    const IconComponents = config.navigation.map(item => {
      const iconName = icons.find(i => i.value === item.icon)?.label || "Home"
      return { ...item, iconComponent: iconName.replace(" ", "") }
    })

    let code = `<div className="${generateTailwindClasses()}">\n`
    
    if (config.hasHeader) {
      code += `  <div className="p-4 border-b">\n`
      code += `    <h2 className="text-lg font-semibold">${config.headerTitle}</h2>\n`
      code += `  </div>\n`
    }
    
    code += `  <nav className="flex-1 overflow-y-auto p-4">\n`
    code += `    <ul className="space-y-2">\n`
    
    IconComponents.forEach(item => {
      code += `      <li>\n`
      code += `        <a href="${item.href}" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100">\n`
      
      if (config.showIcons) {
        code += `          <${item.iconComponent} className="h-4 w-4" />\n`
      }
      
      if (config.showLabels) {
        code += `          <span>${item.label}</span>\n`
      }
      
      if (item.badge) {
        code += `          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">\n`
        code += `            ${item.badge}\n`
        code += `          </span>\n`
      }
      
      code += `        </a>\n`
      code += `      </li>\n`
    })
    
    code += `    </ul>\n`
    code += `  </nav>\n`
    
    if (config.hasFooter) {
      code += `  <div className="p-4 border-t text-xs text-gray-500">\n`
      code += `    ${config.footerContent}\n`
      code += `  </div>\n`
    }
    
    code += `</div>`
    
    return code
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Layout Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Layout</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Width */}
          <div className="space-y-2">
            <Label>Width: {config.width}px</Label>
            <Slider
              value={[config.width]}
              onValueChange={([value]) => updateConfig({ width: value })}
              min={200}
              max={400}
              step={10}
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={config.position} onValueChange={(value: any) => updateConfig({ position: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

      {/* Header/Footer Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Header & Footer</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasHeader"
                checked={config.hasHeader}
                onCheckedChange={(checked) => updateConfig({ hasHeader: checked })}
              />
              <Label htmlFor="hasHeader">Show Header</Label>
            </div>
            {config.hasHeader && (
              <Input
                value={config.headerTitle}
                onChange={(e) => updateConfig({ headerTitle: e.target.value })}
                placeholder="Header title"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasFooter"
                checked={config.hasFooter}
                onCheckedChange={(checked) => updateConfig({ hasFooter: checked })}
              />
              <Label htmlFor="hasFooter">Show Footer</Label>
            </div>
            {config.hasFooter && (
              <Input
                value={config.footerContent}
                onChange={(e) => updateConfig({ footerContent: e.target.value })}
                placeholder="Footer content"
              />
            )}
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Display Options</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="showIcons"
              checked={config.showIcons}
              onCheckedChange={(checked) => updateConfig({ showIcons: checked })}
            />
            <Label htmlFor="showIcons">Show Icons</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showLabels"
              checked={config.showLabels}
              onCheckedChange={(checked) => updateConfig({ showLabels: checked })}
            />
            <Label htmlFor="showLabels">Show Labels</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="collapsible"
              checked={config.collapsible}
              onCheckedChange={(checked) => updateConfig({ collapsible: checked })}
            />
            <Label htmlFor="collapsible">Collapsible</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="defaultCollapsed"
              checked={config.defaultCollapsed}
              onCheckedChange={(checked) => updateConfig({ defaultCollapsed: checked })}
              disabled={!config.collapsible}
            />
            <Label htmlFor="defaultCollapsed">Default Collapsed</Label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Navigation Items</h3>
          <Button onClick={addNavigationItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-3">
          {config.navigation.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateNavigationItem(item.id, { label: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Icon</Label>
                    <Select 
                      value={item.icon} 
                      onValueChange={(value) => updateNavigationItem(item.id, { icon: value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Href</Label>
                    <Input
                      value={item.href}
                      onChange={(e) => updateNavigationItem(item.id, { href: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Badge</Label>
                    <div className="flex gap-2">
                      <Input
                        value={item.badge || ""}
                        onChange={(e) => updateNavigationItem(item.id, { badge: e.target.value || undefined })}
                        placeholder="Optional"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNavigationItem(item.id)}
                        className="px-2"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gray-50 overflow-hidden">
            <div className="h-96 flex">
              <div 
                className={generateTailwindClasses()}
                style={{ width: `${config.width}px` }}
              >
                {config.hasHeader && (
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">{config.headerTitle}</h2>
                  </div>
                )}
                
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {config.navigation.map((item) => {
                      const IconComponent = getIconComponent(item.icon)
                      return (
                        <li key={item.id}>
                          <a 
                            href={item.href} 
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                          >
                            {config.showIcons && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            {config.showLabels && <span>{item.label}</span>}
                            {item.badge && (
                              <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
                
                {config.hasFooter && (
                  <div className="p-4 border-t text-xs text-gray-500">
                    {config.footerContent}
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-6 text-gray-400 flex items-center justify-center">
                Main content area
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
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto max-h-80">
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
