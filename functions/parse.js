
export async function onRequestPost(context) {
  const contentType = context.request.headers.get('content-type') || '';
  const arrayBuffer = await context.request.arrayBuffer();
  const size = arrayBuffer.byteLength;
  let result = {};

  try {
    if (contentType.includes('application/json')) {
      // 解析 JSON 文件
      const text = new TextDecoder().decode(arrayBuffer);
      result = {
        type: 'json',
        parsed: JSON.parse(text),
      };
    } else if (contentType.includes('text/csv')) {
      // 解析 CSV 文件（简单逗号分隔）
      const text = new TextDecoder().decode(arrayBuffer);
      const rows = text.split('\n').map(row => row.split(','));
      result = {
        type: 'csv',
        parsed: rows,
      };
    } else if (contentType.includes('text/plain')) {
      // 解析纯文本文件
      const text = new TextDecoder().decode(arrayBuffer);
      result = {
        type: 'text',
        parsed: text,
      };
    } else {
      // 其他类型只返回文件大小
      result = {
        type: 'binary',
        message: '不支持的文件类型，仅返回文件大小',
      };
    }
  } catch (e) {
    result = {
      error: '解析失败',
      detail: e.message,
    };
  }

  return new Response(JSON.stringify({
    size,
    contentType,
    result
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
