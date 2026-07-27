# Референсы оформления (что взяли и почему)

Сайт и `resume.html` **не копируют** твой текст блоками «как в Telegram».
Текст сжат и переписан; layout — по паттернам сильных резюме/портфолио.

## Резюме (ATS + человек)

| Референс | Что полезного | Как у нас |
|----------|---------------|-----------|
| [Harvard CR resume guide](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/) | 1 колонка, чёткие секции, сканируемость | `resume.html`: header → Summary → Skills → Experience → Projects |
| Jake's Resume (Overleaf classic) | Имя крупно по центру, линия-разделитель, даты справа | `.rs-header` + `.role-meta` dates right |
| Tech resume practice | Skills **по категориям** одной строкой, не wall of text | Support / Systems / Network / Dev / AI |
| ATS rules | Без таблиц, skill bars, колонок, иконок в PDF | Чистые bullets, Arial-safe font stack |

**Правила топ-резюме, которые соблюдаем:**
1. 1 страница, плотно, но с воздухом  
2. Summary 3–4 строки, не эссе  
3. Skills = ключевые слова для ATS, сгруппированные  
4. Experience = роль + компания + даты + 2–4 bullets с действием  
5. Projects с **ссылками** (Play Store, GitHub, demo)  
6. Без эмодзи и «декора» в PDF-версии  

## Портфолио (web)

| Референс | Что полезного | Как у нас |
|----------|---------------|-----------|
| [Brittany Chiang](https://brittanychiang.com/) | Sticky left rail, навигация, спокойный accent | `.rail` + `.main` |
| [Dopefolio / developerFolio](https://github.com/topics/portfolio-website) | Hero/about + project cards + stack tags | `.cards` + `.pills` |
| Colorlib / Hostinger portfolio roundups | Проекты с внешней ссылкой, не список абзацев | TimePay → Play Store ↗ |
| Minimal GitHub Pages ports | Тёмная тема, serif name + sans body | Instrument Serif + DM Sans |

**Антипаттерн (что убрали):**
- Стена текста «О себе» из 6 абзацев  
- 6 одинаковых skill-карточек с перечислением всего подряд  
- Soft skills на 12 чипов (рекрутер не читает)  
- Проекты без ссылок  

## TimePay

- Play: https://play.google.com/store/apps/details?id=com.vital.mypayday&hl=ru  
- В шапке портфолио: карточка **01** с outbound link  

## Steam Workshop

В сообщении дважды пришла **та же** ссылка на Play Store.  
Когда будет реальный URL Steam Workshop — добавим отдельной карточкой.
