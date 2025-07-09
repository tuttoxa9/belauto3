"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupabaseDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    const results: any = {
      timestamp: new Date().toISOString(),
      config: {},
      tests: {}
    }

    // Проверяем конфигурацию
    results.config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)
    }

    try {
      // Тест 1: Проверка сессии
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      results.tests.session = {
        success: !sessionError,
        error: sessionError?.message,
        hasSession: !!sessionData.session
      }

      // Тест 2: Проверка подключения к базе данных
      const { data: dbData, error: dbError } = await supabase
        .from('cars')
        .select('count')
        .limit(1)
      results.tests.database = {
        success: !dbError,
        error: dbError?.message,
        data: dbData
      }

      // Тест 3: Проверка storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .list('', { limit: 1 })
      results.tests.storage = {
        success: !storageError,
        error: storageError?.message
      }

    } catch (error) {
      results.tests.criticalError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }

    setDiagnostics(results)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (success: boolean | undefined) => {
    if (success === undefined) return "🔍"
    return success ? "✅" : "❌"
  }

  if (!diagnostics) return null

  return (
    <Card className="mb-6 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🔍 Диагностика Supabase
          <Button
            onClick={runDiagnostics}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? "Проверка..." : "Обновить"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Конфигурация:</h4>
          <div className="text-sm space-y-1">
            <div>URL: {diagnostics.config.url}</div>
            <div>Ключ: {diagnostics.config.hasAnonKey ? "✅ Есть" : "❌ Отсутствует"}</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Тесты подключения:</h4>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnostics.tests.session?.success)}
              <span>Сессия: </span>
              {diagnostics.tests.session?.success ? "OK" : diagnostics.tests.session?.error}
            </div>

            <div className="flex items-center gap-2">
              {getStatusIcon(diagnostics.tests.database?.success)}
              <span>База данных: </span>
              {diagnostics.tests.database?.success ? "OK" : diagnostics.tests.database?.error}
            </div>

            <div className="flex items-center gap-2">
              {getStatusIcon(diagnostics.tests.storage?.success)}
              <span>Storage: </span>
              {diagnostics.tests.storage?.success ? "OK" : diagnostics.tests.storage?.error}
            </div>

            {diagnostics.tests.criticalError && (
              <div className="p-3 bg-red-100 border border-red-300 rounded">
                <div className="font-semibold text-red-700">Критическая ошибка:</div>
                <div className="text-red-600 text-xs">{diagnostics.tests.criticalError.message}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
