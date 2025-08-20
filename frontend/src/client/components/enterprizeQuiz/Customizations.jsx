import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Pipette } from "lucide-react";
import { HexColorPicker } from "react-colorful";

const CYAN = "#2de0fb";
const DEFAULT_POPOVER_WIDTH = 235;
const VIEWPORT_MARGIN = 8;

const Customizations = ({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  textColor,
  setTextColor,
  borderColor,
  setBorderColor,
}) => {
  const [openId, setOpenId] = useState(null);       // "primary" | "secondary" | "text" | "border" | null
  const [draftColor, setDraftColor] = useState(""); // buffers changes while popover open

  const colorOptions = ["#2DD1D1", "#FF6B35", "#FFD23F", "#9B59B6"];

  // ---------- portal + left-biased positioning ----------
  const usePopoverPosition = (isOpen, triggerRef, desiredWidth) => {
    const [pos, setPos] = useState({ top: 0, left: 0, width: desiredWidth || DEFAULT_POPOVER_WIDTH });

    useLayoutEffect(() => {
      const update = () => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();

        const width = desiredWidth || DEFAULT_POPOVER_WIDTH;

        // align RIGHT edges so extra width grows to the LEFT
        let left = r.right + window.scrollX - width;

        // clamp to viewport
        const minLeft = window.scrollX + VIEWPORT_MARGIN;
        const maxLeft = window.scrollX + window.innerWidth - VIEWPORT_MARGIN - width;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        const top = r.bottom + window.scrollY + 6;
        setPos({ top, left, width });
      };

      if (isOpen) {
        update();
        window.addEventListener("scroll", update, true);
        window.addEventListener("resize", update);
        return () => {
          window.removeEventListener("scroll", update, true);
          window.removeEventListener("resize", update);
        };
      }
    }, [isOpen, triggerRef, desiredWidth]);

    return pos;
  };

  const useOnClickOutside = (refs, handler, when = true) => {
    useEffect(() => {
      if (!when) return;
      const onClick = (e) => {
        const inAny = refs.some((r) => r.current && r.current.contains(e.target));
        if (!inAny) handler();
      };
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }, [refs, handler, when]);
  };

  // commit helper
  const commitDraft = (sectionId) => {
    if (!sectionId) return;
    const value = draftColor || "#000000";
    switch (sectionId) {
      case "primary":   setPrimaryColor(value);   break;
      case "secondary": setSecondaryColor(value); break;
      case "text":      setTextColor(value);      break;
      case "border":    setBorderColor(value);    break;
      default: break;
    }
  };

  const Popover = ({ isOpen, anchorRef, onClose, desiredWidth, children }) => {
    const pos = usePopoverPosition(isOpen, anchorRef, desiredWidth);
    const popRef = useRef(null);
    useOnClickOutside([popRef, anchorRef], onClose, isOpen);
    if (!isOpen) return null;

    return createPortal(
      <div
        ref={popRef}
        style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
        className="rounded-md border border-gray-600 bg-[#2A2A39] shadow-lg"
      >
        {children}
      </div>,
      document.body
    );
  };
  // ------------------------------------------------------

  const ColorSection = ({ title, selectedColor, onColorChange, sectionId }) => {
    const triggerRef = useRef(null);
    const canEyedrop = typeof window !== "undefined" && "EyeDropper" in window;

    // open/close logic that respects draft commit
    const togglePopover = () => {
      if (openId === sectionId) {
        // closing current → commit & close
        commitDraft(sectionId);
        setOpenId(null);
      } else if (openId) {
        // another popover is open → commit that first, then open this
        commitDraft(openId);
        setDraftColor(selectedColor || "#000000");
        setOpenId(sectionId);
      } else {
        // opening fresh → seed draft with current value
        setDraftColor(selectedColor || "#000000");
        setOpenId(sectionId);
      }
    };

    const handleClose = () => {
      // outside click close → commit
      commitDraft(sectionId);
      setOpenId(null);
    };

    const pickFromScreen = async () => {
      if (!canEyedrop) return;
      try {
        const eye = new window.EyeDropper();
        const { sRGBHex } = await eye.open();
        setDraftColor(sRGBHex); // draft only
      } catch {
        // cancelled or not available
      }
    };

    return (
      <div className="mb-1">
        <h3 className="text-gray-300 text-sm mb-0.5">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 justify-between">
          {/* Swatches (commit immediately) */}
          <div className="flex gap-3 flex-wrap justify-start">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 relative border ${selectedColor === color ? "border-[#12DCF0]" : "border-transparent"}`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              >
                {selectedColor === color && (
                  <span className="absolute top-0 right-0 mt-0.5 mr-0.5">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Trigger */}
          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <button
              ref={triggerRef}
              className="border border-[#12DCF0] text-gray-300 px-2 py-1 ml-0 sm:ml-5 text-sm flex items-center gap-2 hover:bg-gray-600 transition-colors whitespace-nowrap w-full sm:w-auto"
              onClick={togglePopover}
            >
              Select custom color
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Popover */}
            <Popover
              isOpen={openId === sectionId}
              anchorRef={triggerRef}
              onClose={handleClose}
              desiredWidth={DEFAULT_POPOVER_WIDTH}
            >
              <div className="p-2 pointer-events-auto">
                {/* preview bar */}
                <div
                  className="h-8 mb-2 border border-gray-700 rounded"
                  style={{ background: openId === sectionId ? (draftColor || "#000000") : (selectedColor || "#000000") }}
                />

                {/* picker bound to DRAFT */}
                <div className="bg-[#1F2130] p-2 rounded border border-gray-700">
                  <HexColorPicker
                    color={openId === sectionId ? (draftColor || "#000000") : (selectedColor || "#000000")}
                    onChange={setDraftColor}
                    className="w-full"
                  />

                  {/* HEX row */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400">HEX</span>
                    <input
                      value={(openId === sectionId ? (draftColor || "#000000") : (selectedColor || "#000000")).toUpperCase()}
                      onChange={(e) => setDraftColor(e.target.value)}
                      className="bg-[#141827] text-gray-200 text-xs px-2 py-1 rounded border border-gray-700 font-mono w-32"
                    />
                  </div>

                  {/* Buttons BELOW HEX */}
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={pickFromScreen}
                      disabled={!canEyedrop}
                      className={`text-xs px-2 py-1 rounded border ${
                        canEyedrop
                          ? "bg-slate-800 text-gray-200 hover:bg-slate-700 border-gray-700"
                          : "bg-slate-700 text-gray-500 border-gray-700 cursor-not-allowed"
                      } flex items-center gap-1`}
                      title={canEyedrop ? "Pick color from anywhere on screen" : "Eyedropper not supported in this browser"}
                    >
                      <Pipette className="w-3 h-3" />
                      Pick
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        commitDraft(sectionId);
                        setOpenId(null);
                      }}
                      className="text-xs px-2 py-1 rounded bg-slate-800 text-gray-200 hover:bg-slate-700 border border-gray-700"
                    >
                      Done
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-2">Click to select a custom color</div>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full mx-auto p-4 md:p-8 bg-[#2A2A39] mt-3 overflow-x-visible max-w-full"
      style={{ boxShadow: `inset 0 0 20px 0 ${CYAN}80` }}
    >
      <div className="text-white font-sans">
        <div className="border border-gray-600 p-2 mb-2">
          <ColorSection title="Primary button color"   selectedColor={primaryColor}   onColorChange={setPrimaryColor}   sectionId="primary" />
        </div>
        <div className="border border-gray-600 p-2 mb-2">
          <ColorSection title="Secondary button color" selectedColor={secondaryColor} onColorChange={setSecondaryColor} sectionId="secondary" />
        </div>
        <div className="border border-gray-600 p-2 mb-2">
          <ColorSection title="Text Color"             selectedColor={textColor}     onColorChange={setTextColor}      sectionId="text" />
        </div>
        <div className="border border-gray-600 p-2 mb-2">
          <ColorSection title="Border color"           selectedColor={borderColor}   onColorChange={setBorderColor}    sectionId="border" />
        </div>
      </div>
    </div>
  );
};

export default Customizations;
