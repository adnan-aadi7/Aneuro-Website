import React, { useEffect, useState } from "react";
import logo from "../../../assets/auth/logo.png";
import logo2 from "../../../assets/auth/logo2.png";
import logo3 from "../../../assets/auth/logo3.png";
import { UploadCloud } from "lucide-react";

// All tiles are transparent now (no extra bg tint)
const defaultVariants = [
  { id: 1, src: logo,  name: "logo-default" },
  { id: 2, src: logo2, name: "logo-variant-2" },
  { id: 3, src: logo3, name: "logo-variant-3" },
];

// helper: convert any image URL (including imported assets) into a File
async function urlToFile(url, fileBaseName = "logo") {
  const res = await fetch(url, { cache: "no-store" });
  const blob = await res.blob();
  const type = blob.type || "image/png";
  const ext = type.split("/")[1] || "png";
  return new File([blob], `${fileBaseName}.${ext}`, { type });
}

export default function UploadLogo({ setLogo }) {
  const [selected, setSelected] = useState(1);
  const [uploadedPreview, setUploadedPreview] = useState(""); // object URL

  // on mount: push the initially selected preset as a File to parent
  useEffect(() => {
    const initial = defaultVariants.find((v) => v.id === 1);
    if (!initial) return;
    (async () => {
      try {
        const file = await urlToFile(initial.src, initial.name);
        setLogo(file);
      } catch (e) {
        console.warn("Failed to convert initial preset logo:", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);
    };
  }, [uploadedPreview]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedPreview) URL.revokeObjectURL(uploadedPreview);

    const url = URL.createObjectURL(file);
    setUploadedPreview(url);
    setSelected(4); // uploaded tile

    // send the File to parent (so backend gets multipart)
    setLogo(file);
  };

  // merge presets + uploaded preview (if any)
  const variants = uploadedPreview
    ? [...defaultVariants, { id: 4, src: uploadedPreview, name: "uploaded-logo" }]
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
        {/* Logo Variants (transparent tiles, no extra background) */}
        <div className="flex gap-2 mb-6 md:mb-0 w-full md:w-auto justify-center md:justify-start">
          {variants.map((variant) => (
            <button
              type="button"
              key={variant.id}
              className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-transparent ${
                selected === variant.id
                  ? "border border-[#12DCF0]"
                  : "border border-[#23232b]"
              }`}
              onClick={async () => {
                setSelected(variant.id);

                if (variant.id === 4) {
                  // uploaded preview already set via handleUpload (File already sent)
                  return;
                }

                // picking a preset: ensure the backend receives a File
                try {
                  const file = await urlToFile(variant.src, variant.name || "preset-logo");
                  setLogo(file);
                } catch (e) {
                  console.warn("Failed to convert preset logo:", e);
                }
              }}
            >
              <img
                src={variant.src}
                alt={`Logo variant ${variant.id}`}
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
