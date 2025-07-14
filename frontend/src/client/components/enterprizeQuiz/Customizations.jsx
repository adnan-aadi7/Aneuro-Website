import React, { useState } from "react";
import { ChevronDown, Pipette } from "lucide-react";

const CYAN = "#2de0fb";

const Customizations = () => {
  const [primaryColor, setPrimaryColor] = useState("#2DD1D1");
  const [secondaryColor, setSecondaryColor] = useState("#FF6B35");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [borderColor, setBorderColor] = useState("#2DD1D1");
  const [showCustomPicker, setShowCustomPicker] = useState(null);

  const colorOptions = [
    "#2DD1D1", // cyan
    "#FF6B35", // orange
    "#FFD23F", // yellow
    "#9B59B6", // purple
  ];

  const ColorSection = ({ title, selectedColor, onColorChange, sectionId }) => (
    <div className="mb-1">
      <h3 className="text-gray-300 text-sm mb-0.5">{title}</h3>
      <div className="flex items-center gap-1 justify-between">
        <div className="flex gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              className={`w-8 h-8  relative border ${
                selectedColor === color
                  ? "border-[#12DCF0]"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            >
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <button
            className="border border-[#12DCF0] text-gray-300 px-2 py-1 text-sm flex flex-row items-center gap-2 hover:bg-gray-600 transition-colors whitespace-nowrap ml-auto"
            onClick={() =>
              setShowCustomPicker(
                showCustomPicker === sectionId ? null : sectionId
              )
            }
          >
            Select custom color
            <ChevronDown className="w-4 h-4" />
          </button>
          {showCustomPicker === sectionId && (
            <div className="absolute top-full mt-1 left-0 z-10 bg-gray-800 border border-gray-600  p-2 shadow-lg">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-32 h-8 rounded border-none cursor-pointer"
              />
              <div className="mt-2 text-xs text-gray-400">
                Click to select a custom color
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ColorSlider = ({ label, value, onChange, color, isHue = false }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className="text-gray-300 text-sm">
          {isHue ? `${value}°` : `${value}%`}
        </span>
      </div>
      <div className="relative">
        <div
          className="w-full h-2 "
          style={{
            background: isHue
              ? "linear-gradient(to right, #ff0000 0%, #ffff00 16.67%, #00ff00 33.33%, #00ffff 50%, #0000ff 66.67%, #ff00ff 83.33%, #ff0000 100%)"
              : `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #374151 ${value}%, #374151 100%)`,
          }}
        />
        <input
          type="range"
          min="0"
          max={isHue ? "360" : "100"}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 w-full h-2  appearance-none cursor-pointer bg-transparent"
          style={{
            background: "transparent",
          }}
        />
        <div
          className="absolute top-0 w-4 h-4 bg-white rounded-full shadow-lg -mt-1 pointer-events-none border border-gray-300 transition-all duration-200"
          style={{
            left: `calc(${isHue ? (value / 360) * 100 : value}% - 8px)`,
          }}
        />
      </div>
    </div>
  );

  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(44);
  const [lightness, setLightness] = useState(60);

  return (
    <div
      className="w-full mx-auto p-8 bg-[#2A2A39] mt-3"
      style={{ boxShadow: `inset 0 0 20px 0 ${CYAN}80` }}
    >
      <div className=" text-white  font-sans">
        {/* Primary Color Section */}
        <div className="mb-6 border border-gray-600 rounded p-2">
          <h3 className="text-gray-300 text-sm mb-1">Primary button color</h3>
          <div className="flex items-center gap-32 mb-2">
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded relative border ${
                    primaryColor === color
                      ? "border-[#12DCF0]"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setPrimaryColor(color)}
                >
                  {primaryColor === color && (
                    <div className="absolute inset-0 flex items-center justify-center border">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="relative w-full">
              <button
                className=" border border-[#12DCF0] text-gray-300 px-2 py-1 ml-5 text-sm flex items-center gap- hover:bg-gray-600 transition-colors "
                onClick={() =>
                  setShowCustomPicker(
                    showCustomPicker === "primary" ? null : "primary"
                  )
                }
              >
                Select custom color
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Move sliders below custom color picker */}
              {showCustomPicker === "primary" && (
                <div className="bg-gray-800 border border-gray-600 p-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32 h-8 rounded border-none cursor-pointer"
                  />
                </div>
              )}
              {/* Color Sliders */}
              <div className="">
                <ColorSlider
                  value={hue}
                  onChange={setHue}
                  color={`hsl(${hue}, 100%, 50%)`}
                  isHue={true}
                />
              </div>
              {/* Saturation Slider */}
              <div className="">
                <ColorSlider
                  value={saturation}
                  onChange={setSaturation}
                  color={`hsl(${hue}, 100%, 50%)`}
                />
              </div>
            </div>
          </div>

          {/* Color Info */}
          <div className="flex items-center gap-1 border border-gray-600">
            <div className="flex items-center gap-2">
              <button className="  border-[#12DCF0] text-gray-300 px-3 py-1 text-sm hover:bg-gray-600 transition-colors ">
                Hex
                <ChevronDown className="w-3 h-3 ml-1 inline" />
              </button>
              <span className="text-gray-300 text-sm font-mono">#211D1D</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-300 text-sm">100%</span>
              <Pipette className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Secondary Color Section */}
        <div className="border border-gray-600 rounded p-2 mb-2">
          <ColorSection
            title="Secondary button color"
            selectedColor={secondaryColor}
            onColorChange={setSecondaryColor}
            sectionId="secondary"
          />
        </div>

        {/* Text Color Section */}
        <div className="border border-gray-600 rounded p-2 mb-2">
          <ColorSection
            title="Text Color"
            selectedColor={textColor}
            onColorChange={setTextColor}
            sectionId="text"
          />
        </div>

        {/* Border Color Section */}
        <div className="border border-gray-600 rounded p-2 mb-2">
          <ColorSection
            title="Border color"
            selectedColor={borderColor}
            onColorChange={setBorderColor}
            sectionId="border"
          />
        </div>
      </div>
    </div>
  );
};

export default Customizations;
