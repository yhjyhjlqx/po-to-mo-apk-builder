import * as Sentry from '@sentry/node';

Sentry.init({ 
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

export default async (req, res) => {
  const transaction = Sentry.startTransaction({
    op: "api.trigger",
    name: "Trigger APK Build"
  });

  try {
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify({
          event_type: 'build-apk',
          client_payload: {
            build_type: req.body.build_type,
            timestamp: new Date().toISOString()
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API响应异常: ${response.status}`);
    }

    res.status(202).json({ 
      status: 'pending',
      action_url: `https://github.com/${process.env.GITHUB_REPO}/actions`
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('触发构建失败:', error);
    
    res.status(500).json({ 
      error: '构建触发失败',
      details: error.message 
    });
  } finally {
    transaction.finish();
  }
};
