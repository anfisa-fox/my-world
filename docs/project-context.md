# Project Context

## Project

Personal Creative World

Личный творческий мир юной художницы.

---

## Mission

Создать личное цифровое пространство, которое будет:

* творческим дневником;
* архивом развития;
* местом публикации работ;
* пространством для самовыражения.

Сайт создаётся прежде всего для автора, а не для внешней аудитории.

---

## Success Criteria

Через месяц после запуска автор продолжает пользоваться сайтом самостоятельно и публикует новый контент не реже одного раза в неделю.

Главный KPI проекта — регулярность использования.

---

## MVP Principles

### Content First

Контент важнее функциональности.

### Lean MVP

Минимум функций для быстрого запуска.

### Low Maintenance

Минимальные требования к сопровождению.

### CMS Ready

Автор должна иметь возможность самостоятельно управлять сайтом через визуальную CMS.

### Evolvable Architecture

Сайт должен развиваться без переписывания существующей архитектуры.

---

## MVP Sections

### Home

Главная страница.

### Gallery

Коллекция работ художницы.

### Characters

Собственные персонажи автора.

### Wall

Личный творческий дневник.

---

## Content Types

### Artwork

Рисунок или иллюстрация.

Ключевые поля:

* title
* image
* description
* tags
* period
* featured

### Character

Персонаж творческого мира.

Ключевые поля:

* name
* avatar
* description
* gallery

### Post

Запись на стене.

Ключевые поля:

* title
* content
* image

---

## Technical Stack

### Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS

### Content

* Markdown
* MDX (в будущем)

### CMS

* Decap CMS

### Hosting

* Cloudflare Pages

### Repository

* GitHub

---

## Current Architecture Decisions

### Content Storage

Контент хранится в Git-репозитории.

```text
content/
  artworks/
  characters/
  posts/
```

### Images

Изображения хранятся локально.

```text
public/images/
  artworks/
  characters/
  posts/
```

### Slugs

Slug определяется именем файла.

Пример:

```text
moon-girl.md → moon-girl
```

### Naming Convention

Используется только kebab-case.

---

## Development Environment

### Local Development

Локальная среда разработки использует фиксированный порт:

```text
http://localhost:3010
```

### NPM Commands

Запуск режима разработки:

```bash
npm run dev
```

Сборка проекта:

```bash
npm run build
```

Запуск production-сборки:

```bash
npm run start
```

### Port Convention

Порт 3010 является стандартным портом проекта.

Все локальные ссылки в документации, аудитах, тестовых сценариях и рабочих инструкциях должны использовать:

```text
http://localhost:3010
```

---

## Explicitly Out of Scope

* комментарии;
* реакции;
* поиск;
* регистрация;
* личные сообщения;
* форум;
* закрытые разделы;
* социальные механики;
* сложные связи между сущностями.

---

## Guiding Principle

Сайт должен расти вместе с автором.

Любое решение должно оцениваться через вопрос:

"Поможет ли это автору чаще публиковать творчество?"
