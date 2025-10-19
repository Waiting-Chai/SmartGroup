import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 开发环境下使用模拟数据，避免网络请求错误
const isDevelopment = !supabaseUrl || supabaseUrl === 'https://demo.supabase.co';

let supabase: any;

if (isDevelopment) {
  // 创建一个模拟的Supabase客户端
  supabase = {
    from: (table: string) => ({
      select: (columns: string) => ({
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null })
        }),
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      })
    })
  };
} else {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
