<template>
  <div>
    <!-- 文件上传输入框 -->
    <input type="file" @change="handleFileUpload" />
  </div>
</template>

<script setup>
import { parseFile } from '../api/workerApi';
// 定义组件事件发射器
const emit = defineEmits(['parsed']);

/**
 * 处理文件上传事件
 * @param {Event} event - 文件上传变化事件对象
 * @returns {void}
 */
function handleFileUpload(event) {
  // 获取选中的文件
  const file = event.target.files[0];
  // 如果没有选择文件则直接返回
  if (!file) return;
  // 创建文件读取器实例
  const reader = new FileReader();
  // 设置文件读取完成后的回调函数
  reader.onload = async (e) => {
    // 调用API解析文件内容
    const result = await parseFile(file);
    // 发送解析结果给父组件
    emit('parsed', result);
  };
  // 以ArrayBuffer格式读取文件内容
  reader.readAsArrayBuffer(file);
}
</script>