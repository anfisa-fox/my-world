# Content Model

Project: Personal Creative World
Version: MVP 1.0

---

# Purpose

This document defines all content entities used by the MVP.

It is the canonical source of truth for:

* Markdown content
* Future TypeScript types
* Decap CMS schema
* Content validation

---

# General Rules

## Storage Format

All content is stored as Markdown files.

```text id="4os8g4"
*.md
```

MDX is intentionally excluded from MVP.

---

## Slugs

Slug is derived from the filename.

Example:

```text id="tpc5c6"
moon-girl.md → moon-girl
```

---

## Immutable Slug Policy

After publication, a slug is considered a permanent identifier.

Slug changes are discouraged.

Purpose:

* stable URLs;
* archive consistency;
* future relations.

---

## Date Format

All content dates use:

```text id="93blkw"
YYYY-MM-DD
```

Example:

```yaml id="mxhq5y"
createdAt: 2025-07-15
```

---

# Artwork

Represents a drawing, illustration or visual artwork.

## Frontmatter

```yaml id="4vkv34"
title: string
image: string
description: string
tags: string[]
period: string
featured: boolean
createdAt: string
story: string
```

---

## Example

```yaml id="83p2xt"
---
title: "Moon Girl"
image: "/images/artworks/moon-girl.jpg"
description: "Early concept sketch."
tags:
  - sketch
  - character
period: "2025"
featured: true
createdAt: "2025-07-15"
story: "Created after a family trip to the sea."
---
```

---

## Notes

* `featured` controls homepage artwork selection.
* `story` is optional.
* `createdAt` is optional during migration of old works.

---

# Character

Represents an original character.

## Frontmatter

```yaml id="7slcbf"
name: string
avatar: string
description: string
gallery: string[]
createdAt: string
```

---

## Example

```yaml id="hcx3vw"
---
name: "Moon Girl"
avatar: "/images/characters/moon-girl.jpg"
description: "A mysterious lunar traveler."
gallery:
  - "/images/artworks/moon-girl-sketch.jpg"
  - "/images/artworks/moon-girl-final.jpg"
createdAt: "2025-07-20"
---
```

---

## Notes

* `gallery` contains image paths.
* Relations are not implemented in MVP.

---

# Post

Represents a diary entry, thought, idea or update.

## Frontmatter

```yaml id="z1vv4t"
title: string
content: string
image: string
createdAt: string
```

---

## Example

```yaml id="mwx17t"
---
title: "Today I finished a sketch"
image: "/images/posts/sketch.jpg"
content: "I experimented with lighting."
createdAt: "2025-07-22"
---
```

---

## Notes

* `image` is optional.
* Posts support free-form Markdown content.

---

# Future Directions

Not part of MVP.

Potential future additions:

* soft relations;
* timelines;
* archives;
* tagging improvements;
* content collections.

---

# Out of Scope

Not included in MVP:

* databases;
* API layer;
* complex relations;
* comments;
* reactions;
* user accounts;
* search.
