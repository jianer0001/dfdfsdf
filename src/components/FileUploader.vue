<template>
  <div>
    <input type="file" @change="handleFileUpload" />
  </div>
</template>

<script setup>
import { parseFile } from '../api/workerApi';
const emit = defineEmits(['parsed']);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const result = await parseFile(e.target.result);
    emit('parsed', result);
  };
  reader.readAsArrayBuffer(file);
}
</script>
