# Creator Studio Architecture

**Subsystem:** Creator Studio

**Version:** 1.0

**Status:** Implemented (Sprint 1)

**Last Updated:** 2026-06-27

---

# 1. Purpose

Creator Studio is the authoring subsystem of the Personal Creative World project.

Its purpose is to allow the author to publish new content directly from the production website without requiring local development, manual Git operations or direct editing of Markdown files.

Creator Studio is intentionally designed for a single author and follows the overall philosophy of the project:

- Content First
- Author First
- Git as Source of Truth
- Simplicity over Complexity

---

# 2. Goals

Creator Studio has four primary objectives.

## Simple Authoring

Publishing new content should require only a web browser.

---

## Git-Based Workflow

All published content remains stored inside the Git repository.

Git is the only source of truth.

---

## Zero Database

The MVP intentionally avoids introducing a production database.

Markdown files remain the canonical content format.

---

## Low Operational Complexity

Publishing should reuse the existing GitHub and Cloudflare infrastructure without introducing additional backend services.

---

# 3. High-Level Architecture

```text
Author

        │

        ▼

Creator Studio

        │

        ▼

Cloudflare Pages Function

        │

        ▼

GitHub REST API

        │

        ▼

Markdown Repository

        │

        ▼

Git Commit

        │

        ▼

Cloudflare Automatic Deployment

        │

        ▼

Production Website
```

---

# 4. Publishing Pipeline

The publication workflow consists of the following steps.

1. The author opens Creator Studio.

2. The Studio Secret is validated.

3. The author enters:

- title
- content

4. Creator Studio sends the request to:

```
/api/studio/posts
```

5. Cloudflare Pages Function:

- validates Studio Secret;
- generates slug;
- builds Markdown;
- sends GitHub API request.

6. GitHub creates a new Markdown file.

7. A commit is created automatically.

8. Cloudflare Pages detects repository changes.

9. A production deployment starts automatically.

10. The published post becomes available on the public website.

---

# 5. Components

## Studio UI

Location:

```
src/app/studio
```

Responsibilities:

- author interface;
- content submission;
- Studio Secret input.

---

## Production API

Location:

```
functions/api/studio/posts.ts
```

Responsibilities:

- request validation;
- slug generation;
- Markdown generation;
- GitHub communication.

---

## GitHub Repository

Repository remains the canonical storage layer.

New posts are stored in:

```
content/posts
```

---

## Cloudflare Pages

Responsible for:

- hosting;
- Pages Functions;
- automatic deployments.

---

# 6. Security Model

Current MVP security consists of:

- Studio Secret
- GitHub Personal Access Token

Studio Secret protects the publishing interface.

GitHub Token authorizes repository updates.

No public publishing endpoint exists without a valid Studio Secret.

---

# 7. Architectural Decisions

The following architectural decisions have been accepted.

## Git as Source of Truth

All content is stored inside Git.

No duplicate storage exists.

---

## Markdown Storage

Markdown remains the canonical content format.

No database synchronization is required.

---

## Automatic Deployment

Publishing automatically produces a production deployment.

No manual deployment step exists.

---

## Stateless Backend

Cloudflare Pages Functions perform publishing without persistent server state.

---

# 8. Current MVP Scope

Sprint 1 includes:

- production publishing;
- slug generation;
- Studio Secret validation;
- GitHub API integration;
- automatic deployment.

---

# 9. Out of Scope

The following features are intentionally deferred.

- editing existing posts;
- deleting posts;
- image uploads;
- draft mode;
- scheduling;
- tags;
- categories;
- multiple authors.

---

# 10. Roadmap

## Sprint 2

- Published posts list
- Editing
- Delete
- Improved Studio UI

---

## Sprint 3

- Image uploads
- Drafts
- Preview
- Categories
- Tags

---

## Future

Potential future improvements include:

- GitHub App authentication
- Role-based permissions
- Media library
- Scheduled publishing
- Content search
- Collection management

These features are considered evolutionary improvements rather than architectural changes.

---

# 11. Design Philosophy

Creator Studio is intentionally not a traditional CMS.

Instead, it is a lightweight authoring layer built around Git.

The architecture minimizes infrastructure while maximizing long-term maintainability.

The subsystem is designed to evolve incrementally without requiring changes to the project's core content architecture.

Git remains the single source of truth.

Markdown remains the canonical storage format.

Cloudflare Pages remains the production platform.

These principles form the architectural foundation for all future Creator Studio development.