# AI Studio Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Modern AI Creative Tools)

Drawing inspiration from leading AI and creative platforms:
- **Midjourney/DALL-E**: Visual-first presentation, gallery-style history
- **Linear**: Clean typography, minimal UI, excellent spacing
- **Figma**: Intuitive workspace layouts, clear tool organization
- **Vercel**: Modern gradients, sophisticated use of space

**Core Principles:**
1. Visual-first experience showcasing generated images prominently
2. Clean, uncluttered interface that doesn't compete with user creations
3. Efficient workflows with clear visual hierarchy
4. Professional yet approachable aesthetic for creative users

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts) - clean, modern, excellent readability
- Monospace: JetBrains Mono - for technical elements (tokens, IDs)

**Type Scale:**
- Hero/Display: text-5xl to text-6xl, font-bold (60-72px)
- Section Headers: text-3xl to text-4xl, font-semibold (36-48px)
- Component Headers: text-xl to text-2xl, font-semibold (24-30px)
- Body Large: text-lg, font-normal (18px)
- Body: text-base, font-normal (16px)
- Small/Meta: text-sm, font-medium (14px)
- Captions: text-xs, font-normal (12px)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: gap-2, p-2 (component internals)
- Standard spacing: gap-4, p-4, m-4 (most UI elements)
- Section spacing: gap-8, py-8 (between major sections)
- Large gaps: gap-12, py-16, py-24 (page sections, hero padding)

**Grid Systems:**
- Main workspace: 2-column layout (generation area + history sidebar) on desktop
- History grid: 2-3 column thumbnail grid
- Auth pages: Single centered column with max-w-md
- Landing: Full-width sections with max-w-6xl containers

**Breakpoints Strategy:**
- Mobile (base): Single column, stacked layouts
- Tablet (md:): 2-column grids where appropriate
- Desktop (lg:): Full layouts with sidebars, 3-column grids

---

## Component Library

### Navigation & Headers

**App Header:**
- Fixed top navigation with height h-16
- Logo/brand on left, user menu on right
- Subtle bottom border for definition
- Padding px-6 for consistent edge spacing

**Auth Navigation:**
- Minimal header with logo only
- Center-aligned for focus on auth forms

### Forms & Inputs

**Input Fields:**
- Height h-12 for comfortable touch targets
- Rounded corners rounded-lg
- Padding px-4 py-3
- Focus rings with ring-2 ring-offset-2
- Label above input with mb-2 spacing
- Error messages below with text-sm

**Buttons:**
- Primary: Large CTA buttons with px-8 py-3, rounded-lg, font-semibold
- Secondary: Outlined style with border-2
- Icon buttons: Square p-3, rounded-lg
- All buttons: Transition duration-200 for smooth interactions

**File Upload Zone:**
- Large drop area min-h-64
- Dashed border border-2 border-dashed
- Icon + instructional text centered
- Padding p-8
- Hover state with subtle scale transform

### Content Display

**Generation Workspace:**
- Large central canvas area for image preview
- Aspect ratio container aspect-video or aspect-square
- Rounded corners rounded-xl
- Overflow hidden for clean edges

**Generation Cards (History):**
- Thumbnail aspect-square with object-cover
- Card padding p-4
- Rounded rounded-lg
- Hover effect with scale-105 transform
- Metadata: timestamp, prompt preview (truncated)
- Stack: thumbnail, prompt text, timestamp below

**Status Indicators:**
- Loading spinner: Centered with animate-spin
- Error banner: Full-width with rounded corners, p-4
- Success states: Check icon with confirmation text
- Progress bar: h-2, rounded-full, animated width transition

### Modal & Overlays

**Modal Dialog:**
- Backdrop with backdrop-blur-sm
- Content max-w-2xl centered
- Padding p-6 to p-8
- Close button top-right with p-2

**Error Modal:**
- Icon at top (warning symbol)
- Clear heading text-xl font-semibold
- Body text with helpful message
- Retry button prominent at bottom

### Specialized Components

**Style Selector:**
- Grid of style cards grid-cols-2 md:grid-cols-4
- Each card: rounded-lg, p-4, cursor-pointer
- Selected state with border-2 highlight
- Style name + small preview/icon

**Generation History Sidebar:**
- Fixed or sticky positioning on desktop
- Width w-80 to w-96
- Scrollable overflow-y-auto
- Header "Recent Generations" with count
- Grid gap-4 between cards

**Prompt Input:**
- Textarea with min-h-32
- Rounded rounded-lg
- Padding p-4
- Placeholder text with helpful example
- Character count indicator bottom-right

---

## Page Layouts

### Landing Page (Unauthenticated)

**Hero Section:**
- Full-width with py-24 to py-32
- Large heading showcasing app value
- Subheading with clear benefit statement
- Primary CTA button (Sign Up) + Secondary (Learn More)
- Background: Subtle gradient or large hero image showcasing example generations

**Features Section:**
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Feature cards with icon, title, description
- Icons size w-12 h-12
- Padding py-20

**Gallery/Examples Section:**
- Masonry grid or 2-3 column grid of example generations
- Showcase the app's capabilities
- Each image with caption overlay on hover

**CTA Section:**
- Centered content with max-w-2xl
- Strong headline + supporting text
- Large sign-up button
- Padding py-24

**Footer:**
- Links organized in columns
- Social icons
- Copyright notice
- Padding py-12

### Authentication Pages

**Login/Signup Forms:**
- Centered card max-w-md
- Padding p-8
- Heading text-3xl mb-8
- Form fields stacked with gap-6
- Submit button full-width
- Toggle link to opposite form centered below
- Minimal surrounding layout for focus

### Main Application Interface

**Workspace Layout:**
- Two-column grid on desktop: 70% workspace, 30% history
- Single column stacked on mobile
- Header fixed at top
- Generation area: Large preview, controls below
- Controls row: Upload button, prompt input, style selector, generate button

**Generation Area:**
- Large image display area min-h-96
- Placeholder state with dashed border and icon
- Loading state with spinner + progress text
- Result state showing full-quality image
- Abort button visible during generation (top-right overlay)

**History Sidebar:**
- Header with "History" title and "Last 5 Generations"
- Scrollable list with gap-4
- Each history item clickable
- Hover state with subtle lift effect
- Empty state with helpful message

---

## Images

**Hero Image:**
- Yes, include a large hero background image
- Showcase 2-3 example AI-generated images in an artistic arrangement
- Subtle overlay gradient for text readability
- Image should span full viewport width

**Example Locations:**
- Landing hero: AI-generated artwork showcase
- Features section: Icon illustrations (use icon library like Heroicons)
- Gallery section: 6-8 example generated images in grid
- Empty states: Illustration for "no generations yet" state
- Workspace placeholder: Upload icon/illustration

**Image Treatment:**
- All generated images: rounded-xl corners
- Thumbnails: object-cover with aspect-square
- Full previews: object-contain to preserve aspect ratio

---

## Animations

**Minimal, Purposeful Motion:**
- Button hover: subtle scale-105 + shadow increase (duration-200)
- Card hover: scale-102 (duration-150)
- Modal entry/exit: fade + slight scale (duration-300)
- Loading spinner: rotate animation
- Page transitions: simple fade (duration-200)

**No Excessive Animation:**
- Avoid parallax effects
- No scroll-triggered animations
- No complex keyframe animations
- Keep interactions snappy and responsive

---

## Accessibility

- All interactive elements minimum h-11 (44px touch target)
- Focus states with visible ring-2 outline
- ARIA labels on icon-only buttons
- Alt text on all images
- Form labels properly associated
- Keyboard navigation supported throughout
- Semantic HTML structure (header, main, nav, section)
- Color contrast ratios meet WCAG AA standards (handled by color selection later)