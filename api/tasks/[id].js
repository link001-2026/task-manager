const { getSupabaseClient, parseBody } = require('../_utils');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  const supabase = getSupabaseClient();

  // PATCH：切换任务完成状态
  if (req.method === 'PATCH') {
    let body;
    try {
      body = await parseBody(req);
    } catch (err) {
      return res.status(400).json({ error: '请求体格式错误' });
    }

    const { completed } = body;
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  // DELETE：删除任务
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: '不支持的请求方法' });
};
