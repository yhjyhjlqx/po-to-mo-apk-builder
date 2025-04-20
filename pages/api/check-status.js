import { Octokit } from "@octokit/core";

export default async (req, res) => {
  // ==================== 必须修改开始 ====================
  if (!req.query.run_id) {
    return res.status(400).json({ error: '缺少run_id参数' });
  }
  // ==================== 必须修改结束 ====================

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    const { data } = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/runs/{run_id}',
      {
        owner: process.env.GITHUB_REPO.split('/')[0],
        repo: process.env.GITHUB_REPO.split('/')[1],
        run_id: req.query.run_id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28' // 必须添加
        }
      }
    );

    // ==================== 必须修改开始 ====================
    res.status(200).json({
      status: data.status, // queued|in_progress|completed
      conclusion: data.conclusion, // success|failure|cancelled
      artifacts_url: data.artifacts_url,
      html_url: data.html_url
    });
    // ==================== 必须修改结束 ====================
  } catch (error) {
    // ==================== 必须修改开始 ====================
    res.status(500).json({
      error: '获取状态失败',
      details: error.response?.data?.message || error.message
    });
    // ==================== 必须修改结束 ====================
  }
};
