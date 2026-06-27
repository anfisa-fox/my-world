"use client";

import { FormEvent, useState } from "react";

export default function StudioPage() {
  const [studioSecret, setStudioSecret] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setResult("Отправка...");

    try {
      const response = await fetch("/api/studio/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-studio-secret": studioSecret,
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      setResult(JSON.stringify(data, null, 2));

      if (data.success) {
        setTitle("");
        setContent("");
      }
    } catch {
      setResult("Ошибка запроса");
    }
  }

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "60px auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <h1>Creator Studio</h1>

      <p>Создание новой записи на Стене.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Studio Secret"
            value={studioSecret}
            onChange={(e) => setStudioSecret(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            placeholder="Название записи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <textarea
            placeholder="Текст записи"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{
              width: "100%",
              padding: 12,
            }}
          />
        </div>

        <button type="submit">Создать запись</button>
      </form>

      <pre
        style={{
          marginTop: 30,
          background: "#f4f4f4",
          padding: 16,
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </main>
  );
}