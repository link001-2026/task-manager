const { getSupabaseClient, parseBody } = require('../_utils');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabaseClient();

  // GET：获取任务列表，支持优先级筛选，创建时间倒序
  if (req.method === 'GET') {
    const { filter } = req.query;
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter && filter !== '全部') {
      query = query.eq('priority', filter);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST：新增任务
  if (req.method === 'POST') {
    let body;
    try {
      body = await parseBody(req);
    } catch (err) {
      return res.status(400).json({ error: '请求体格式错误' });
    }

    const { title, priority } = body;
    if (!title || !priority) {
      return res.status(400).json({ error: '任务标题和优先级不能为空' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, priority }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  res.status(405).json({ error: '不支持的请求方法' });
};
