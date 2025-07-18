# small‑js‑scripts‑2021‑2023 📚🗄️

[![GitHub stars](https://img.shields.io/github/stars/Shiro-nn/small-js-scripts-2021-2023?style=social)](https://github.com/Shiro-nn/small-js-scripts-2021-2023/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Shiro-nn/small-js-scripts-2021-2023?style=social)](https://github.com/Shiro-nn/small-js-scripts-2021-2023/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Shiro-nn/small-js-scripts-2021-2023)](https://github.com/Shiro-nn/small-js-scripts-2021-2023/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Shiro-nn/small-js-scripts-2021-2023)](https://github.com/Shiro-nn/small-js-scripts-2021-2023/commits)
[![License: MIT](https://img.shields.io/github/license/Shiro-nn/small-js-scripts-2021-2023)](LICENSE)
[![Status: Archived](https://img.shields.io/badge/status-archived-lightgrey.svg)](https://github.com/Shiro-nn/small-js-scripts-2021-2023)

![Repo Stats](https://github-readme-stats.vercel.app/api/pin/?username=Shiro-nn\&repo=small-js-scripts-2021-2023)

> **small‑js‑scripts‑2021‑2023** — это коллекция утилит и прототипов на Node.js/JavaScript, которые я писал для автоматизации разных повседневных задач. В марте 2025 года принято решение отправить репозиторий в **архив**: скрипты устарели, а некоторые зависят от закрытых API. Тем не менее код остаётся доступным в образовательных целях «как есть».

---

## 📂 Содержимое

| Директория              | Краткое назначение (одной строкой)                                                   |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `.rename`               | Два CLI‑скрипта для массового переименования файлов по шаблону.                      |
| `check-pays-fix`        | Проверка платежных статусов + утилита авто‑починки записей (логер в helpers).        |
| `check-pays-fix-server` | Express‑сервер, который оборачивает логику `check-pays-fix` в HTTP‑API.              |
| `DeepleFreeApi`         | Обёртка вокруг неофициального API Deepl Free (JSON‑ответы, обработка ошибок).        |
| `discord-proxy`         | Простой прокси на Express для обхода Discord‑лимитов (rate‑limit).                   |
| `fontsymbols`           | Генерация SVG‑шрифтов из символов + мини‑обфускатор.                                 |
| `mongobackups`          | Набор скриптов и «инсталлятор» для резервного копирования MongoDB на Windows.        |
| `nms`                   | Node Media Server + HTTPS‑сертификат (простой RTMP/WS сервер).                       |
| `node-prevent-sleep`    | N‑API аддон (C++/JS) для блокировки сна системы (Windows/Linux).                     |
| `parseIps`              | Слияние CSV‑баз GeoIP в одну и экспорт в MongoDB.                                    |
| `Proxy`                 | Менеджер прокси‑списков (TXT‑файл на вход, проверка, HTTP‑API на выход).             |
| `threatIpServer`        | Сервер‑агрегатор «опасных IP» с API и расширяемыми источниками.                      |
| `yandex-block`          | Локальный прокси, добавляющий блокировку Яндекс‑доменов (mitm‑сертификаты в `.crt`). |

> Файлы верхнего уровня (`LICENSE`, `README`, скрипты) опущены в таблице.

---

## 🚀 Запуск примера

Каждая папка — отдельный проект с собственным `package.json` или инструкциями. Общий паттерн:

```bash
# пример: запуск DeepleFreeApi
git clone https://github.com/Shiro-nn/small-js-scripts-2021-2023.git
cd small-js-scripts-2021-2023/DeepleFreeApi
npm install
node translate.js "Hello, world!" --to=ru
```

⚠️ Скрипты могут полагаться на устаревшие пакеты (Node 14‑16). Обновляйте зависимости на свой страх и риск.

---

## 🛠️ Что понадобится

* **Node.js 14‑18** (в зависимости от папки).
* Для `node-prevent-sleep` — компилятор C++ и Python 3 для сборки N‑API аддона.
* Для `mongobackups` — `mongodump` в PATH (Windows).

---

## 🤝 Вклад

Репозиторий **архивирован**. Я принимаю лишь минимальные PR‑ы, которые чинят сборку или устраняют критические уязвимости. Все новые фичи — только через ваш собственный fork.

---

## ⚖️ Лицензия

Исходники распространяются под лицензией **MIT**. Пользуйтесь свободно, но автор не гарантирует работоспособность скриптов в текущих версиях Node.js.

> Благодарю за интерес! Надеюсь, эти старые утилиты помогут вам разобраться с Node‑скриптами или вдохновят на собственные проекты.
