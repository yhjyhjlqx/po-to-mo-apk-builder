import { Octokit } from "@octokit/core";
export default async (req, res) => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const { data } = await octokit.request(
    `GET /repos/yhjyhjlqx/po-to-mo-apk-builder/actions/runs/${req.query.run_id}`
  );
  res.status(200).json({ status: data.status });
};
