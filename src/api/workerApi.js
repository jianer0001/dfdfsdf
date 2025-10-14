import service from './http';

export async function parseFile(fileBuffer) {
  const response = await service.post('/gh/file/parse1', fileBuffer, {
    // headers: { 'Content-Type': 'application/octet-stream' }
  });
  return response.data;
}
