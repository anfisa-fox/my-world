# CURRENT_IMPLEMENTATION

**Project:** My World
**Status:** MVP 1.0 (Active Development)
**Last Updated:** 2026-06-30

---

# Project Overview

**My World** — персональный творческий сайт для публикации иллюстраций, персонажей и историй.

Проект разрабатывается как специализированная авторская платформа, а не как универсальная CMS.

Основная цель MVP — предоставить автору возможность самостоятельно публиковать новый контент без использования Git, GitHub и программирования.

---

# Technology Stack

## Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

## Runtime

* Static Export
* Cloudflare Pages
* Cloudflare Pages Functions

## Storage

* GitHub Repository
* Markdown Files
* Media Files

---

# Supported Content Types

В настоящий момент Creator Studio поддерживает три доменных типа контента.

| Content Type | Status |
| ------------ | ------ |
| Gallery      | ✅      |
| Characters   | ✅      |
| Wall         | ✅      |

---

# Content Domains

## Gallery

Назначение:

Публикация художественных работ.

Хранение:

* Markdown
* Cover Image
* Description
* Story
* Metadata

Реализовано:

* список работ;
* страница работы;
* Author Mode;
* публикация через Creator Studio.

---

## Characters

Назначение:

Публикация персонажей авторского мира.

Хранение:

* Markdown
* Avatar
* Gallery
* Description
* Body

Реализовано:

* список персонажей;
* страница персонажа;
* Author Mode;
* публикация через Creator Studio.

---

## Wall

Назначение:

Публикация коротких записей и новостей мира.

Хранение:

* Markdown
* Optional Image
* Body

Реализовано:

* список публикаций;
* страница публикации;
* Author Mode;
* публикация через Creator Studio.

---

# Creator Studio

**Creator Studio является платформой публикации контента.**

Каждый тип контента имеет собственную доменную модель, но использует единую инфраструктуру публикации.

В настоящий момент реализованы:

* Gallery Author Mode
* Characters Author Mode
* Wall Author Mode

---

# Current Platform State

На текущий момент подтверждены следующие платформенные возможности:

* единая авторизация через Studio Secret;
* единый механизм Author Mode;
* единая публикация через Cloudflare Pages Functions;
* генерация Markdown;
* генерация slug;
* загрузка изображений;
* публикация в GitHub Repository;
* автоматический Cloudflare Deployment;
* Pending Publications;
* единое поведение пользовательского интерфейса между всеми реализованными типами контента.

---

# Markdown Models

Для каждого типа контента используется собственная Markdown-модель.

## Gallery

Поддерживаются:

* frontmatter;
* story;
* metadata.

---

## Characters

Поддерживаются:

* name;
* avatar;
* gallery;
* description;
* createdAt;
* body.

Body является частью канонической Markdown-модели персонажа.

Минимальная форма Author Mode может собирать только необходимый для MVP набор данных, не изменяя модель хранения.

---

## Wall

Поддерживаются:

* title;
* image;
* createdAt;
* body.

---

# Pending Publications

Во всех Author Mode используется единый механизм Pending Publications.

Поддерживается:

* отображение placeholder сразу после публикации;
* хранение состояния в sessionStorage;
* автоматическое исчезновение placeholder после появления опубликованного контента;
* поддержка нескольких одновременно ожидающих публикаций;
* автоматическая очистка устаревших записей (TTL).

Поведение унифицировано между Gallery, Characters и Wall.

---

# Production Publishing Pipeline

Во всех реализованных типах контента используется единый Production Publishing Pipeline.

Последовательность публикации:

```text
Author Mode
        │
        ▼
Cloudflare Pages Function
        │
        ▼
GitHub Repository
        │
        ▼
Automatic Commit
        │
        ▼
Cloudflare Pages Deployment
        │
        ▼
Published Site
```

В ходе Sprint 3 данный pipeline подтверждён практической публикацией нового персонажа.

Один и тот же Production Publishing Pipeline используется всеми реализованными типами контента.

---

# Content Ordering

Во всех публичных разделах используется единое правило сортировки.

Поддерживается:

* сортировка по `createdAt`;
* новые материалы отображаются сверху;
* более старые материалы отображаются ниже.

Правило применяется для:

* Gallery;
* Characters;
* Wall.

---

# Implemented Architecture Principles

На текущем этапе проекта подтверждены следующие архитектурные принципы.

## Domain Separation

Каждый тип контента имеет собственную доменную модель и собственный пользовательский интерфейс.

---

## Infrastructure Reuse

Инфраструктурные механизмы максимально переиспользуются между всеми реализованными доменами.

---

## Minimal Domain Extensions

Добавление нового типа контента требует изменения только доменной логики.

Общие инфраструктурные механизмы сохраняются без изменений.

---

## Consistent Author Experience

Поведение Creator Studio остаётся единым независимо от публикуемого типа контента.

---

# Current System State

На текущий момент полностью реализованы:

* Gallery Author Mode;
* Characters Author Mode;
* Wall Author Mode.

Практической эксплуатацией подтверждены:

* публикация Markdown;
* загрузка изображений;
* GitHub Publishing;
* Automatic Deployment;
* Pending Publications;
* единая сортировка контента;
* повторное использование платформенной инфраструктуры между всеми реализованными доменами.

---

# Verified Platform Capabilities

В ходе реализации и production-проверки подтверждены следующие возможности платформы:

* Author Mode;
* Cloudflare Pages Functions;
* Markdown Generation;
* Image Upload;
* GitHub Publishing;
* Pending Publications;
* Automatic Cloudflare Deployment;
* единое поведение платформы для Gallery, Characters и Wall.

Данный документ отражает текущее состояние реализации проекта и является базовой точкой входа для разработчиков, подключающихся к проекту.
