"use client";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

export default function Home() {
  const [caption, setCaption] = useState("");

  const handleChange = async (file: File | File[]) => {
    const selected = Array.isArray(file) ? file[0] : file;

    const formData = new FormData();
    formData.append("file", selected);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setCaption(data.caption);
  };

  return (
    <div>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />

      {caption && (
        <p className="mt-4 text-lg font-semibold">Caption: {caption}</p>
      
      )}
    </div>
  );
}
