import { useEffect, useState } from 'react';
import styles from '../styles/Animations.module.css';

export default function StatusPolling({ runId, onComplete }) {
  const [status, setStatus] = useState('pending');
  const [progress, setProgress] = useState(0);

  // ==================== 必须修改开始 ====================
  useEffect(() => {
    if (!runId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-status?run_id=${runId}`);
        const data = await res.json();
        
        // 状态处理逻辑
        if (data.status === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          onComplete?.(data);
        } else if (data.conclusion === 'failure') {
          clearInterval(interval);
          setStatus('failed');
        } else {
          // 进度模拟
          setProgress(prev => Math.min(prev + 10, 90));
        }
      } catch (error) {
        console.error('轮询错误:', error);
        clearInterval(interval);
        setStatus('error');
      }
    }, 3000); // 3秒轮询间隔

    return () => clearInterval(interval);
  }, [runId, onComplete]);
  // ==================== 必须修改结束 ====================

  return (
    <div className={styles.statusContainer}>
      {status === 'pending' && (
        <>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          <p>构建进度: {progress}%</p>
        </>
      )}
      {status === 'completed' && (
        <div className={styles.success}>
          ✅ 构建完成！<a href={status.artifacts_url} target="_blank">下载APK</a>
        </div>
      )}
      {status === 'failed' && (
        <div className={styles.error}>❌ 构建失败</div>
      )}
    </div>
  );
}
