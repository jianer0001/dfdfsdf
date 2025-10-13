<template>
  <div>
    <h1>文件上传与解析展示</h1>
    <FileUploader @parsed="onParsed" />
    <div v-if="parsedData">
      <h2>解析结果：</h2>
      <pre>{{ parsedData }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FileUploader from '../components/FileUploader.vue';

const parsedData = ref(null);
function onParsed(data) {
  parsedData.value = data;
}
</script>
