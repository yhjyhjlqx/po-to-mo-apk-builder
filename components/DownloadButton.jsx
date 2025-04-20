export default function DownloadButton({ url }) {
  return (
    <a href={url} download className="download-btn">
      Download APK
    </a>
  );
}
