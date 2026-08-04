# Design Direction & UI System — CareerOS

## Purpose
Define the visual and interaction foundation for CareerOS to ensure a consistent, modern, and implementation-ready design system.

# Product Personality

CareerOS should feel:
- Calm
- Focused
- Professional
- Fast
- Trustworthy
- Intelligent
- Minimal, never empty

Avoid:
- Gamification
- Excessive gradients
- Loud colors
- Dashboard clutter

# Design Philosophy

1. Execution over decoration.
2. Every screen should answer: "What should I do next?"
3. Reduce cognitive load.
4. Minimize typing.
5. Progressive disclosure.
6. Consistency over novelty.

# Visual Identity

## Keywords
Modern • Professional • Clean • Confident • Purposeful

## Inspiration
- Linear
- Notion
- Raycast
- Stripe Dashboard
- Vercel
- GitHub
- Arc Browser

# Color Direction

Primary:
- Indigo / Blue

Success:
- Green

Warning:
- Amber

Danger:
- Red

Neutral:
- Slate / Gray

Background:
- Light mode: Off-white
- Dark mode: Near-black

Use color to communicate state, not decoration.

# Typography

Primary:
- Inter

Monospace:
- JetBrains Mono

Scale:
- Display
- H1
- H2
- H3
- Body
- Small
- Caption

Favor generous spacing over large font sizes.

# Layout

Desktop-first for MVP.

Structure:
- Left navigation
- Top command bar
- Main content
- Right contextual panel (optional)

Grid:
- 12-column responsive grid

Spacing:
4 / 8 / 12 / 16 / 24 / 32 / 48 px

# Component System

Core Components:
- Button
- Input
- Select
- Badge
- Card
- Modal
- Drawer
- Toast
- Tooltip
- Avatar
- Tabs
- Breadcrumb
- Kanban Card
- Data Table
- Empty State
- Skeleton Loader

# Design Tokens

Border radius:
- 10–12px

Shadow:
- Subtle elevation only

Animation:
150–250ms
Ease-out transitions

# UX Guidelines

- Primary CTA per screen
- Keyboard shortcuts where practical
- Inline editing
- Autosave where appropriate
- Optimistic UI for simple updates

# Responsive Strategy

MVP:
Desktop optimized.

Tablet:
Supported.

Mobile:
Responsive viewing only (no native app).

# Accessibility

- WCAG AA contrast
- Keyboard navigation
- Focus states
- Semantic HTML
- Screen reader labels

# Empty States

Every empty state should:
- Explain value
- Suggest next action
- Avoid dead ends

Example:
"No applications yet. Capture your first job using the browser extension."

# Error States

Friendly.
Actionable.
Never expose stack traces.

# Motion

Use animation to reinforce:
- Save
- Status change
- Loading
- Success

Avoid decorative animation.

# Dashboard Information Hierarchy

1. Tasks Due
2. Active Applications
3. Recent Captures
4. Pipeline Overview
5. Companies

# Key Screens

1. Landing Page
2. Sign Up
3. Onboarding
4. Dashboard
5. Job Detail
6. Company Detail
7. Application Board
8. Task Center
9. Resume Library
10. Settings
11. Extension Popup

# Emotional Goals

Users should feel:
- Organized
- In control
- Less overwhelmed
- Confident
- Productive

# Design Principles Checklist

- Can a new user understand this in 5 seconds?
- Is there only one obvious primary action?
- Can this screen remove work instead of creating it?
- Is unnecessary information hidden?
- Does the interface reduce anxiety?

If the answer is "no", redesign before building.
