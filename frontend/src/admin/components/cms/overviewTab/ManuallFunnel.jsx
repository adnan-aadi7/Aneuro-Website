import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { Bold, Italic, Underline, Strikethrough, Link, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Paperclip, Image, X, Plus, Trash2 } from 'lucide-react';
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";
import {
  createFunnelTemplate,
  selectFunnelTemplateLoading,
  selectFunnelTemplateError,
  selectFunnelTemplateSuccess,
  clearError as clearFunnelError,
  clearSuccess as clearFunnelSuccess,
} from "../../../../store/Slice/FunnelSequenceSlice";
import {
  fetchEmailCategories,
  createCategory as createEmailCategory,
} from "../../../../store/Slice/EmailSequenceSLice";

const ManuallFunnel = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectFunnelTemplateLoading);
  const error = useSelector(selectFunnelTemplateError);
  const success = useSelector(selectFunnelTemplateSuccess);
  const categories = useSelector((state) => state.emailSequence.categories || []);
  const categoriesLoading = useSelector((state) => state.emailSequence.categoriesLoading);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [sequenceName, setSequenceName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTier, setSelectedTier] = useState(""); // basic | premium | enterprise
  const [brainType, setBrainType] = useState("Architect");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [attachments, setAttachments] = useState([]); // {id, file?, url, isImage, name?}

  const getTruncatedFileName = (fullName = '', maxLength = 24) => {
    const name = String(fullName);
    if (name.length <= maxLength) return name;
    const lastDot = name.lastIndexOf('.');
    const ext = lastDot > 0 ? name.slice(lastDot) : '';
    const base = lastDot > 0 ? name.slice(0, lastDot) : name;
    const keep = Math.max(5, maxLength - ext.length - 3);
    const head = base.slice(0, Math.ceil(keep * 0.6));
    const tail = base.slice(-Math.floor(keep * 0.4));
    return `${head}…${tail}${ext}`;
  };

  // Multiple prompts (similar to MannualPrompt.jsx)
  // const [prompts, setPrompts] = useState([
  //   { id: 1, brainType: "Architect", content: "" }
  // ]);
  // const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const [activeFormatting, setActiveFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
    unorderedList: false,
    orderedList: false,
  });

  const focusEditorWithCaret = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const executeCommand = (command, value = null) => {
    focusEditorWithCaret();
    document.execCommand(command, false, value);
    updateActiveFormatting();
  };

  const handleAlignment = (alignment) => {
    executeCommand(`justify${alignment}`);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) executeCommand('createLink', url);
  };

  const isAllowedDoc = (file) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const allowedExts = ['.pdf', '.doc', '.docx', '.txt'];
    const name = (file?.name || '').toLowerCase();
    return (
      allowedMimes.includes(file?.type) ||
      allowedExts.some((ext) => name.endsWith(ext))
    );
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter(isAllowedDoc);
    if (!files.length) return;

    const newItems = files.map((file) => {
      const url = URL.createObjectURL(file);
      const isImage = false;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      return { id, file, url, isImage };
    });

    setAttachments((prev) => [...prev, ...newItems]);
    e.target.value = null;
  };

  const handleImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f && f.type.startsWith('image/'));
    if (!files.length) return;

    const newItems = files.map((file) => {
      const url = URL.createObjectURL(file);
      const isImage = true;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      return { id, file, url, isImage };
    });

    setAttachments((prev) => [...prev, ...newItems]);
    e.target.value = null;
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item && item.url && item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const updateActiveFormatting = () => {
    if (!editorRef.current) return;
    setActiveFormatting({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      alignJustify: document.queryCommandState('justifyFull'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const handleSelectionChange = useCallback(() => {
    updateActiveFormatting();
  }, []);

  useEffect(() => {
    dispatch(fetchEmailCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setSequenceName("");
      setCategory("");
      setSelectedTier("");
      dispatch(clearFunnelSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'Operation failed');
      dispatch(clearFunnelError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (editorRef.current) editorRef.current.focus();
    try { document.execCommand('styleWithCSS', false, true); } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.url && a.url.startsWith('blob:')) URL.revokeObjectURL(a.url);
      });
    };
  }, [attachments]);

  // Sync editor -> current prompt content
  const handleContentChange = () => {
    if (!editorRef.current) return;
    // no-op in single prompt mode
  };

  // Add new prompt
  // const addNewPrompt = () => {
  //   const newId = Math.max(...prompts.map(p => p.id)) + 1;
  //   const newPrompt = { id: newId, brainType: "Architect", content: "" };
  //   setPrompts([...prompts, newPrompt]);
  //   setCurrentPromptIndex(prompts.length);
  //   if (editorRef.current) editorRef.current.innerHTML = "";
  //   setBrainType("Architect");
  // };

  // Remove prompt
  // const removePrompt = (promptId) => {
  //   if (prompts.length === 1) {
  //     toast.error("At least one prompt is required");
  //     return;
  //   }
  //   const updated = prompts.filter(p => p.id !== promptId);
  //   setPrompts(updated);
  //   const nextIndex = Math.min(currentPromptIndex, updated.length - 1);
  //   setCurrentPromptIndex(nextIndex);
  //   const selected = updated[nextIndex];
  //   if (editorRef.current) editorRef.current.innerHTML = selected?.content || "";
  //   setBrainType(selected?.brainType || "Architect");
  // };

  // Switch prompt tab
  // const switchToPrompt = (index) => {
  //   if (editorRef.current) {
  //     const currentContent = editorRef.current.innerHTML;
  //     setPrompts(prev => prev.map((p, i) => i === currentPromptIndex ? { ...p, content: currentContent } : p));
  //   }
  //   setCurrentPromptIndex(index);
  //   const selected = prompts[index];
  //   if (editorRef.current) editorRef.current.innerHTML = selected?.content || "";
  //   setBrainType(selected?.brainType || "Architect");
  // };

  // Update current prompt brain type
  const updateCurrentPromptBrainType = (newBrainType) => {
    setBrainType(newBrainType);
    // setPrompts(prev => prev.map((p, i) => i === currentPromptIndex ? { ...p, brainType: newBrainType } : p));
  };

  const handleSend = () => {
    // Persist current editor content
    const currentContent = editorRef.current?.innerHTML || "";

    if (!(currentContent || "").trim()) { toast.error("Please add content to the prompt"); return; }
    if (!category) { toast.error("Please select a category"); return; }
    if (!selectedTier) { toast.error("Please select a tier"); return; }

    const tierMap = { basic: 'starter', premium: 'growth', enterprise: 'enterprise' };
    const backendTier = tierMap[selectedTier] || 'starter';

    // Single prompt only
    const backendPrompts = [{ content: currentContent, type: brainType }];

    const payload = {
      name: sequenceName?.trim() || `Manual Funnel - ${new Date().toLocaleString()}`,
      category,
      tier: backendTier,
      status: 'active',
      type: 'manual',
      // send both for compatibility: backend may expect root `content`
      content: currentContent,
      prompts: backendPrompts,
    };
    dispatch(createFunnelTemplate(payload));
  };

  const formatButtons = [
    { icon: Bold, label: 'Bold', command: 'bold', key: 'bold' },
    { icon: Italic, label: 'Italic', command: 'italic', key: 'italic' },
    { icon: Underline, label: 'Underline', command: 'underline', key: 'underline' },
    { icon: Strikethrough, label: 'Strikethrough', command: 'strikeThrough', key: 'strikethrough' },
  ];

  const alignButtons = [
    { icon: AlignLeft, label: 'Align Left', alignment: 'Left', key: 'alignLeft' },
    { icon: AlignCenter, label: 'Align Center', alignment: 'Center', key: 'alignCenter' },
    { icon: AlignRight, label: 'Align Right', alignment: 'Right', key: 'alignRight' },
    { icon: AlignJustify, label: 'Justify', alignment: 'Full', key: 'alignJustify' },
  ];

  const listButtons = [
    { icon: List, label: 'Bullet List', command: 'insertUnorderedList', key: 'unorderedList' },
    { icon: ListOrdered, label: 'Numbered List', command: 'insertOrderedList', key: 'orderedList' },
  ];

  return (
    <div className="bg-[#2A2A39] p-2">
      <Toaster position="top-right" />
      <div className="flex items-center gap-3 mb-2 mt-4 ml-6">
        <img src="/Avatar.png" alt="Aneuro Admin" className="w-13 h-13 rounded-full border-2 border-cyan-400 bg-white object-cover" />
        <div>
          <div className="text-white text-sm font-semibold leading-tight">{localStorage.getItem('userName') || ''}</div>
          <div className="text-gray-300 text-xs leading-tight">{localStorage.getItem('userEmail') || ''}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-6 mr-6 mt-10">
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="funnel-name">Name</label>
          <input id="funnel-name" type="text" placeholder="Input Field" value={sequenceName} onChange={(e) => setSequenceName(e.target.value)} className="w-full px-4 py-3  border border-gray-500  text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition" />
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white text-base" htmlFor="funnel-category">Select Category</label>
            <button type="button" onClick={() => { setShowAddCategory(true); setNewCategoryName(""); }} className="text-xs px-3 py-1 border border-gray-500 text-white hover:bg-gray-700">Add New</button>
          </div>
          <select id="funnel-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3  border  border-gray-500 text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition bg-[#2A2A39]">
            <option value="" disabled>{categoriesLoading ? 'Loading...' : 'Select a category'}</option>
            {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          {showAddCategory && (
            <div className="mt-3 flex items-center gap-2">
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" className="flex-1 px-3 py-2  border border-gray-500 bg-transparent text-gray-200 focus:outline-none focus:border-blue-500" />
              <button type="button" onClick={async () => {
                const name = newCategoryName.trim();
                if (!name) { toast.error("Please enter a category name"); return; }
                try {
                  await dispatch(createEmailCategory(name)).unwrap?.();
                  await dispatch(fetchEmailCategories());
                  setCategory(name);
                  setShowAddCategory(false);
                  setNewCategoryName("");
                  toast.success("Category created");
                } catch (e) {
                  toast.error(typeof e === 'string' ? e : 'Failed to create category');
                }
              }} className="px-3 py-2 bg-cyan-400 text-black text-xs hover:bg-cyan-300">Save</button>
              <button type="button" onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }} className="px-3 py-2 border border-gray-500 text-white text-xs hover:bg-gray-700">Cancel</button>
            </div>
          )}
        </div>
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="brain-type">Brain Type</label>
          <select id="brain-type" className="w-full px-4 py-3  border border-gray-500 bg-[#2A2A39] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition" value={brainType} onChange={(e) => updateCurrentPromptBrainType(e.target.value)}>
            <option value="Architect">Architect</option>
            <option value="Challenger">Challenger</option>
            <option value="Synthesizer">Synthesizer</option>
            <option value="Reflector">Reflector</option>
            <option value="Catalyst">Catalyst</option>
          </select>
        </div>
      </div>

      {/* Prompt Tabs Section */}
      {/* Moved below Tier Access Control; see updated section after Tier block */}

      <div className="ml-6 mr-6 mt-3 w-[550px]">
        <div className="relative p-6  bg-[#2A2A39]" style={{ boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040` }}>
          <h3 className="text-white text-sm font-medium mb-4">Tier Access Control</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4  border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500" checked={selectedTier === "basic"} onChange={() => setSelectedTier(selectedTier === "basic" ? "" : "basic")} />
              <img src={StarIcon} alt="Basic" className="w-6 h-6 object-contain" />
              <div className="flex-1 ml-2">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Basic</span>
                  <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 ">1250 users</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">Free tier users</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4  border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500" checked={selectedTier === "premium"} onChange={() => setSelectedTier(selectedTier === "premium" ? "" : "premium")} />
              <img src={KingIcon} alt="Premium" className="w-6 h-6 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Premium</span>
                  <span className="text-gray-400 text-sm">330 users</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">Paid subscribers</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4  border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500" checked={selectedTier === "enterprise"} onChange={() => setSelectedTier(selectedTier === "enterprise" ? "" : "enterprise")} />
              <img src={DiamondIcon} alt="VIP" className="w-6 h-6 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">VIP</span>
                  <span className="text-gray-400 text-sm">45 users</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">Exclusive access</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Tabs Section (disabled for single prompt) */}
      {/*
      <div className="ml-6 mr-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Funnel Prompts</h3>
          <button type="button" onClick={addNewPrompt} className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black text-sm font-medium  hover:bg-cyan-300 transition-colors">
            <Plus size={16} />
            Add Another Prompt
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {prompts.map((prompt, index) => (
            <div key={prompt.id} className={`flex items-center gap-2 px-4 py-2  cursor-pointer transition-all ${currentPromptIndex === index ? 'bg-cyan-400 text-black' : 'bg-[#2A2A39] text-white border border-gray-600 hover:bg-gray-700'}`} onClick={() => switchToPrompt(index)}>
              <span className="text-sm font-medium">Prompt {index + 1}</span>
              <span className="text-xs opacity-75">({prompt.brainType})</span>
              {prompts.length > 1 && (
                <button type="button" onClick={(e) => { e.stopPropagation(); removePrompt(prompt.id); }} className="ml-2 p-1  hover:bg-red-500 hover:text-white transition-colors" title="Remove prompt">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      */}

      <div className="mb-4 mt-5">
        <div className="relative p-8 ml-6 mr-6 mt-2  bg-[#2A2A39]" style={{ boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040` }}>
          <label className="text-white text-base font-semibold mb-2 block border-b py-10 px-4" style={{ borderBottomColor: "#D1D1D180" }}>Write Your Prompt</label>
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {formatButtons.map((button, index) => (
                <button type="button" key={index} className={`p-2  transition-colors ${activeFormatting[button.key] ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700 text-slate-300 hover:text-white'}`} title={button.label} onMouseDown={(e) => { e.preventDefault(); executeCommand(button.command); }}>
                  <button.icon size={16} />
                </button>
              ))}
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              {alignButtons.map((button, index) => (
                <button type="button" key={index} className={`p-2  transition-colors ${activeFormatting[button.key] ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700 text-slate-300 hover:text-white'}`} title={button.label} onMouseDown={(e) => { e.preventDefault(); handleAlignment(button.alignment); }}>
                  <button.icon size={16} />
                </button>
              ))}
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              {listButtons.map((button, index) => (
                <button type="button" key={index} className={`p-2  transition-colors ${activeFormatting[button.key] ? 'bg-cyan-400 text-black' : 'hover:bg-slate-700 text-slate-300 hover:text-white'}`} title={button.label} onMouseDown={(e) => { e.preventDefault(); executeCommand(button.command); }}>
                  <button.icon size={16} />
                </button>
              ))}
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              <button type="button" className="p-2  hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Insert Link" onMouseDown={(e) => { e.preventDefault(); handleLink(); }}>
                <Link size={16} />
              </button>
              <button type="button" className="p-2  hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Attach File" onMouseDown={(e) => { e.preventDefault(); handleFileUpload(); }}>
                <Paperclip size={16} />
              </button>
              <button type="button" className="p-2  hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Insert Image" onMouseDown={(e) => { e.preventDefault(); handleImage(); }}>
                <Image size={16} />
              </button>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 px-2">
              {attachments.map((item) => (
                <div key={item.id} className="relative group border border-slate-600 -md p-2 pr-8 bg-[#1f2937] flex items-center gap-2">
                  {item.isImage ? (
                    <img src={item.url} alt={item.name || item.file?.name || 'image'} className="w-12 h-12 object-cover " />
                  ) : (
                    <div className="w-12 h-12  bg-slate-700 flex items-center justify-center text-slate-300 text-xs">
                      {(item.name || item.file?.name || 'FILE').split('.').pop()?.toUpperCase() || 'FILE'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white text-xs max-w-[180px] truncate" title={item.name || item.file?.name}>{getTruncatedFileName(item.name || item.file?.name)}</span>
                    {item.file?.size != null && (
                      <span className="text-slate-400 text-[10px]">{(item.file.size / 1024).toFixed(1)} KB</span>
                    )}
                  </div>
                  <button type="button" className="absolute top-1 right-1 text-slate-300 hover:text-white" onClick={() => removeAttachment(item.id)} aria-label="Remove file">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div ref={editorRef} contentEditable className="w-full p-4 text-sm outline-none text-white transition-all duration-200 min-h-[150px] max-h-[400px] overflow-y-auto bg-transparent" style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }} onInput={handleContentChange} onMouseUp={updateActiveFormatting} onKeyUp={updateActiveFormatting} data-placeholder="Write your prompt content here..." />

          <style jsx>{`
            [contenteditable][data-placeholder]:empty:before {
              content: attr(data-placeholder);
              color: #94a3b8;
              pointer-events: none;
            }
            [contenteditable] ul { list-style: disc; margin-left: 1.25rem; padding-left: 1.25rem; }
            [contenteditable] ol { list-style: decimal; margin-left: 1.25rem; padding-left: 1.25rem; }
            [contenteditable] li { margin: 0.25rem 0; }
          `}</style>

          {/* Hidden file inputs */}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" style={{ display: 'none' }} />
          <input type="file" ref={imageInputRef} onChange={handleImageFileChange} multiple accept="image/*" style={{ display: 'none' }} />
        </div>
        <div className="flex justify-start ml-6 mt-4">
          <button className="cursor-pointer bg-cyan-400 text-black font-semibold px-10 py-2  hover:bg-cyan-300 transition-all text-sm " onClick={handleSend} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManuallFunnel;


