# Simple Language Mode - Technical Deep Dive

## Feature Overview

**Simple Language Mode** is a user accessibility feature that translates technical ESG/AI terminology into plain, non-technical language. This makes the platform accessible to executives, stakeholders, and non-technical users who need to understand sustainability metrics without deep technical knowledge.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                                                                  │
│  ┌──────────────┐                              ┌──────────────┐ │
│  │   Header     │                              │  Dashboard   │ │
│  │   Toggle     │◄────────────────────────────►│   Content    │ │
│  │   Button     │    Language Context          │   (t() calls)│ │
│  └──────────────┘                              └──────────────┘ │
└────────────┬─────────────────────────────────────────┬──────────┘
             │                                         │
             │                                         │
             ▼                                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    LANGUAGE CONTEXT PROVIDER                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  State Management (React Context API)                    │ │
│  │  - isSimpleMode: boolean                                 │ │
│  │  - translations: Map<string, string>                     │ │
│  │  - t(term): string function                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Translation Dictionary (100+ terms)                     │ │
│  │  {                                                        │ │
│  │    "ESG": "Sustainability Score",                        │ │
│  │    "GPU": "AI Power Chip",                               │ │
│  │    "kWh": "Energy Units",                                │ │
│  │    ...                                                    │ │
│  │  }                                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│                    BROWSER LOCAL STORAGE                        │
│                                                                 │
│  Key: "simpleLanguageMode"                                     │
│  Value: "true" | "false"                                       │
│  Purpose: Persist user preference across sessions              │
└────────────────────────────────────────────────────────────────┘
```

---

## Frontend Implementation

### 1. Language Context Provider

**File**: `frontend-new/lib/language-context.tsx`

**Purpose**: Central state management for language mode using React Context API

**Code Structure**:

```typescript
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

// Define the shape of our context
interface LanguageContextType {
  isSimpleMode: boolean           // Current mode state
  toggleLanguageMode: () => void  // Function to toggle mode
  t: (term: string) => string     // Translation function
}

// Create context with undefined default
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary - 100+ terms
const translations: Record<string, string> = {
  // Core ESG Terms
  "ESG": "Sustainability Score",
  "CO₂": "Carbon Pollution",
  "Carbon Footprint": "Pollution Impact",
  "Emissions": "Pollution Released",
  
  // Technical AI Terms
  "GPU": "AI Power Chip",
  "Inference": "AI Prediction",
  "Training": "AI Learning",
  "Workload": "AI Task",
  "Model": "AI System",
  
  // Energy Terms
  "kWh": "Energy Units",
  "Energy Consumption": "Power Used",
  "Carbon Intensity": "Pollution Level",
  
  // Business Terms
  "Optimization": "Improvement",
  "Governance": "Approval Process",
  "Compliance": "Following Rules",
  
  // ... 90+ more terms
}

// Provider Component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // State: false = Technical Mode, true = Simple Mode
  const [isSimpleMode, setIsSimpleMode] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('simpleLanguageMode')
    if (saved === 'true') {
      setIsSimpleMode(true)
    }
  }, [])

  // Toggle function with localStorage persistence
  const toggleLanguageMode = () => {
    setIsSimpleMode(prev => {
      const newValue = !prev
      localStorage.setItem('simpleLanguageMode', String(newValue))
      return newValue
    })
  }

  // Translation function
  const t = (term: string): string => {
    if (!isSimpleMode) {
      return term  // Return original term in Technical Mode
    }
    return translations[term] || term  // Return translation or fallback to original
  }

  // Provide context to children
  return (
    <LanguageContext.Provider value={{ isSimpleMode, toggleLanguageMode, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook for consuming context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
```

**Key Concepts**:

1. **React Context API**: Provides global state without prop drilling
2. **localStorage**: Persists user preference across browser sessions
3. **Custom Hook**: `useLanguage()` provides clean API for components
4. **Translation Dictionary**: Simple key-value mapping for terms

---

### 2. Root Layout Integration

**File**: `frontend-new/app/layout.tsx`

**Purpose**: Wrap entire app with LanguageProvider to make context available everywhere

```typescript
import { LanguageProvider } from '@/lib/language-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
```

**Why This Works**:
- Provider wraps all pages and components
- Any component can access language context
- State changes trigger re-renders throughout app

---

### 3. Header Toggle Button

**File**: `frontend-new/components/dashboard/header.tsx`

**Purpose**: UI control for toggling language mode

```typescript
import { useLanguage } from '@/lib/language-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Languages } from 'lucide-react'

export function Header({ title }: { title: string }) {
  const { isSimpleMode, toggleLanguageMode } = useLanguage()

  return (
    <header className="flex items-center justify-between p-4">
      <h1>{title}</h1>
      
      {/* Language Mode Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguageMode}
        className="flex items-center gap-2"
      >
        <Languages className="h-4 w-4" />
        Simple Language Mode
        <Badge variant={isSimpleMode ? "default" : "secondary"}>
          {isSimpleMode ? "ON" : "OFF"}
        </Badge>
      </Button>
    </header>
  )
}
```

**User Interaction Flow**:
1. User clicks toggle button
2. `toggleLanguageMode()` is called
3. State updates: `isSimpleMode` flips
4. localStorage saves new preference
5. All components using `t()` re-render with new translations

---

### 4. Using Translations in Components

**Example**: Dashboard Page

**File**: `frontend-new/app/dashboard/page.tsx`

```typescript
import { useLanguage } from '@/lib/language-context'

export default function DashboardPage() {
  const { t } = useLanguage()  // Get translation function

  return (
    <div>
      {/* Page Title */}
      <h1>{t("ESG")} Overview</h1>
      {/* Technical Mode: "ESG Overview" */}
      {/* Simple Mode: "Sustainability Score Overview" */}

      {/* KPI Cards */}
      <KPICard
        title={t("Active") + " " + t("AI") + " " + t("Workloads")}
        {/* Technical: "Active AI Workloads" */}
        {/* Simple: "Active AI Tasks" */}
        value="39"
      />

      <KPICard
        title={t("Energy Consumption")}
        {/* Technical: "Energy Consumption" */}
        {/* Simple: "Power Used" */}
        value="0.5 kWh"
        subtitle={t("kWh")}
        {/* Technical: "kWh" */}
        {/* Simple: "Energy Units" */}
      />

      <KPICard
        title={t("CO₂ Emissions")}
        {/* Technical: "CO₂ Emissions" */}
        {/* Simple: "Carbon Pollution" */}
        value="210 kg"
      />

      {/* Chart Titles */}
      <h2>{t("Energy")} by {t("AI")} {t("Model")}</h2>
      {/* Technical: "Energy by AI Model" */}
      {/* Simple: "Power Used by AI System" */}

      <h2>{t("Carbon Footprint")} by Region</h2>
      {/* Technical: "Carbon Footprint by Region" */}
      {/* Simple: "Pollution Impact by Region" */}
    </div>
  )
}
```

**How It Works**:
1. Component calls `useLanguage()` hook
2. Extracts `t` function from context
3. Wraps all technical terms with `t()`
4. When mode changes, component re-renders
5. `t()` returns appropriate translation based on `isSimpleMode`

---

## Internal Working - Step by Step

### Scenario: User Toggles Language Mode

**Step 1: Initial State**
```
isSimpleMode = false (Technical Mode)
localStorage = null or "false"
UI shows: "ESG Overview", "GPU", "kWh"
```

**Step 2: User Clicks Toggle Button**
```javascript
// User clicks button in Header
onClick={toggleLanguageMode}

// Function executes
const toggleLanguageMode = () => {
  setIsSimpleMode(prev => {
    const newValue = !prev  // false → true
    localStorage.setItem('simpleLanguageMode', 'true')
    return newValue
  })
}
```

**Step 3: State Update Propagates**
```
React Context updates: isSimpleMode = true
All components subscribed to context receive update
Components using useLanguage() re-render
```

**Step 4: Translation Function Behavior Changes**
```javascript
// Before toggle
t("ESG") → "ESG" (isSimpleMode = false)

// After toggle
t("ESG") → "Sustainability Score" (isSimpleMode = true)

// Translation logic
const t = (term: string): string => {
  if (!isSimpleMode) return term
  return translations[term] || term
}
```

**Step 5: UI Updates**
```
All text wrapped in t() updates instantly:
- "ESG Overview" → "Sustainability Score Overview"
- "GPU" → "AI Power Chip"
- "kWh" → "Energy Units"
- "Inference" → "AI Prediction"
```

**Step 6: Persistence**
```
localStorage.setItem('simpleLanguageMode', 'true')
Preference saved for next session
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTION                               │
│                  Clicks Toggle Button                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TOGGLE FUNCTION EXECUTES                       │
│                                                                  │
│  toggleLanguageMode() {                                         │
│    setIsSimpleMode(!isSimpleMode)  // State update             │
│    localStorage.setItem(...)        // Persist                  │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT CONTEXT UPDATE                          │
│                                                                  │
│  Context value changes:                                         │
│  { isSimpleMode: true, toggleLanguageMode, t }                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  COMPONENT RE-RENDERS                            │
│                                                                  │
│  All components using useLanguage() detect change               │
│  React triggers re-render of affected components                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              TRANSLATION FUNCTION EXECUTES                       │
│                                                                  │
│  For each t() call in components:                               │
│  - Check isSimpleMode                                           │
│  - If true: lookup in translations dictionary                   │
│  - If false: return original term                               │
│  - Return result to component                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UI UPDATES                                  │
│                                                                  │
│  Browser DOM updates with new text:                             │
│  - "ESG" → "Sustainability Score"                               │
│  - "GPU" → "AI Power Chip"                                      │
│  - User sees translated interface                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### 1. Memoization
```typescript
// Prevent unnecessary re-renders
const contextValue = useMemo(
  () => ({ isSimpleMode, toggleLanguageMode, t }),
  [isSimpleMode]
)
```

### 2. Lazy Loading
```typescript
// Load translations only when needed
const translations = lazy(() => import('./translations'))
```

### 3. Caching
```typescript
// Cache translation results
const translationCache = new Map<string, string>()

const t = (term: string): string => {
  const cacheKey = `${isSimpleMode}-${term}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }
  
  const result = isSimpleMode ? (translations[term] || term) : term
  translationCache.set(cacheKey, result)
  return result
}
```

---

## Translation Dictionary Structure

### Categories

**1. ESG & Sustainability (20 terms)**
```typescript
{
  "ESG": "Sustainability Score",
  "Carbon Footprint": "Pollution Impact",
  "CO₂": "Carbon Pollution",
  "Emissions": "Pollution Released",
  "Carbon Intensity": "Pollution Level",
  "Offset": "Balance Out",
  "Net Zero": "Zero Pollution",
  "Renewable Energy": "Clean Power",
  "Baseline": "Starting Point",
  "Reduction": "Decrease",
  // ... more
}
```

**2. AI & Technical Terms (25 terms)**
```typescript
{
  "GPU": "AI Power Chip",
  "Inference": "AI Prediction",
  "Training": "AI Learning",
  "Model": "AI System",
  "Workload": "AI Task",
  "Algorithm": "AI Recipe",
  "Neural Network": "AI Brain",
  "Machine Learning": "AI Learning",
  "Deep Learning": "Advanced AI",
  "Transformer": "AI Architecture",
  // ... more
}
```

**3. Energy & Metrics (20 terms)**
```typescript
{
  "kWh": "Energy Units",
  "Energy Consumption": "Power Used",
  "Power": "Electricity",
  "Watt": "Power Unit",
  "Kilowatt": "1000 Watts",
  "Efficiency": "How Well It Works",
  "Utilization": "Usage Rate",
  "Throughput": "Work Speed",
  "Latency": "Delay Time",
  "Runtime": "Running Time",
  // ... more
}
```

**4. Business & Operations (20 terms)**
```typescript
{
  "Optimization": "Improvement",
  "Governance": "Approval Process",
  "Compliance": "Following Rules",
  "Audit": "Official Check",
  "Policy": "Rule",
  "Threshold": "Limit",
  "Metric": "Measurement",
  "KPI": "Key Number",
  "Dashboard": "Control Panel",
  "Analytics": "Data Analysis",
  // ... more
}
```

**5. Cloud & Infrastructure (15 terms)**
```typescript
{
  "Region": "Location",
  "Data Center": "Computer Building",
  "Cloud": "Internet Computers",
  "Server": "Computer",
  "Instance": "Virtual Computer",
  "Deployment": "Launch",
  "Scaling": "Growing",
  "Load Balancing": "Work Distribution",
  "Redundancy": "Backup",
  "Failover": "Backup Switch",
  // ... more
}
```

---

## Edge Cases & Error Handling

### 1. Missing Translation
```typescript
const t = (term: string): string => {
  if (!isSimpleMode) return term
  
  // Fallback to original if translation not found
  return translations[term] || term
}

// Example:
t("NewTerm")  // Returns "NewTerm" if not in dictionary
```

### 2. Nested Translations
```typescript
// Combine multiple translations
const title = `${t("Active")} ${t("AI")} ${t("Workloads")}`
// Technical: "Active AI Workloads"
// Simple: "Active AI Tasks"
```

### 3. Partial Translations
```typescript
// Some terms stay technical even in Simple Mode
const mixed = `${t("GPU")} Temperature: 75°C`
// Simple: "AI Power Chip Temperature: 75°C"
// "Temperature" and "75°C" remain unchanged
```

### 4. Context Provider Not Found
```typescript
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
```

---

## Browser Compatibility

### localStorage Support
```typescript
// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// Fallback to sessionStorage or memory
const storage = isLocalStorageAvailable() 
  ? localStorage 
  : sessionStorage
```

---

## Testing Strategy

### 1. Unit Tests
```typescript
describe('Language Context', () => {
  it('should translate terms in simple mode', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider
    })
    
    act(() => {
      result.current.toggleLanguageMode()
    })
    
    expect(result.current.t('ESG')).toBe('Sustainability Score')
  })
  
  it('should return original term in technical mode', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider
    })
    
    expect(result.current.t('ESG')).toBe('ESG')
  })
})
```

### 2. Integration Tests
```typescript
describe('Dashboard with Language Mode', () => {
  it('should update all text when toggling mode', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('ESG Overview')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Simple Language Mode'))
    
    expect(screen.getByText('Sustainability Score Overview')).toBeInTheDocument()
  })
})
```

---

## Future Enhancements

### 1. Multiple Languages
```typescript
const translations = {
  en: { /* English */ },
  es: { /* Spanish */ },
  fr: { /* French */ }
}

const t = (term: string, lang: string = 'en'): string => {
  return translations[lang][term] || term
}
```

### 2. User-Defined Translations
```typescript
// Allow users to customize translations
const customTranslations = {
  ...defaultTranslations,
  ...userTranslations
}
```

### 3. Context-Aware Translations
```typescript
// Different translations based on context
const t = (term: string, context?: string): string => {
  const key = context ? `${term}_${context}` : term
  return translations[key] || translations[term] || term
}

// Usage
t("Model", "ai")  // "AI System"
t("Model", "business")  // "Business Model"
```

---

## Summary

**Simple Language Mode** is a client-side feature that:

1. **Uses React Context API** for global state management
2. **Persists preferences** in browser localStorage
3. **Provides translation function** `t()` to all components
4. **Updates UI instantly** when mode changes
5. **Requires no backend** - purely frontend implementation
6. **Maintains 100+ translations** in a simple dictionary
7. **Handles edge cases** with fallbacks
8. **Optimized for performance** with memoization

The feature makes the platform accessible to non-technical users while maintaining technical accuracy for expert users, supporting the platform's goal of being enterprise-ready and user-friendly.
