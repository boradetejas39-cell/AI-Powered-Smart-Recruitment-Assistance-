# AI-Recruiter UI Component Library

## Overview
A comprehensive, modern UI component library built with React and Tailwind CSS. All components are fully accessible, responsive, and production-ready.

## Installation & Usage

```javascript
// Import individual components
import { Button, Card, Badge, Avatar } from '../components/UI';

// Or import specific feature components
import { Button, IconButton } from '../components/UI/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/UI/Card';
```

## Component Categories

### 1. Buttons & Actions

#### Button Component
```javascript
<Button variant="primary" size="md">
  Click me
</Button>

// Variants: primary, secondary, success, danger, warning, outline, ghost
// Sizes: xs, sm, md, lg, xl
```

**Props:**
- `variant`: Button style variant
- `size`: Button size
- `disabled`: Disable button
- `loading`: Show loading state
- `icon`: Icon component to display
- `iconPosition`: Position of icon (left/right)

#### IconButton
```javascript
<IconButton icon={HeartIcon} variant="secondary" />
```

### 2. Cards & Containers

#### Card with Sections
```javascript
<Card hover>
  <CardHeader>Header Title</CardHeader>
  <CardBody>Card content goes here</CardBody>
  <CardFooter>Footer content</CardFooter>
</Card>
```

#### StatCard
```javascript
<StatCard
  icon={UserIcon}
  label="Total Users"
  value="1,234"
  trend="↑ 12% from last month"
  trendColor="green"
/>
```

### 3. Form Elements

#### Input
```javascript
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  icon={MailIcon}
  error={errorMessage}
/>
```

#### Select
```javascript
<Select
  label="Category"
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' }
  ]}
/>
```

#### Textarea
```javascript
<Textarea
  label="Description"
  placeholder="Enter description..."
  rows="4"
/>
```

#### Tabs
```javascript
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

### 4. Badges & Tags

#### Badge
```javascript
<Badge variant="primary">Active</Badge>
<Badge variant="success">Approved</Badge>
<Badge variant="danger">Failed</Badge>
```

#### StatusBadge
```javascript
<StatusBadge status="active" />     {/* Green */}
<StatusBadge status="pending" />    {/* Yellow */}
<StatusBadge status="rejected" />   {/* Red */}
```

#### Tag
```javascript
<Tag variant="primary" onRemove={() => removeTag()}>
  React
</Tag>
```

### 5. Avatars

#### Avatar
```javascript
<Avatar size="md" fallback="JD" />
<Avatar size="lg" fallback="JD" status="online" />
```

**Sizes:** xs, sm, md, lg, xl  
**Status:** online, away, offline

#### Avatar Group
```javascript
<AvatarGroup
  avatars={[
    { fallback: 'JD', status: 'online' },
    { fallback: 'AB', status: 'away' }
  ]}
  max={3}
/>
```

### 6. Progress & Loading

#### Progress Bar
```javascript
<Progress value={65} max={100} color="blue" showLabel />
```

#### Progress Steps
```javascript
<ProgressBar
  steps={['Step 1', 'Step 2', 'Step 3']}
  currentStep={1}
/>
```

#### Skeleton Loader
```javascript
<Skeleton height="h-4" width="w-full" count={3} />
```

#### LoadingSpinner
```javascript
<LoadingSpinner size="md" />
// Sizes: sm, md, lg
```

### 7. Data Display

#### Table
```javascript
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ]}
  data={tableData}
  rowAction={[
    { label: 'Edit', onClick: (row) => editRow(row) }
  ]}
/>
```

#### Pagination
```javascript
<Pagination
  currentPage={page}
  totalPages={10}
  onChange={setPage}
/>
```

### 8. Utilities

#### Alert
```javascript
<Alert
  type="success"
  title="Success!"
  message="Your action was successful"
/>
```

**Types:** info, success, warning, error

#### Modal
```javascript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
>
  <p>Are you sure you want to continue?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

#### Dropdown
```javascript
<Dropdown
  button={<Button>Menu</Button>}
  items={[
    { label: 'Edit', onClick: () => edit() },
    { label: 'Delete', onClick: () => delete() }
  ]}
/>
```

#### Tooltip
```javascript
<Tooltip content="Click to edit" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

#### Breadcrumb
```javascript
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Dashboard' }
  ]}
/>
```

#### EmptyState
```javascript
<EmptyState
  icon={DocumentIcon}
  title="No data"
  description="Start by creating your first item"
  action={<Button>Create Item</Button>}
/>
```

### 9. Layout Components

#### Header
```javascript
<Header
  logo="AI-Recruiter"
  title="Dashboard"
  actions={<Button>Settings</Button>}
/>
```

#### Sidebar
```javascript
<Sidebar
  logo="App"
  items={[
    { label: 'Dashboard', href: '/', icon: HomeIcon, active: true },
    { label: 'Settings', href: '/settings', icon: CogIcon }
  ]}
/>
```

#### Footer
```javascript
<Footer
  copyright="© 2024 AI-Recruiter. All rights reserved."
  links={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ]}
/>
```

#### Container
```javascript
<Container>
  {children}
</Container>
```

#### PageHeader
```javascript
<PageHeader
  title="Dashboard"
  description="Welcome back!"
  action={<Button>New Item</Button>}
/>
```

#### Section
```javascript
<Section title="My Section">
  {children}
</Section>
```

#### Grid
```javascript
<Grid columns={3} gap={4}>
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</Grid>
```

## CSS Utilities

### Animation Classes
```html
<!-- Fade in effect -->
<div class="fade-in">Content</div>

<!-- Slide animations -->
<div class="slide-up">Slides up</div>
<div class="slide-down">Slides down</div>
<div class="slide-left">Slides left</div>
<div class="slide-right">Slides right</div>

<!-- Scale animation -->
<div class="scale-in">Scales in</div>

<!-- Glow animation -->
<div class="pulse-glow">Glows</div>
```

### Hover Effects
```html
<div class="hover-lift">Lifts on hover</div>
<div class="hover-scale">Scales on hover</div>
<div class="hover-shadow">Shadow on hover</div>
```

### Flexbox Utilities
```html
<div class="flex-center">Center content</div>
<div class="flex-between">Space between</div>
<div class="inline-flex-center">Inline center</div>
```

### Text Utilities
```html
<p class="text-gradient">Gradient text</p>
<p class="text-subtle">Subtle text</p>
<p class="text-muted">Muted text</p>
```

## Shadow Utilities
```html
<div class="shadow-soft">Soft shadow</div>
<div class="shadow-md-soft">Medium soft shadow</div>
<div class="shadow-lg-soft">Large soft shadow</div>
```

## Spacing & Sizing

### Container Sizes
- `.container`: Max width 7xl with padding
- `.container-sm`: Max width 4xl with padding

### Section Spacing
- `.section-spacing`: 12 (md: 20) units vertical padding
- `.section-spacing-sm`: 6 (md: 12) units vertical padding

## Color Scheme

The component library supports the following color palette:
- **Primary**: Blue
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red
- **Info**: Cyan
- **Neutral**: Gray

## Responsive Design

All components are fully responsive with Tailwind's breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Accessibility

- All components follow WCAG 2.1 guidelines
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Best Practices

1. **Consistency**: Use consistent variants across the application
2. **Spacing**: Use Tailwind spacing utilities for consistent gaps
3. **Loading States**: Always provide visual feedback for async operations
4. **Error Handling**: Use Alert components for user feedback
5. **Performance**: Lazy load heavy components
6. **Testing**: Test components in isolation and integration

## Component Showcase

Visit `/showcase` route to see all components in action with live examples.

## Future Enhancements

- [ ] Dark mode support
- [ ] RTL language support
- [ ] Additional animation presets
- [ ] More component variants
- [ ] Component documentation website
- [ ] Storybook integration
