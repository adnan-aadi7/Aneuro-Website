import React, { useEffect, useState } from "react";
import { ChevronDown, Copy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchFunnelTemplateById,
  selectCurrentFunnelTemplate,
  selectFunnelTemplateLoading,
  fetchFunnelCategories,
  selectFunnelCategories,
  selectFunnelCategoriesLoading
} from "../../../../store/Slice/FunnelSequenceSlice";

const CustomSelect = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      className="w-full bg-[#232334] border border-[#45455a] text-white px-4 py-3 rounded appearance-none focus:outline-none pr-10"
      value={value}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className={opt.bold ? "font-semibold" : ""}
        >
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
  </div>
);

const funnelPages = [
  {
    title: "Landing Page",
    subtitle: "High-converting landing page with compelling headline and CTA",
  },
  {
    title: "Lead Magnet Page",
    subtitle: "Value-packed lead magnet to capture visitor information",
  },
];

const Filters = ({ templateId }) => {
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentFunnelTemplate);
  const loading = useSelector(selectFunnelTemplateLoading);
  const categories = useSelector(selectFunnelCategories);
  const categoriesLoading = useSelector(selectFunnelCategoriesLoading);

  useEffect(() => {
    if (templateId) {
      dispatch(fetchFunnelTemplateById(templateId));
    }
    dispatch(fetchFunnelCategories());
  }, [dispatch, templateId]);
  console.log("template", template);

  const documentUrl = template?.fileUrl || null;

  const pages = Array.isArray(template?.pages) ? template.pages : null;
  const prompts = Array.isArray(template?.prompts) ? template.prompts : null;
  const stripHtml = (html = "") => (typeof html === 'string' ? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "");
  const contentPreview = stripHtml(template?.content || "");

  const [copiedKey, setCopiedKey] = useState(null);
  const handleCopy = async (text = "", key) => {
    const value = stripHtml(text || "");
    if (!value) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // noop
    }
  };

  return (
    <>
      <div className="bg-[#353545] p-6 rounded mb-8">
        <div className="text-cyan-400 text-xl font-semibold mb-6">
          Filter Templates
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brain Type */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Brain Type
            </label>
            <CustomSelect
              options={[
                { value: "all", label: "All Brain Types", bold: true },
                { value: "analytical", label: "Analytical" },
                { value: "creative", label: "Creative" },
                { value: "practical", label: "Practical" },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
          {/* Use Case (Categories) */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Use Case</label>
            <CustomSelect
              options={[
                { value: "all", label: categoriesLoading ? 'Loading...' : 'All Use Cases' },
                ...((Array.isArray(categories) ? categories : []).map((c) => ({ value: c, label: c })))
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
          {/* Tier */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Tier</label>
            <CustomSelect
              options={[
                { value: "all", label: "All Tiers" },
                { value: "basic", label: "Basic" },
                { value: "premium", label: "Premium" },
                { value: "enterprise", label: "Enterprise" },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Funnel Structure or File Button */}
      {!loading && documentUrl ? (
        <div className="bg-[#353545] p-6 rounded mb-8">
          <div className="text-white text-xl font-semibold mb-6">
            Funnel Template File
          </div>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 border border-cyan-400 text-white hover:bg-cyan-900 transition"
          >
            View Uploaded Document
          </a>
        </div>
      ) : (
        <>
          <div className="bg-[#353545] p-6 rounded mb-8">
            <div className="text-white text-xl font-semibold mb-6">
              {template?.name || 'Funnel Structure'}
            </div>
            <div className="flex flex-col gap-4">
              {Array.isArray(pages) && pages.length > 0 ? (
                pages.map((page, idx) => (
                  <div
                    key={idx}
                    className="bg-[#232334] border border-[#353545] rounded px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white text-base font-semibold">
                        {page?.title || `Page ${idx + 1}`}
                      </div>
                      {page?.subtitle && (
                        <div className="text-cyan-400 text-sm mt-1">
                          {page.subtitle}
                        </div>
                      )}
                    </div>
                    <button
                      className="border border-cyan-400 text-white text-xs px-4 py-1 rounded flex items-center gap-1 hover:bg-cyan-900 transition"
                      onClick={() => handleCopy(page?.subtitle, `page-${idx}`)}
                    >
                      <Copy className="w-4 h-4" /> {copiedKey === `page-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))
              ) : Array.isArray(prompts) && prompts.length > 0 ? (
                prompts.map((prompt, idx) => (
                  <div
                    key={prompt?._id || idx}
                    className="bg-[#232334] border border-[#353545] rounded px-6 py-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-white text-base font-semibold">
                        Prompt {idx + 1} {prompt?.type ? `(${prompt.type})` : ''}
                      </div>
                      <button
                        className="border border-cyan-400 text-white text-xs px-4 py-1 rounded flex items-center gap-1 hover:bg-cyan-900 transition"
                        onClick={() => handleCopy(prompt?.content, `prompt-${prompt?._id || idx}`)}
                      >
                        <Copy className="w-4 h-4" /> {copiedKey === `prompt-${prompt?._id || idx}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    {prompt?.content && (
                      <div className="text-cyan-400 text-sm mt-1 truncate" title={stripHtml(prompt.content)}>
                        {stripHtml(prompt.content).slice(0, 120) || ''}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                contentPreview ? (
                  <div
                    className="bg-[#232334] border border-[#353545] rounded px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white text-base font-semibold">
                        {template?.name || funnelPages[0].title}
                      </div>
                      <div className="text-cyan-400 text-sm mt-1">
                        {contentPreview}
                      </div>
                    </div>
                    <button
                      className="border border-cyan-400 text-white text-xs px-4 py-1 rounded flex items-center gap-1 hover:bg-cyan-900 transition"
                      onClick={() => handleCopy(contentPreview, 'fallback')}
                    >
                      <Copy className="w-4 h-4" /> {copiedKey === 'fallback' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  <div
                    className="bg-[#232334] border border-[#353545] rounded px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white text-base font-semibold">
                        {template?.name || funnelPages[0].title}
                      </div>
                      <div className="text-cyan-400 text-sm mt-1">
                        No content found
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          {Array.isArray(pages) && pages.length > 0 && (
            <div className="flex justify-center mt-2 mb-8">
              <button className="border border-cyan-400 text-white text-xs px-8 py-2 rounded hover:bg-cyan-900 transition">
                View All {pages.length} Pages
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Filters;
