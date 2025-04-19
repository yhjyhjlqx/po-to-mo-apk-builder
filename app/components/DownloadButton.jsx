export default function DownloadButton({ runId }) {
  const handleDownload = () => {
    window.open(
      `https://github.com/yhjyhjlqx/po-to-mo-apk-builder/actions/runs/${runId}/artifacts`,
      '_blank'
    );
  };
  return <button onClick={handleDownload}>Download</button>;
}
