# T FUN Music Festival Website - Optimization Design

## Overview
Optimize the T FUN music festival single-page React website with focus on visual/UX improvements and mobile experience, then deploy via GitHub Pages.

## Project Setup
- Vite + React project scaffolding
- GitHub Pages deployment via `gh-pages` branch
- Base path configured for GitHub Pages

## Optimizations

### 1. Mobile Hamburger Menu
- Hamburger icon in top-right on screens <= 768px
- Full-screen overlay menu (black background, white text)
- Smooth open/close animation (slide or fade)
- Auto-close on link click
- Body scroll lock when menu is open

### 2. Hero Section Enhancement
- Animated scroll-down indicator (bouncing chevron arrow)
- Refined mobile text sizing and spacing

### 3. Band Card Interactions
- Hover: translateY(-4px) + box-shadow elevation
- Smooth transition on hover/unhover

### 4. Info Section
- Info cards hover effect (subtle scale or glow)
- Google Maps button hover animation

### 5. Animation Polish
- Section titles: scroll-triggered fade-in using IntersectionObserver
- Respect `prefers-reduced-motion` media query

### 6. Accessibility
- `prefers-reduced-motion` disables all animations
- Proper aria-labels on hamburger button and language toggle

## Data Change
- Staff list: only "Nick" (remove all others)

## Not Changing
- Design language (Figma-inspired black/white + gradient hero)
- Band data, i18n structure
- Overall layout structure
