import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Проверка аутентификации для админских роутов
  if (request.nextUrl.pathname.startsWith('/adminbel')) {
    try {
      // Проверяем, что переменные окружения доступны
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') {
        const { createClient } = await import('@supabase/supabase-js')

        // Создаем Supabase клиент для middleware
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        // Получаем токен из cookies
        const token = request.cookies.get('sb-access-token')?.value ||
                     request.cookies.get('supabase-auth-token')?.value

        if (token) {
          // Проверяем действительность токена
          const { data: { user }, error } = await supabase.auth.getUser(token)

          if (error || !user) {
            // Перенаправляем на страницу входа если токен недействителен
            const loginUrl = new URL('/adminbel', request.url)
            return NextResponse.redirect(loginUrl)
          }
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      // В случае ошибки разрешаем доступ (компонент сам проверит аутентификацию)
    }
  }

  // Добавляем заголовки кэширования для статических ресурсов
  if (request.nextUrl.pathname.startsWith('/images/') ||
      request.nextUrl.pathname.startsWith('/_next/static/') ||
      request.nextUrl.pathname.startsWith('/favicon')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Добавляем заголовки кэширования для API данных
  if (request.nextUrl.pathname.startsWith('/api/firestore')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    response.headers.set('Vary', 'Accept-Encoding')
  }

  // Добавляем заголовки для страниц
  if (!request.nextUrl.pathname.startsWith('/api/') &&
      !request.nextUrl.pathname.startsWith('/_next/') &&
      !request.nextUrl.pathname.startsWith('/adminbel')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600')
    response.headers.set('Vary', 'Accept-Encoding')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/firestore/:path*',
    '/adminbel/:path*'
  ],
}
