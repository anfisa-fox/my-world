# Content Structure

Project: Personal Creative World
Version: MVP 1.0

---

# Purpose

This document defines the directory structure and content organization rules used by the project.

Goals:

* predictable content location;
* compatibility with Decap CMS;
* simple maintenance;
* scalability without major refactoring.

---

# Repository Structure

```text
my-world/
├── src/
├── public/
├── content/
├── docs/
├── admin/
└── .github/
```

---

# Content Directory

All author-created content is stored inside:

```text
content/
```

Structure:

```text
content/
├── artworks/
├── characters/
└── posts/
```

---

## artworks/

Contains visual artworks.

Examples:

```text
content/artworks/
├── moon-girl.md
├── sleeping-cat.md
└── blue-sky-study.md
```

---

## characters/

Contains original character profiles.

Examples:

```text
content/characters/
├── moon-girl.md
├── forest-fox.md
└── star-rabbit.md
```

---

## posts/

Contains wall entries and diary posts.

Examples:

```text
content/posts/
├── first-sketch.md
├── today-i-drew.md
└── new-character-idea.md
```

---

# Image Storage

All images are stored locally.

Root directory:

```text
public/images/
```

Structure:

```text
public/images/
├── artworks/
├── characters/
└── posts/
```

---

## Image References

Content files reference images using absolute paths.

Example:

```text
/images/artworks/moon-girl.jpg
```

---

# Documentation

Project documentation is stored in:

```text
docs/
```

Structure:

```text
docs/
├── architecture/
├── development/
├── audits/
├── product-definition.md
└── project-context.md
```

---

# Naming Convention

All filenames use:

```text
kebab-case
```

Examples:

```text
moon-girl.md
forest-fox.md
today-i-drew.md
```

Not allowed:

```text
MoonGirl.md
moonGirl.md
Moon Girl.md
```

---

# Slug Policy

Slug is derived from filename.

Example:

```text
moon-girl.md → moon-girl
```

---

## Immutable Slug Rule

After publication:

```text
slug = permanent identifier
```

Changing published slugs is discouraged.

Reasons:

* stable URLs;
* future linking;
* archive consistency.

---

# Separation of Responsibilities

## content/

Stores creative content.

Examples:

* artworks;
* characters;
* posts.

---

## public/

Stores static assets.

Examples:

* images;
* icons;
* future media assets.

---

## docs/

Stores project knowledge.

Examples:

* architecture;
* roadmap;
* audits;
* product definition.

---

# Future Growth

This structure is designed to support future additions without changing existing content.

Possible future directories:

```text
content/
├── fandoms/
├── stories/
├── timelines/
└── collections/
```

No changes are required for MVP.
