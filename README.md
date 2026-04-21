# София — приглашение на выставку «Под маской»

Премиальная одностраничная invitation page в тёмной кинематографичной эстетике.

## Быстрый запуск

Так как проект статический, достаточно открыть `index.html` в браузере.

Для корректной работы аудио лучше поднять локальный сервер:

```bash
python3 -m http.server 4173
```

Далее откройте `http://localhost:4173`.

## Где менять контент

Всё вынесено в `script.js` в объект `invitationConfig`:

- Имя девушки: `profile.name`
- Дата: `profile.date`
- Название выставки: `profile.exhibition`
- Место: `profile.venue`
- Ссылка после согласия: `profile.responseLink`
- Музыкальный файл: `profile.musicPath`
- Тексты: `copyVariants` + `activeVariant`
- Финальная фраза: `copyVariants.<variant>.confirmation`

## Музыка

В репозитории нет бинарных аудиофайлов (это сделано специально).

Чтобы добавить трек локально:
1. Положите файл в `assets/audio/` (например, `assets/audio/atmosphere.mp3`)
2. Обновите путь в `invitationConfig.profile.musicPath`

## Структура

- `index.html` — разметка и секции
- `styles.css` — визуальный стиль, анимации, адаптив
- `script.js` — конфиг, сценарии интро/музыки/CTA
- `assets/audio/` — аудио
