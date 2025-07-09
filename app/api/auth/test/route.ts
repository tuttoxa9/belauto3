import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Проверяем подключение к Supabase
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Ошибка подключения к Supabase',
        error: error.message
      }, { status: 500 })
    }

    // Проверяем, что переменные окружения корректны
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasValidUrl = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co'

    return NextResponse.json({
      status: 'success',
      message: 'Подключение к Supabase работает',
      config: {
        hasValidUrl,
        urlConfigured: !!supabaseUrl,
        hasSession: !!data.session
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Критическая ошибка',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
}
