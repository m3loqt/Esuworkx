"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

export default function FileDropzone({
  name,
  accept = "image/*",
  multiple = false,
  required = false,
}: {
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  function updatePreview(files: FileList | null) {
    setFileNames(files ? Array.from(files).map((f) => f.name) : []);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (inputRef.current && files.length > 0) {
      inputRef.current.files = files;
      updatePreview(files);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        required={required}
        onChange={(e: ChangeEvent<HTMLInputElement>) => updatePreview(e.target.files)}
        style={{ display: "none" }}
      />
      <div
        className={`dropzone${dragActive ? " dropzone_active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p className="dropzone_text">
          {fileNames.length > 0
            ? `Drag ${multiple ? "new files to replace them" : "a new file to replace it"}, or`
            : `Drag ${multiple ? "files" : "a file"} to upload, or`}
        </p>
        <button
          type="button"
          className="dropzone_btn"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {fileNames.length > 0 ? `Replace File${multiple ? "s" : ""}` : `Choose File${multiple ? "s" : ""}`}
        </button>
        {fileNames.length > 0 && (
          <p className="dropzone_filenames">✓ Attached: {fileNames.join(", ")}</p>
        )}
      </div>
    </div>
  );
}
