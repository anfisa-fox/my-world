# Personal Creative World Documentation

This directory contains the primary architectural, product and development documentation for the **Personal Creative World** project.

The documentation is intended to support:

- long-term project maintenance;
- onboarding of new developers;
- independent technical audits;
- architectural reviews;
- future product evolution.

The documentation follows the principle:

> **One document — one responsibility.**

Each document has a clearly defined purpose and should be updated only when changes affect its scope.

---

# Recommended Reading Order

## 1. PROJECT_SNAPSHOT_v1.1_PRODUCTION.md

**Primary entry point**

This document provides the current production snapshot of the project.

It describes:

- project status;
- production readiness;
- implemented functionality;
- current architecture;
- overall system maturity.

Every new contributor should begin here.

---

## 2. architecture/creator-studio.md

Complete architectural specification of the Creator Studio subsystem.

Includes:

- design goals;
- publishing workflow;
- production architecture;
- security model;
- GitHub integration;
- implementation roadmap.

---

## 3. product-definition.md

Defines the long-term vision of the project.

Includes:

- product goals;
- audience;
- guiding principles;
- long-term direction.

---

## 4. project-context.md

Provides implementation context.

Includes:

- project scope;
- technical assumptions;
- architectural constraints;
- development context.

---

## 5. development/

Development documentation.

Currently includes:

- roadmap;
- architecture decisions.

---

## 6. design/

Visual system documentation.

Includes:

- design system;
- UI principles;
- visual guidelines.

---

# Documentation Structure

| Document | Responsibility |
|-----------|----------------|
| Project Snapshot | Current state of the project |
| Creator Studio | Authoring subsystem architecture |
| Product Definition | Product vision |
| Project Context | Development context |
| Roadmap | Future development |
| Architecture Decisions | Accepted architectural decisions |
| Design Documentation | Visual language |

Each topic is documented in exactly one place.

---

# Documentation Principles

The project documentation follows several principles.

## Single Source of Truth

Every architectural topic is described only once.

Documentation should avoid duplication.

---

## Snapshot Versioning

Project snapshots are immutable.

Examples:

- PROJECT_SNAPSHOT_v1.0_PRE_DEMO.md
- PROJECT_SNAPSHOT_v1.1_PRODUCTION.md

A new snapshot is created for each major project milestone.

Existing snapshots are preserved as historical records.

---

## Incremental Evolution

Architecture documentation evolves together with the project.

Only documents affected by a completed sprint should be updated.

---

# Repository Structure

```text
content/        Markdown content

docs/           Documentation

public/         Static assets

src/            Application source code

functions/      Cloudflare Pages Functions

tmp/            Local working materials (ignored)
```

---

# Current Architecture

The project is based on a Git-first publishing workflow.

```text
Creator Studio

        │

        ▼

Cloudflare Pages Function

        │

        ▼

GitHub Repository

        │

        ▼

Automatic Cloudflare Deployment

        │

        ▼

Production Website
```

Git remains the single source of truth for all published content.

---

# Maintenance

Documentation is maintained together with the codebase.

Whenever a sprint introduces architectural changes, the affected documentation should be updated before the sprint is considered complete.

This ensures that the documentation always reflects the current implementation rather than historical assumptions.