export default function UploadArea({ onFileSelect }) {
  return (
    <div 
      className="upload-zone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFileSelect(e.dataTransfer.files[0]);
      }}
    >
      <input 
        type="file" 
        id="file-upload" 
        hidden 
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
      <label htmlFor="file-upload">Drop file here</label>
    </div>
  );
}
