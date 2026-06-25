# Personal Creative World Documentation

This directory contains the primary technical, product and design documentation for the **Personal Creative World** project.

The documentation is intended to support:

* project maintenance;
* onboarding of new developers;
* independent technical audits;
* future architectural evolution.

---

# Recommended Reading Order

## 1. PROJECT_SNAPSHOT_v1.0_PRE_DEMO.md

**Primary entry point**

Describes the current state of the project before the first demonstration.

Includes:

* product overview;
* project philosophy;
* technical architecture;
* content architecture;
* UI architecture;
* release readiness;
* external audit objectives.

This document should always be read first.

---

## 2. product-definition.md

Defines the long-term product vision.

Describes:

* project goals;
* target audience;
* product principles;
* long-term direction.

---

## 3. project-context.md

Provides implementation context and development assumptions.

Includes:

* project scope;
* current constraints;
* implementation decisions;
* architectural context.

---

## 4. design/

Design documentation covering the visual language of the project.

Currently includes:

* design system;
* interface principles;
* visual guidelines.

---

# Documentation Philosophy

The documentation is intentionally organised into complementary layers rather than a single monolithic specification.

Each document has a distinct responsibility:

| Document             | Purpose                |
| -------------------- | ---------------------- |
| Project Snapshot     | Current implementation |
| Product Definition   | Product vision         |
| Project Context      | Development context    |
| Design Documentation | Visual system          |

Together these documents provide a complete understanding of the project without unnecessary duplication.

---

# Versioning

Major project milestones should be accompanied by an updated Project Snapshot.

Examples:

* PROJECT_SNAPSHOT_v1.0_PRE_DEMO.md
* PROJECT_SNAPSHOT_v1.1_PRE_RELEASE.md
* PROJECT_SNAPSHOT_v2.0.md

This approach creates a historical record of the project's evolution while keeping each snapshot focused on a specific stage of development.

---

# Repository Structure

The project follows a content-first architecture.

Key directories include:

```text
content/     Markdown content
docs/        Documentation
public/      Static assets
src/         Application source code
tmp/         Local working materials (not tracked by Git)
```

---

# Notes

The documentation should evolve together with the project.

Whenever significant architectural or product changes are introduced, the relevant documentation should be updated to ensure it continues to reflect the current implementation.
