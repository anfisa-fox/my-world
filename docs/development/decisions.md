# Architecture Decisions

Project: Personal Creative World

Status: Active

Last Updated: 2026-06-27

---

# Purpose

This document records the architectural decisions that define the project.

Only accepted decisions are included.

Temporary implementation details and sprint notes are intentionally excluded.

---

# ADR-001

## Content First

Status:

Accepted

Decision:

Creative content is the primary asset of the project.

Technology exists to support creation, organisation and publication of content.

---

# ADR-002

## Git as Source of Truth

Status:

Accepted

Decision:

GitHub Repository is the only canonical storage location.

All published content must ultimately exist as Markdown committed into Git.

No duplicate production storage is introduced.

---

# ADR-003

## Markdown Content Model

Status:

Accepted

Decision:

All content collections are stored as Markdown.

Current collections:

- artworks
- characters
- posts

Markdown remains independent from implementation details.

---

# ADR-004

## No Database for MVP

Status:

Accepted

Decision:

The MVP intentionally avoids a production database.

The current architecture is fully satisfied by Git-based content management.

---

# ADR-005

## Cloudflare Pages

Status:

Accepted

Decision:

Cloudflare Pages is the production hosting platform.

Responsibilities:

- hosting;
- automatic deployment;
- Pages Functions.

---

# ADR-006

## Creator Studio Publishing

Status:

Accepted

Decision:

Creator Studio publishes through GitHub REST API.

Publishing creates Markdown files directly inside the repository.

---

# ADR-007

## Cloudflare Pages Functions

Status:

Accepted

Decision:

Production publishing is implemented using Cloudflare Pages Functions.

No persistent backend server is required.

---

# ADR-008

## Automatic Deployment

Status:

Accepted

Decision:

Every successful publication automatically produces a production deployment.

No manual deployment step exists.

---

# ADR-009

## Slug Generation

Status:

Accepted

Decision:

Creator Studio generates Git-safe slugs automatically.

Slug generation includes transliteration of Cyrillic characters.

---

# ADR-010

## Studio Authentication

Status:

Accepted

Decision:

Creator Studio is protected using Studio Secret.

Publishing requests are rejected unless the supplied secret matches the configured production secret.

---

# ADR-011

## Author-Centric Workflow

Status:

Accepted

Decision:

The publishing workflow is optimised for a single author.

Operational simplicity has priority over supporting multiple users.

---

# Guiding Principle

Whenever multiple technical solutions exist, preference is given to the solution that:

- keeps Git as the source of truth;
- minimises operational complexity;
- improves long-term maintainability;
- reduces infrastructure requirements;
- helps the author publish creative work more easily.