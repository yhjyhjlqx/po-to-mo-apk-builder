const https = require('https');
const { execSync } = require('child_process');

const API_URL = process.env.VERCEL_URL || 'https://po-to-mo-apk-builder.vercel.app';

function checkApiEndpoint() {
  return new Promise((resolve) => {
    https.get(`${API_URL}/api/check-status`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'OK') {
            console.log('✅ API端点响应正常');
            resolve(true);
          } else {
            throw new Error('无效响应');
          }
        } catch (e) {
          console.error('❌ API端点验证失败:', e.message);
          resolve(false);
        }
      });
    }).on('error', (e) => {
      console.error('❌ 网络请求失败:', e.message);
      resolve(false);
    });
  });
}

async function verify() {
  try {
    console.log('🔍 开始验证部署...');
    
    // 检查基础命令
    execSync('which curl', { stdio: 'inherit' });
    
    // 验证API端点
    const apiValid = await checkApiEndpoint();
    
    if (!apiValid) {
      throw new Error('API验证未通过');
    }

    console.log('🎉 所有验证通过，部署成功！');
    process.exit(0);
  } catch (error) {
    console.error('🚨 验证失败:', error.message);
    process.exit(1);
  }
}

verify();
