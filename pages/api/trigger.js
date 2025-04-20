import { Octokit } from "@octokit/core";

export default async (req, res) => {
  // ==================== 必须修改开始 ====================
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅允许POST请求' });
  }

  if (!req.body?.file) {
    return res.status(400).json({ error: '缺少file参数' });
  }
  // ==================== 必须修改结束 ====================

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    // ==================== 必须修改开始 ====================
    const { data } = await octokit.request(
      'POST /repos/{owner}/{repo}/dispatches',
      {
        owner: process.env.GITHUB_REPO.split('/')[0],
        repo: process.env.GITHUB_REPO.split('/')[1],
        event_type: 'run-heavy-task', // 必须与workflow的types完全一致
        client_payload: {
          file: req.body.file,
          build_time: new Date().toISOString()
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28' // 必须添加API版本头
        }
      }
    );
    // ==================== 必须修改结束 ====================

    res.status(202).json({
      status: 'pending',
      run_id: data.id,
      actions_url: `https://github.com/${process.env.GITHUB_REPO}/actions/runs/${data.id}`
    });
  } catch (error) {
    // ==================== 必须修改开始 ====================
    console.error('GitHub API错误:', error.message);
    res.status(500).json({
      error: '触发构建失败',
      details: error.response?.data?.message || error.message
    });
    // ==================== 必须修改结束 ====================
  }
};
