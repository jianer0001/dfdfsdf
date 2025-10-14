export async function onRequestPost(context) {

/*    const url = new URL(context.request.url)
    const apiPrefix = '/api'
    const pathAfterApi = url.pathname.startsWith(apiPrefix)
        ? url.pathname.substring(apiPrefix.length)
        : url.pathname
*/
    let result0;
    let jian = 'jian';
    
    try {
        result0 = await context.env.SERVICE.fetch('/test/jian', { method: 'GET' });
        // 检查响应状态
        if (!result0.ok) {
            console.warn(`SERVICE fetch failed with status ${result0.status}`);
            result0 = {
                error: 'SERVICE fetch failed',
                status: result0.status
            };
        }
    } catch (error) {
        console.error('Failed to fetch from SERVICE:', error);
        // 在发生错误时设置错误信息
        result0 = {
            error: 'Failed to fetch from SERVICE',
            message: error.message,
            errorStr : JSON.stringify(error),
            service: JSON.stringify(context.env.SERVICE)
        };
    }

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

    // 处理 result0，如果是 Response 对象则获取其文本内容
    let processedResult0;
    if (result0 instanceof Response) {
        try {
            processedResult0 = await result0.text();
        } catch (e) {
            processedResult0 = 'Error reading response body';
        }
    } else {
        processedResult0 = result0;
    }

    return new Response(JSON.stringify({
        size,
        result,
        jian,
        result0: processedResult0
    }, null, 2), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}
