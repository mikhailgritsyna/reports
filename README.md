# 🚀 AdsPulse - Facebook Ads Analytics Platform

Полнофункциональная платформа для анализа Facebook Ads с умными рекомендациями.

## 📋 Структура проекта

```
adspulse/
├── server.js           # Node.js/Express backend
├── index.html          # Frontend (фронтенд)
├── package.json        # Dependencies
├── .env               # Environment variables
└── README.md          # This file
```

## 🔧 Локальное развертывание

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск сервера
```bash
npm start
```

Сервер запустится на `http://localhost:3000`

### 3. Откройте index.html в браузере
```bash
# На macOS
open index.html

# На Windows
start index.html

# На Linux
firefox index.html
```

---

## 🌐 Развертывание на Render (бесплатный хостинг)

### Шаг 1: Подготовка GitHub репозитория

1. Создайте репозиторий на GitHub: https://github.com/new
2. Скопируйте туда все файлы:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ-ЮЗЕР/adspulse.git
   git push -u origin main
   ```

### Шаг 2: Развертывание на Render

1. Перейдите на https://render.com
2. Нажмите **"New +"** → **"Web Service"**
3. Выберите ваш GitHub репозиторий
4. Заполните форму:
   - **Name**: `adspulse-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Нажмите **"Create Web Service"**

Render автоматически развернет ваше приложение и выдаст URL: `https://adspulse-backend.onrender.com`

### Шаг 3: Обновите URL в index.html

В файле `index.html` найдите строку:
```javascript
const API_URL = 'https://adspulse-backend.onrender.com/api';
```

Замените на ваш актуальный URL с Render.

---

## 💡 Как использовать

1. **Откройте сайт** `index.html` в браузере
2. **Вставьте API Token** (получить на https://developers.facebook.com/)
3. **Вставьте Account ID** (найти в Facebook Ads Manager)
4. **Нажмите "Завантажити дані"** 📊

Сервер получит данные и выведет:
- ✅ Таблицу со всеми кампаниями
- ✅ Ключевые метрики (витрати, клики, CPL и т.д.)
- ✅ Умные рекомендации для оптимизации

---

## 🔐 Безопасность

- ✅ Все данные обрабатываются на сервере
- ✅ API Token передается только по HTTPS
- ✅ Нет логирования или сохранения токенов
- ✅ Локальная обработка данных

---

## 📱 API Endpoints

### POST `/api/campaigns`

Получить данные по кампаниям

**Request:**
```json
{
  "token": "EAAT9fwrS3p8...",
  "accountId": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "...",
        "name": "Campaign Name",
        "spend": 62.73,
        "clicks": 325,
        "impressions": 33308,
        "leads": 6,
        "ctr": 0.87,
        "cpm": 2.22,
        "cpc": 0.19,
        "cpl": 10.46
      }
    ],
    "totals": {
      "spend": 1000.50,
      "clicks": 5000,
      "leads": 150,
      "avgCPL": 6.67
    }
  }
}
```

### GET `/health`

Проверить статус сервера

---

## 🆘 Решение проблем

**Ошибка: "CORS Error"**
- Убедитесь, что используете сервер (не открываете index.html напрямую из файла)

**Ошибка: "Invalid token or account ID"**
- Проверьте, что токен не истек
- Проверьте Account ID (должен быть в формате `act_1234567890` или просто `1234567890`)

**Ошибка: "Failed to fetch data"**
- Проверьте интернет соединение
- Убедитесь, что сервер запущен

---

## 📈 Дальнейшие улучшения

- [ ] Поддержка нескольких аккаунтов
- [ ] История анализов
- [ ] Сравнение периодов
- [ ] Экспорт в PDF
- [ ] Автоматические еженедельные отчеты

---

## 📞 Поддержка

Если возникли вопросы или ошибки, проверьте:
1. Консоль браузера (F12 → Console)
2. Логи Render (если развернуто там)
3. Статус сервера в `/health`

---

**Успехов в анализе Facebook Ads! 🚀**
