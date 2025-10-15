import service from './http';

/**
 * 解析文件内容
 * @param {File} file - 要上传和解析的文件对象
 * @returns {Promise<any>} 解析后的数据
 * @throws {Error} 当解析失败或参数无效时抛出错误
 */
export async function parseFile(file) {
  // 参数校验
  if (!file) {
    throw new Error('文件不能为空');
  }
  
  try {
    // 将文件数据包装在file字段中
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await service.post('/gh/file/parse1', formData);
    return response.data;
  } catch (error) {
    // 提供更有意义的错误信息
    throw new Error(`文件解析失败: ${error.message}`);
  }
}