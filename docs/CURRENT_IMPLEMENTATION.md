# CURRENT_IMPLEMENTATION

Version: 2.0

Status: Active

Last Updated: 2026-06-29

---

# Назначение документа

Данный документ является техническим паспортом проекта.

Его задача — зафиксировать текущее фактическое состояние реализации проекта.

В отличие от `PROJECT_CONTEXT.md`, данный документ регулярно обновляется после завершения Sprint и содержит только подтверждённые факты.

Документ не содержит продуктовых идей, архитектурных гипотез или планов развития.

---

# Текущее состояние проекта

## Общий статус

Проект находится в состоянии **Production MVP**.

Основной сайт опубликован и работает в production.

Публичная часть проекта доступна пользователям.

Author Mode находится в активной разработке (Creator Studio Sprint 2).

---

# Production Architecture

## Frontend

* Next.js (Static Export)
* React
* TypeScript
* Tailwind CSS

---

## Backend

Cloudflare Pages Functions.

Вся production-логика Author Mode выполняется через Cloudflare Functions.

---

## Storage

GitHub Repository.

Контент хранится исключительно в Markdown.

GitHub остаётся единственным Source of Truth.

---

## Deployment

Production Pipeline:

```text
GitHub Repository
        │
        ▼
Cloudflare Pages Build
        │
        ▼
Production Website
```

Публикация выполняется автоматически после изменения репозитория.

---

# Текущее состояние функциональности

## Public Website

Реализованы:

* Home
* Gallery
* Characters
* Wall

---

## Author Mode

Реализовано:

* вход через Studio Secret;
* создание новой записи Wall;
* автоматическая генерация slug;
* создание Markdown;
* автоматическая публикация через GitHub;
* автоматический Cloudflare Deployment.

---

## Creator Studio Sprint 2

На момент обновления документа реализуется расширение Author Mode на Gallery и Characters.

Работы находятся в процессе.

---

# Canonical Repository Structure

## Контент

```text
content/

artworks/
characters/
posts/
_archive/
```

---

## Frontend

```text
src/app/

page.tsx
gallery/
characters/
wall/
studio/
```

---

## Cloudflare Backend

```text
functions/

api/
studio/

auth/
gallery/
posts/

lib/
content.ts
```

Cloudflare Functions являются канонической production-реализацией backend.

---

## Documentation

Основные документы проекта находятся в каталоге:

```text
docs/
```

Документация разделена на:

* Product
* Architecture
* Development
* Audits
* Planning

---

# Канонические реализации

## Public Website

Канонической реализацией пользовательского сайта является каталог:

```text
src/app/
```

---

## Backend

Канонической production-реализацией backend является каталог:

```text
functions/
```

Next.js API Routes сохраняются только для совместимости и локальной разработки.

Новые production endpoint'ы реализуются исключительно через Cloudflare Pages Functions.

---

## Content Repository

Общий backend-слой расположен в:

```text
functions/lib/content.ts
```

Он отвечает за:

* работу с GitHub API;
* создание Markdown;
* обновление Markdown;
* удаление Markdown;
* общие операции публикации.

---

# Текущее состояние контента

## Gallery

Контент хранится в:

```text
content/artworks/
```

---

## Characters

Контент хранится в:

```text
content/characters/
```

---

## Wall

Контент хранится в:

```text
content/posts/
```

---

# Известные ограничения

На текущем этапе проекта:

* отсутствует база данных;
* отсутствует сервер Next.js;
* отсутствует универсальная CMS;
* отсутствует универсальный редактор контента;
* отсутствует загрузка изображений через Author Mode.

Все ограничения являются осознанными архитектурными решениями MVP.

---

# Известный технический долг

Технический долг фиксируется только после отдельного архитектурного решения.

На момент обновления документа критический технический долг отсутствует.

---

# Следующее безопасное изменение

Следующим безопасным этапом разработки является продолжение Creator Studio Sprint 2.

В рамках утверждённого Scope допускается:

* завершение Gallery Author Mode;
* реализация Author Mode для Characters;
* развитие существующего Content Repository Layer.

Изменение архитектурных принципов проекта в рамках Sprint 2 не допускается.

---

# Правила работы с проектом

Перед внесением изменений разработчик обязан:

1. Ознакомиться с `PROJECT_CONTEXT.md`.
2. Ознакомиться с данным документом.
3. Ознакомиться с `CURRENT_SPRINT.md`.
4. Подтвердить понимание текущего состояния проекта.
5. Назвать файлы, которые предполагается изменить.
6. Только после этого приступать к реализации.

Данный документ является основным источником информации о текущем техническом состоянии проекта.
