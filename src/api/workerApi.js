import service from './http';

/**
 * 解析文件内容
 * @param {ArrayBuffer|Buffer} fileBuffer - 文件的二进制数据
 * @returns {Promise<any>} 解析后的数据
 * @throws {Error} 当解析失败或参数无效时抛出错误
 */
export async function parseFile(fileBuffer) {
  // 参数校验
  if (!fileBuffer) {
    throw new Error('文件数据不能为空');
  }
  
  try {
    // 将文件数据包装在file字段中
    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append('file', blob);
    
    const response = await service.post('/gh/file/parse1', formData);
    return response.data;
  } catch (error) {
    // 提供更有意义的错误信息
    throw new Error(`文件解析失败: ${error.message}`);
  }
}