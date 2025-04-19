export default function UploadArea({ onUpload, accept }) {
  return (
    <div 
      onDrop={(e) => { e.preventDefault(); onUpload(e.dataTransfer.files); }}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById('file-input').click()}
    >
      <input id="file-input" type="file" accept={accept} hidden onChange={(e) => onUpload(e.target.files)} />
      <p>Click or drop files</p>
    </div>
  );
}
