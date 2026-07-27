# Портфолио — Еременко Виталий

Статический сайт-портфолио + ATS-резюме для **GitHub Pages**.

- Главная: `index.html` — hero, опыт, навыки, проекты, контакты  
- Резюме: `resume.html` — печать / сохранение в PDF (Ctrl+P → «Сохранить как PDF»)

## Локальный просмотр

Открой `index.html` в браузере или:

```powershell
cd C:\Users\vital\portfolio
python -m http.server 5500
```

Сайт: http://127.0.0.1:5500

## Деплой на GitHub Pages

### 1. Установи Git (если ещё нет)

- https://git-scm.com/download/win  
- или: `winget install Git.Git`

### 2. Создай репозиторий на GitHub

Вариант **A — персональный сайт** (рекомендуется):

- Имя репо: `ТВОЙ_USERNAME.github.io`  
- URL сайта: `https://ТВОЙ_USERNAME.github.io`

Вариант **B — project site**:

- Любое имя, например `portfolio`  
- URL: `https://ТВОЙ_USERNAME.github.io/portfolio/`

### 3. Залей код

```powershell
cd C:\Users\vital\portfolio
git init
git add .
git commit -m "Initial portfolio and resume site"
git branch -M main
git remote add origin https://github.com/ТВОЙ_USERNAME/ТВОЙ_USERNAME.github.io.git
git push -u origin main
```

### 4. Включи Pages

GitHub → репозиторий → **Settings** → **Pages**:

- Source: **Deploy from a branch**
- Branch: `main` / folder: `/ (root)`
- Save

Через 1–2 минуты сайт будет онлайн.

### 5. (Опционально) ссылка на GitHub в шапке

В консоли браузера на сайте:

```js
localStorage.setItem("github_user", "ТВОЙ_USERNAME");
location.reload();
```

Или поправь `script.js` / `index.html` вручную.

## Кастомизация

| Файл | Что менять |
|------|------------|
| `index.html` | тексты, проекты, контакты |
| `resume.html` | содержимое резюме |
| `styles.css` | цвета, шрифты, layout |
| `script.js` | меню, GitHub username |

## Контакты

- Email: vitalik-eremenko@bk.ru  
- Тел: +7 (999) 639-29-93  
- Краснодар · удалённо
