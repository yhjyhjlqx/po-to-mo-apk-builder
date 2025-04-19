export default function ApkConfigForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('build_type', 'apk');
    formData.append('main', e.target.main.files[0]);
    fetch('/api/trigger', { method: 'POST', body: formData });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="main" required accept=".java,.kt" />
      <button type="submit">Build APK</button>
    </form>
  );
}
