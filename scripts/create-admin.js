const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function createAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Переменные окружения не найдены!')
    console.log('Убедитесь, что .env.local содержит:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=...')
    console.log('SUPABASE_SERVICE_ROLE_KEY=...')
    return
  }

  console.log('🔗 Подключение к Supabase:', supabaseUrl)

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Создаем админ пользователя
  const adminEmail = 'admin@belauto.by'
  const adminPassword = 'admin123456'

  try {
    console.log('👤 Создание администратора...')

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    })

    if (error) {
      console.error('❌ Ошибка создания пользователя:', error.message)
      return
    }

    console.log('✅ Администратор успешно создан!')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Пароль:', adminPassword)
    console.log('🆔 ID:', data.user.id)
    console.log('')
    console.log('Теперь вы можете войти в админ панель по адресу /adminbel')

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message)
  }
}

createAdmin()
