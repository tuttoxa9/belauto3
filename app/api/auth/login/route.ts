import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    console.log('🔐 Попытка серверной аутентификации для:', email)

    // Создаем клиент Supabase на сервере
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Ошибка серверной аутентификации:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.log('✅ Успешная серверная аутентификация')

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      },
      session: data.session
    })

  } catch (error) {
    console.error('💥 Критическая ошибка серверной аутентификации:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
