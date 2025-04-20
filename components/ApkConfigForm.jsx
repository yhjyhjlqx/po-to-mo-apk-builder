import { useState } from 'react';
import StatusPolling from './StatusPolling';

export default function ApkConfigForm() {
  const [runId, setRunId] = useState(null);
  const [file, setFile] = useState(null);

  // ==================== 必须修改开始 ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/trigger', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setRunId(data.run_id);
  };
  // ==================== 必须修改结束 ====================

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          accept=".java,.kt"
        />
        <button type="submit">开始构建</button>
      </form>
      
      {/* ==================== 必须修改开始 ==================== */}
      {runId && (
        <StatusPolling 
          runId={runId}
          onComplete={(data) => {
            console.log('构建完成:', data);
          }}
        />
      )}
      {/* ==================== 必须修改结束 ==================== */}
    </div>
  );
}
