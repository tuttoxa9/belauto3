# 🔐 Настройка аутентификации в Supabase для Belauto3

## 1. Создание проекта в Supabase

1. **Войдите в [supabase.com](https://supabase.com)**
2. **Создайте новый проект:**
   - Organization: выберите вашу организацию
   - Name: `belauto3` или любое другое имя
   - Database Password: сгенерируйте сильный пароль
   - Region: выберите ближайший к Беларуси (Europe West)

## 2. Получение ключей API

После создания проекта перейдите в **Settings → API**:

```env
# Скопируйте эти значения в .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Создание базы данных

1. **Перейдите в SQL Editor**
2. **Выполните SQL схему:**
   ```bash
   # Скопируйте содержимое файла supabase/schema.sql
   # И выполните в SQL Editor
   ```

## 4. Создание администратора

### Вариант 1: Через Dashboard
1. **Authentication → Users → Invite user**
2. **Введите email администратора**
3. **Установите пароль**
4. **Confirm email**: отключите если тестируете локально

### Вариант 2: Через SQL
```sql
-- Создание пользователя-администратора
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@autobelcenter.by', -- Замените на ваш email
  crypt('your-password', gen_salt('bf')), -- Замените на ваш пароль
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  FALSE,
  '',
  '',
  '',
  ''
);
```

## 5. Настройка аутентификации

### В Supabase Dashboard:
1. **Authentication → Settings**
2. **Site URL**: `http://localhost:3000` (для разработки)
3. **Additional redirect URLs**: добавьте production URL
4. **Email settings**: настройте SMTP если нужно

### Отключение регистрации (только админы):
1. **Authentication → Settings**
2. **Enable email signups**: OFF
3. Теперь новых пользователей можно создавать только через Dashboard

## 6. Тестирование

1. **Запустите проект локально:**
   ```bash
   npm run dev
   ```

2. **Перейдите на `/adminbel`**

3. **Войдите с созданными учетными данными**

## 7. Настройка Production

1. **Обновите Site URL в Supabase:**
   - `https://your-domain.com`

2. **Добавьте production переменные окружения:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 8. Безопасность

✅ **Row Level Security (RLS)** уже настроен в схеме
✅ **Публичный доступ** только для чтения активных данных
✅ **Аутентифицированный доступ** для всех админских операций
✅ **Storage policies** для загрузки изображений

## Готово! 🎉

Аутентификация настроена и готова к использованию. Администраторы могут:
- Входить через `/adminbel`
- Управлять контентом
- Загружать изображения
- Просматривать заявки
