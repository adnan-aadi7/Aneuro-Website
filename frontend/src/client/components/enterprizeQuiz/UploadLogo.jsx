import React, { useEffect, useState } from "react";
import logo from "../../../assets/auth/logo.png";
import { UploadCloud } from "lucide-react";

const defaultVariants = [
  { id: 1, src: logo, bg: "bg-transparent" },
  { id: 2, src: logo, bg: "bg-[#181820]" },
  { id: 3, src: logo, bg: "bg-[#233136]" },
];

export default function UploadLogo({ setLogo }) {
  const [selected, setSelected] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);   // File
  const [uploadedPreview, setUploadedPreview] = useState(""); // object URL

  useEffect(() => {
    return () => {
      if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
    };
  }, [uploadedPreview]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // cleanup previous preview
    if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);

    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    setUploadedPreview(url);
    setSelected(4);

    // IMPORTANT: send the File to parent so it can be appended to FormData
    setLogo(file);
  };

  const variants = uploadedPreview
    ? [...defaultVariants, { id: 4, src: uploadedPreview, bg: "bg-transparent" }]
    : defaultVariants;

  const CYAN = "#2de0fb";

  return (
    <div
      className="bg-[#2A2A39] p-8 w-full mx-auto border border-[#2de0fb33] shadow-lg relative"
      style={{ boxShadow: `inset 0 0 20px 0 ${CYAN}80` }}
    >
      <h2 className="text-white text-2xl font-medium mb-8">
        Selected Logo Type And Variants
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Logo Variants */}
        <div className="flex gap-2 mb-6 md:mb-0 w-full md:w-auto justify-center md:justify-start">
          {variants.map((variant) => (
            <button
              type="button"
              key={variant.id}
              className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center ${
                variant.bg
              } ${
                selected === variant.id
                  ? "border border-[#12DCF0]"
                  : "border border-[#23232b]"
              }`}
              onClick={() => {
                setSelected(variant.id);
                // Picking a preset variant → clear uploaded file and send nothing new
                if (variant.id !== 4) {
                  setUploadedFile(null);
                  // parent will still have last File (if any); if you want to force “no file”, do:
                  // setLogo(null);
                }
              }}
            >
              <img
                src={variant.src}
                alt="Logo variant"
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
              {selected === variant.id && (
                <span className="absolute top-2 right-2 bg-[#23232b] rounded-full p-1">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <rect width="20" height="20" rx="6" fill="#12DCF0" fillOpacity="0.15" />
                    <path
                      d="M6 10.5l3 3 5-5"
                      stroke="#12DCF0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div className="flex flex-col items-center md:items-end justify-center w-full md:w-auto self-end md:self-end md:ml-auto">
          <label
            htmlFor="logo-upload"
            className="p-3 flex flex-col items-center justify-center border-2 border-dashed border-[#12DCF0] cursor-pointer transition"
          >
            <UploadCloud className="mb-2" size={40} color="#12DCF0" strokeWidth={2.5} />
            <span className="text-white text-sm font-medium">Drop file or browse</span>
            <input
              id="logo-upload"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
          <span className="text-gray-400 text-[8px] mt-2">
            Format: .jpeg, .png & Max file size: 25 MB
          </span>
        </div>
      </div>
    </div>
  );
}
