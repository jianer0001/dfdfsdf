export async function onRequestPost(context) {
    // 创建一个对象来存储 JIAN 的属性
    let jianProperties = {};
    let jianMethods = [];
    
    // 打印 context.env.JIAN 对象的所有属性，包括不可枚举的属性
    try {
        // 获取所有属性（包括不可枚举的属性）
        const allProps = Object.getOwnPropertyNames(context.env.JIAN || {});

        
        // 获取 Symbol 属性
        const symbolProps = Object.getOwnPropertySymbols(context.env.JIAN || {});

        
        // 收集所有属性值
        for (const prop of allProps) {
            try {
                const descriptor = Object.getOwnPropertyDescriptor(context.env.JIAN, prop);
                if (descriptor) {
                    if (descriptor.get) {
                        // 如果是 getter，尝试调用它
                        jianProperties[prop] = context.env.JIAN[prop];
                    } else {
                        const value = context.env.JIAN[prop];
                        // 检查是否为方法
                        if (typeof value === 'function') {
                            jianMethods.push(prop);
                        }
                        // 直接获取值
                        jianProperties[prop] = value;
                    }
                    console.log(`context.env.JIAN[${prop}]:`, jianProperties[prop]);
                }
            } catch (e) {
                jianProperties[prop] = `Cannot access value - ${e.message}`;
                console.log(`context.env.JIAN[${prop}]: Cannot access value -`, e.message);
            }
        }
        
        // 处理 Symbol 属性
        for (const sym of symbolProps) {
            try {
                const value = context.env.JIAN[sym];
                if (typeof value === 'function') {
                    jianMethods.push(sym.toString());
                }
                jianProperties[sym.toString()] = value;
                console.log(`context.env.JIAN[${sym.toString()}]:`, jianProperties[sym.toString()]);
            } catch (e) {
                jianProperties[sym.toString()] = `Cannot access value - ${e.message}`;
                console.log(`context.env.JIAN[${sym.toString()}]: Cannot access value -`, e.message);
            }
        }
        
        // 使用 for...in 检查原型链上的属性
        for (const prop in context.env.JIAN) {
            if (!(prop in jianProperties)) { // 避免重复
                try {
                    const value = context.env.JIAN[prop];
                    if (typeof value === 'function' && !jianMethods.includes(prop)) {
                        jianMethods.push(prop);
                    }
                    jianProperties[prop] = value;
                    console.log(`context.env.JIAN[${prop}] (from prototype chain):`, jianProperties[prop]);
                } catch (e) {
                    jianProperties[prop] = `Cannot access value - ${e.message}`;
                    console.log(`context.env.JIAN[${prop}] (from prototype chain): Cannot access value -`, e.message);
                }
            }
        }
        
        // 检查是否具有常见的 Service Binding 属性
        console.log('context.env.JIAN has fetch:', typeof context.env.JIAN?.fetch);
        console.log('context.env.JIAN has get:', typeof context.env.JIAN?.get);
        console.log('context.env.JIAN has put:', typeof context.env.JIAN?.put);
        
        // 打印所有方法名
        console.log('context.env.JIAN methods:', jianMethods);
    } catch (logError) {
        console.error('Error logging JIAN object:', logError);
        jianProperties.error = `Error logging JIAN object: ${logError.message}`;
        jianMethods = [];
    }

    let result0;
    let jian = 'jian';
    
    try {
        result0 = await context.env.JIAN.fetch('https://guanhen.821330378.workers.dev/test/jian', { method: 'GET' });
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
            errorStr: JSON.stringify({
                message: error.message,
                stack: error.stack,
                name: error.name
            }),
            errorStr1 : error.toString(),

            service: typeof context.env.SERVICE
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
        jianProperties,
        jianMethods,
        result0: processedResult0
    }, null, 2), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}
