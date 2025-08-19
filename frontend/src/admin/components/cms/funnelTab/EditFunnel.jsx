import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Paperclip, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, X } from 'lucide-react';
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";
import {
  fetchEmailCategories,
  createCategory as createEmailCategory,
} from "../../../../store/Slice/EmailSequenceSLice";
import {
  fetchFunnelTemplateById,
  updateFunnelTemplate,
  selectCurrentFunnelTemplate,
  selectFunnelTemplateLoading,
  selectFunnelTemplateError,
  selectFunnelTemplateSuccess,
  clearError as clearFunnelError,
  clearSuccess as clearFunnelSuccess,
} from "../../../../store/Slice/FunnelSequenceSlice";

const EditFunnel = () => {
  const dispatch = useDispatch();
  const { templateId } = useParams();

  const loading = useSelector(selectFunnelTemplateLoading);
  const error = useSelector(selectFunnelTemplateError);
  const success = useSelector(selectFunnelTemplateSuccess);
  const currentTemplate = useSelector(selectCurrentFunnelTemplate);
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
  const [attachments, setAttachments] = useState([]); // {id, file?, url, isImage, name?}[]

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

  const insertAtCursor = (node) => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.setStartAfter(node);
      range.setEndAfter(node);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editor.appendChild(node);
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormatting();
  };

  const handleAlignment = (alignment) => {
    executeCommand(`justify${alignment}`);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const isAllowedDoc = (file) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const allowedExts = ['.pdf', '.doc', '.docx', '.txt'];
    const name = (file?.name || '').toLowerCase();
    return (
      allowedMimes.includes(file?.type) ||
      allowedExts.some((ext) => name.endsWith(ext))
    );
  };

  const handleFileUpload = () => fileInputRef.current?.click();
  const handleImage = () => imageInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter(isAllowedDoc);
    if (!files.length) return;

    const newItems = files.map((file) => {
      const url = URL.createObjectURL(file);
      const isImage = false;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const chip = document.createElement('span');
      chip.textContent = getTruncatedFileName(file.name);
      chip.className = 'inline-block px-2 py-1 text-xs rounded bg-slate-700 text-slate-200';
      chip.title = file.name;
      chip.style.maxWidth = '200px';
      chip.style.whiteSpace = 'nowrap';
      chip.style.overflow = 'hidden';
      chip.style.textOverflow = 'ellipsis';
      chip.setAttribute('data-attachment-id', id);
      insertAtCursor(chip);
      insertAtCursor(document.createElement('br'));
      return { id, file, url, isImage };
    });

    setAttachments((prev) => [...prev, ...newItems]);
    e.target.value = null;
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f && f.type.startsWith('image/'));
    if (!files.length) return;

    const newItems = files.map((file) => {
      const url = URL.createObjectURL(file);
      const isImage = true;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const img = document.createElement('img');
      img.src = url;
      img.alt = file.name;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '6px';
      img.setAttribute('data-attachment-id', id);
      insertAtCursor(img);
      insertAtCursor(document.createElement('br'));
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
    const node = editorRef.current?.querySelector(`[data-attachment-id="${id}"]`);
    if (node && node.parentNode) node.parentNode.removeChild(node);
  };

  const isImageUrl = (url) => /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url || "");

  const transformContentForEditor = useCallback((rawHtml) => {
    try {
      const container = document.createElement('div');
      container.innerHTML = rawHtml || '';
      const extracted = [];
      const anchors = Array.from(container.querySelectorAll('a[href]'));
      anchors.forEach((a) => {
        const href = a.getAttribute('href');
        const name = a.textContent?.trim() || href?.split('/')?.pop() || 'file';
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        if (isImageUrl(href)) {
          const img = document.createElement('img');
          img.src = href;
          img.alt = name;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '6px';
          img.setAttribute('data-attachment-id', id);
          a.replaceWith(img);
        } else {
          const chip = document.createElement('span');
          chip.textContent = getTruncatedFileName(name);
          chip.className = 'inline-block px-2 py-1 text-xs rounded bg-slate-700 text-slate-200';
          chip.title = name;
          chip.style.maxWidth = '200px';
          chip.style.whiteSpace = 'nowrap';
          chip.style.overflow = 'hidden';
          chip.style.textOverflow = 'ellipsis';
          chip.setAttribute('data-attachment-id', id);
          a.replaceWith(chip);
        }
        extracted.push({ id, url: href, isImage: isImageUrl(href), name });
      });

      const onlyText = container.children.length === 0 && (container.textContent || '').trim();
      const urlRegex = /^(https?:\/\/[^\s]+)$/i;
      if (onlyText && urlRegex.test(onlyText)) {
        const href = onlyText;
        const name = href.split('/').pop() || 'file';
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        container.textContent = '';
        if (isImageUrl(href)) {
          const img = document.createElement('img');
          img.src = href;
          img.alt = name;
          img.style.maxWidth = '100%';
          img.style.borderRadius = '6px';
          img.setAttribute('data-attachment-id', id);
          container.appendChild(img);
        } else {
          const chip = document.createElement('span');
          chip.textContent = getTruncatedFileName(name);
          chip.className = 'inline-block px-2 py-1 text-xs rounded bg-slate-700 text-slate-200';
          chip.title = name;
          chip.style.maxWidth = '200px';
          chip.style.whiteSpace = 'nowrap';
          chip.style.overflow = 'hidden';
          chip.style.textOverflow = 'ellipsis';
          chip.setAttribute('data-attachment-id', id);
          container.appendChild(chip);
        }
        extracted.push({ id, url: href, isImage: isImageUrl(href), name });
      }

      return { html: container.innerHTML, attachments: extracted };
    } catch {
      return { html: rawHtml, attachments: [] };
    }
  }, []);

  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.url && a.url.startsWith('blob:')) URL.revokeObjectURL(a.url);
      });
    };
  }, [attachments]);

  const updateActiveFormatting = () => {
    // no-op placeholder for future formatting state if needed
  };

  const getPlainTextContent = () => (editorRef.current ? editorRef.current.textContent || '' : '');
  const getHtmlContent = () => (editorRef.current ? editorRef.current.innerHTML || '' : '');

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const buildPersistableHtml = async () => {
    const rawHtml = getHtmlContent();
    if (!rawHtml) return '';
    const container = document.createElement('div');
    container.innerHTML = rawHtml;
    const nodes = Array.from(container.querySelectorAll('[data-attachment-id]'));
    const tasks = nodes.map(async (node) => {
      const id = node.getAttribute('data-attachment-id');
      const att = attachments.find((a) => a.id === id);
      if (!att) return;
      if (att.isImage && att.file) {
        try {
          const dataUrl = await readFileAsDataUrl(att.file);
          node.setAttribute('src', dataUrl);
        } catch {
          // ignore
        }
      }
    });
    await Promise.all(tasks);
    return container.innerHTML;
  };

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchEmailCategories());
  }, [dispatch]);

  // Load template if editing
  useEffect(() => {
    if (templateId && (!currentTemplate || currentTemplate._id !== templateId)) {
      dispatch(fetchFunnelTemplateById(templateId));
    }
  }, [dispatch, templateId, currentTemplate]);

  // Prefill when loaded
  useEffect(() => {
    if (templateId && currentTemplate && currentTemplate._id === templateId) {
      setSequenceName(currentTemplate.name || "");
      setCategory(currentTemplate.category || "");
      setBrainType(currentTemplate.brainType || "Architect");
      const reverseTierMap = { starter: "basic", growth: "premium", enterprise: "enterprise" };
      setSelectedTier(reverseTierMap[currentTemplate.tier] || "");
      const { html, attachments: extracted } = transformContentForEditor(currentTemplate.content || "");
      if (editorRef.current) editorRef.current.innerHTML = html;
      setAttachments(extracted);

      const upgradeToBlob = async (item) => {
        try {
          const res = await fetch(item.url, { credentials: 'omit' });
          if (!res.ok) return;
          const blob = await res.blob();
          const fileName = item.name || (item.url && item.url.split('/').pop()) || 'file';
          const file = new File([blob], fileName, { type: blob.type || undefined });
          const blobUrl = URL.createObjectURL(blob);
          const node = editorRef.current?.querySelector(`[data-attachment-id="${item.id}"]`);
          if (node && item.isImage) node.setAttribute('src', blobUrl);
          setAttachments((prev) => prev.map((a) => (a.id === item.id ? { ...a, url: blobUrl, file } : a)));
        } catch {
          // ignore
        }
      };

      extracted.forEach((it) => {
        if (it.isImage || (it.url || '').toLowerCase().endsWith('.pdf')) {
          upgradeToBlob(it);
        }
      });
    }
  }, [templateId, currentTemplate, transformContentForEditor]);

  // Toasts
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearFunnelSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "Operation failed");
      dispatch(clearFunnelError());
    }
  }, [error, dispatch]);

  const handleSave = async () => {
    const htmlContent = await buildPersistableHtml();
    const plainTextContent = getPlainTextContent();

    if (!plainTextContent.trim() && attachments.length === 0) {
      toast.error("Please write content or attach a file");
      return;
    }

    if (!category) { toast.error("Please select a category"); return; }
    if (!selectedTier) { toast.error("Please select a tier"); return; }

    const tierMap = { basic: 'starter', premium: 'growth', enterprise: 'enterprise' };
    const backendTier = tierMap[selectedTier] || 'starter';

    const payload = {
      name: sequenceName?.trim() || currentTemplate?.name || `Funnel - ${new Date().toLocaleString()}`,
      category,
      brainType,
      tier: backendTier,
      content: htmlContent
    };

    if (templateId) {
      dispatch(updateFunnelTemplate({ id: templateId, updateData: payload }));
    }
  };

  const formatButtons = [
    { icon: Bold, label: 'Bold', command: 'bold' },
    { icon: Italic, label: 'Italic', command: 'italic' },
    { icon: Underline, label: 'Underline', command: 'underline' },
    { icon: Strikethrough, label: 'Strikethrough', command: 'strikeThrough' },
  ];

  const alignButtons = [
    { icon: AlignLeft, label: 'Align Left', alignment: 'Left' },
    { icon: AlignCenter, label: 'Align Center', alignment: 'Center' },
    { icon: AlignRight, label: 'Align Right', alignment: 'Right' },
    { icon: AlignJustify, label: 'Justify', alignment: 'Full' },
  ];

  const listButtons = [
    { icon: List, label: 'Bullet List', command: 'insertUnorderedList' },
    { icon: ListOrdered, label: 'Numbered List', command: 'insertOrderedList' },
  ];

  return (
    <div className="bg-[#2A2A39] p-2">
      <Toaster position="top-right" />
      {/* Header/Sender */}
      <div className="flex items-center gap-3 mb-2 mt-4 ml-6">
        <img src="/Avatar.png" alt="Aneuro Admin" className="w-13 h-13 rounded-full border-2 border-cyan-400 bg-white object-cover" />
        <div>
          <div className="text-white text-sm font-semibold leading-tight">{localStorage.getItem('userName') || ''}</div>
          <div className="text-gray-300 text-xs leading-tight">{localStorage.getItem('userEmail') || ''}</div>
        </div>
      </div>

      {/* Basic details and access control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-6 mr-6 mt-10">
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="template-name">Name</label>
          <input
            id="template-name"
            type="text"
            placeholder="Template name"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="w-full px-4 py-3 rounded border border-gray-500  text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white text-base" htmlFor="template-category">Select Category</label>
            <button type="button" onClick={() => { setShowAddCategory(true); setNewCategoryName(""); }} className="text-xs px-3 py-1 border border-gray-500 text-white hover:bg-gray-700">Add New</button>
          </div>
          <select
            id="template-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded border  border-gray-500 text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition bg-[#2A2A39]"
          >
            <option value="" disabled>
              {categoriesLoading ? 'Loading...' : 'Select a category'}
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {showAddCategory && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2 rounded border border-gray-500 bg-transparent text-gray-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={async () => {
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
                }}
                className="px-3 py-2 bg-cyan-400 text-black text-xs hover:bg-cyan-300"
              >
                Save
              </button>
              <button type="button" onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }} className="px-3 py-2 border border-gray-500 text-white text-xs hover:bg-gray-700">Cancel</button>
            </div>
          )}
        </div>
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="brain-type">Brain Type</label>
          <select
            id="brain-type"
            className="w-full px-4 py-3 rounded border border-gray-500 bg-[#2A2A39] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
            value={brainType}
            onChange={(e) => setBrainType(e.target.value)}
          >
            <option value="Architect">Architect</option>
            <option value="Challenger">Challenger</option>
            <option value="Synthesizer">Synthesizer</option>
            <option value="Reflector">Reflector</option>
            <option value="Catalyst">Catalyst</option>
          </select>
        </div>
      </div>

      <div className="ml-6 mr-6 mt-3 w-[550px]">
        <div className="relative p-6 rounded bg-[#2A2A39]" style={{ boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040` }}>
          <h3 className="text-white text-sm font-medium mb-4">Tier Access Control</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500" checked={selectedTier === "basic"} onChange={() => setSelectedTier(selectedTier === "basic" ? "" : "basic")} />
              <img src={StarIcon} alt="Basic" className="w-6 h-6 object-contain" />
              <div className="flex-1 ml-2">
                <div className="flex items-center gap-2"><span className="text-white text-sm">Basic</span><span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">1250 users</span></div>
                <div className="text-gray-500 text-xs mt-1">Free tier users</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500" checked={selectedTier === "premium"} onChange={() => setSelectedTier(selectedTier === "premium" ? "" : "premium")} />
              <img src={KingIcon} alt="Premium" className="w-6 h-6 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="text-white text-sm">Premium</span><span className="text-gray-400 text-sm">330 users</span></div>
                <div className="text-gray-400 text-xs mt-1">Paid subscribers</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500" checked={selectedTier === "enterprise"} onChange={() => setSelectedTier(selectedTier === "enterprise" ? "" : "enterprise")} />
              <img src={DiamondIcon} alt="VIP" className="w-6 h-6 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="text-white text-sm">VIP</span><span className="text-gray-400 text-sm">45 users</span></div>
                <div className="text-gray-400 text-xs mt-1">Exclusive access</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 mt-5">
        <div className="relative p-8 ml-6 mr-6 mt-2 rounded bg-[#2A2A39]" style={{ boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040` }}>
          <label className="text-white text-base font-semibold mb-2 block border-b py-10 px-4" style={{ borderBottomColor: "#D1D1D180" }}>Edit Funnel Content</label>

          {/* Toolbar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {formatButtons.map((button, index) => (
                <button key={index} className="p-2 rounded transition-colors hover:bg-slate-700 text-slate-300 hover:text-white" title={button.label} onClick={() => executeCommand(button.command)}>
                  <button.icon size={16} />
                </button>
              ))}
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              {alignButtons.map((button, index) => (
                <button key={index} className="p-2 rounded transition-colors hover:bg-slate-700 text-slate-300 hover:text-white" title={button.label} onClick={() => handleAlignment(button.alignment)}>
                  <button.icon size={16} />
                </button>
              ))}
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              {listButtons.map((button, index) => (
                <button key={index} className="p-2 rounded transition-colors hover:bg-slate-700 text-slate-300 hover:text-white" title={button.label} onClick={() => executeCommand(button.command)}>
                  <button.icon size={16} />
                </button>
              ))}
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              <button className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Insert Link" onClick={handleLink}>
                <LinkIcon size={16} />
              </button>
              <button className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Attach File" onClick={handleFileUpload}>
                <Paperclip size={16} />
              </button>
              <button className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Insert Image" onClick={handleImage}>
                <ImageIcon size={16} />
              </button>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 px-2">
              {attachments.map((item) => {
                const { id, file, url, isImage } = item;
                return (
                  <div key={id} className="relative group border border-slate-600 rounded-md p-2 pr-8 bg-[#1f2937] flex items-center gap-2">
                    {isImage ? (
                      <img src={url} alt={item.name || file?.name || 'image'} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center text-slate-300 text-xs">
                        {(item.name || file?.name || 'FILE').split('.').pop()?.toUpperCase() || 'FILE'}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-white text-xs max-w-[180px] truncate" title={item.name || file?.name}>{getTruncatedFileName(item.name || file?.name)}</span>
                      {file?.size != null && (
                        <span className="text-slate-400 text-[10px]">{(file.size / 1024).toFixed(1)} KB</span>
                      )}
                    </div>
                    <button type="button" className="absolute top-1 right-1 text-slate-300 hover:text-white" onClick={() => removeAttachment(id)} aria-label="Remove file">
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="w-full p-4 text-sm outline-none text-white transition-all duration-200 min-h-[150px] max-h_[400px] overflow-y-auto bg-transparent"
            style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
            data-placeholder="Edit funnel content here..."
          />

          {/* Hidden file inputs */}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" style={{ display: 'none' }} />
          <input type="file" ref={imageInputRef} onChange={handleImageFileChange} multiple accept="image/*" style={{ display: 'none' }} />

          <style jsx>{`
            [contenteditable][data-placeholder]:empty:before {
              content: attr(data-placeholder);
              color: #94a3b8;
              pointer-events: none;
            }
          `}</style>
        </div>
        <div className="flex justify-start ml-6 mt-4">
          <button className="cursor-pointer bg-cyan-400 text-black font-semibold px-10 py-2  hover:bg-cyan-300 transition-all text-sm " onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFunnel;
