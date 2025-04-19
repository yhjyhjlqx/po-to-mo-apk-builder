export default async (req, res) => {
  const response = await fetch(
    'https://api.github.com/repos/yhjyhjlqx/po-to-mo-apk-builder/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json'
      },
      body: JSON.stringify({
        event_type: 'build-apk',
        client_payload: req.body
      })
    }
  );
  res.status(response.status).json(await response.json());
};
