const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

// 单例模式获取 Supabase 客户端
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }
  return supabaseClient;
}

// 手动解析请求体（Vercel 原生 Node 函数无自动 body 解析）
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('JSON格式错误'));
      }
    });
    req.on('error', reject);
  });
}

module.exports = { getSupabaseClient, parseBody };
