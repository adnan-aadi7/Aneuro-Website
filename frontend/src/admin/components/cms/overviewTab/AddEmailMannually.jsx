import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../../../store/axiosInstance";
import { Toaster, toast } from "react-hot-toast";
import { Bold, Italic, Underline, Strikethrough, Link, Paperclip, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, X, Plus, Trash2 } from 'lucide-react';
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";
import {
  createEmailSequence,
  fetchEmailSequenceById,
  updateEmailSequence,
  fetchEmailCategories,
  createCategory as createEmailCategory,
  selectEmailSequenceLoading,
  selectEmailSequenceError,
  selectEmailSequenceSuccess,
  clearError,
  clearSuccess,
} from "../../../../store/Slice/EmailSequenceSLice";
// axios already imported from store/axiosInstance

const AddEmailMannually = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const editSequenceId = params.sequenceId || location.state?.sequenceId || null;
  const currentSequence = useSelector((state) => state.emailSequence.currentSequence);
  const loading = useSelector(selectEmailSequenceLoading);
  const error = useSelector(selectEmailSequenceError);
  const success = useSelector(selectEmailSequenceSuccess);
  const categories = useSelector((state) => state.emailSequence.categories || []);
  const categoriesLoading = useSelector((state) => state.emailSequence.categoriesLoading);
  const editSingleEmail = Boolean(location.state?.editSingleEmail);
  const editingEmailId = location.state?.emailId || null;

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]); // {id, file?, url, isImage, name?}[]
const [emailsInitialized, setEmailsInitialized] = useState(false);


  // New state for multiple emails
  const [emails, setEmails] = useState([
    { id: 1, brainType: "Architect", content: "", attachments: [] }
  ]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);

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

  // State to track active formatting
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
    orderedList: false
  });

  // Local form state
  const [sequenceName, setSequenceName] = useState("");
  const [category, setCategory] = useState("");
  const [brainType, setBrainType] = useState("Architect");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // ✅ always store backend keys in state
const [selectedTier, setSelectedTier] = useState([]); 

const toggleTier = (tier) => {
  setSelectedTier((prev) =>
    prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
  );
};

  // Ensure editor has focus and a valid caret position
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

  // Execute formatting commands
  const executeCommand = (command, value = null) => {
    focusEditorWithCaret();
    document.execCommand(command, false, value);
    updateActiveFormatting();
  };

  // Handle text alignment
  const handleAlignment = (alignment) => {
    executeCommand(`justify${alignment}`);
  };

  // Handle link insertion
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Handle file attachment
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  // removed: insertAtCursor helper (no longer inserting inline chips/images into editor)

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []).filter(isAllowedDoc);
    if (!files.length) return;

    const newItems = files.map((file) => {
      const url = URL.createObjectURL(file);
      const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name || '');
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      // Do not insert file name text into editor; keep editor clean.
      // For images, we also avoid inline insertion to prevent duplication with attachment preview.

      return { id, file, url, isImage };
    });

    setAttachments((prev) => [...prev, ...newItems]);
    // Clear input so selecting the same file again re-triggers change
    e.target.value = null;
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item && item.url && item.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
      return prev.filter((a) => a.id !== id);
    });
    // Remove from editor content as well
    if (editorRef.current) {
      const node = editorRef.current.querySelector(`[data-attachment-id="${id}"]`);
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
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
          chip.className = 'inline-block px-2 py-1 text-xs  bg-slate-700 text-slate-200';
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

      // Handle plain URL-only content (no anchors), e.g., content is just a direct file URL
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
          chip.className = 'inline-block px-2 py-1 text-xs  bg-slate-700 text-slate-200';
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
      // Cleanup object URLs on unmount
      attachments.forEach((a) => {
        if (a.url && a.url.startsWith('blob:')) URL.revokeObjectURL(a.url);
      });
    };
  }, [attachments]);

  // Handle image insertion
  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  // Update active formatting based on current selection
  const updateActiveFormatting = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.nodeType === 1 
      ? range.commonAncestorContainer 
      : range.commonAncestorContainer.parentElement;

    if (!parentElement) return;

    setActiveFormatting({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      // use command state for alignment toggles (boolean)
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      alignJustify: document.queryCommandState('justifyFull'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList')
    });
  };



  // Handle content change
  const handleContentChange = () => {
    // Update current email content in emails array
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEmails(prev => prev.map((email, i) => 
        i === currentEmailIndex 
          ? { ...email, content }
          : email
      ));
    }
  };

  // Handle selection change
  const handleSelectionChange = useCallback(() => {
    updateActiveFormatting();
  }, []);

  useEffect(() => {
    if (success) {
      toast.success(success);
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "Failed to send email");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Load categories on mount
  useEffect(() => {
    dispatch(fetchEmailCategories());
  }, [dispatch]);

  // If editing, fetch by id (if not already in store) and prefill form
  useEffect(() => {
    if (editSequenceId && (!currentSequence || currentSequence._id !== editSequenceId)) {
      dispatch(fetchEmailSequenceById(editSequenceId));
    }
  }, [dispatch, editSequenceId, currentSequence]);


useEffect(() => {
  if (
    editSequenceId &&
    currentSequence &&
    currentSequence._id === editSequenceId &&
    !emailsInitialized
  ) {
    setSequenceName(currentSequence.name || "");
    setCategory(currentSequence.category || "");

    // Tier mapping
    const reverseTierMap = { starter: "starter", growth: "growth", enterprise: "enterprise" };
    if (Array.isArray(currentSequence.tier)) {
      setSelectedTier(currentSequence.tier.map((t) => reverseTierMap[t] || t));
    } else if (currentSequence.tier) {
      setSelectedTier([reverseTierMap[currentSequence.tier] || currentSequence.tier]);
    } else {
      setSelectedTier([]);
    }

    // --- Initialize only once ---
    if (currentSequence.type === "file" && currentSequence.fileUrl) {
      const fileUrl = currentSequence.fileUrl;
      const fileName = fileUrl.split("/").pop() || "file";
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const isImg = isImageUrl(fileUrl);

      if (editorRef.current) editorRef.current.innerHTML = "";
      setAttachments([{ id, url: fileUrl, isImage: isImg, name: fileName }]);
    } else {
      const emailsArr = Array.isArray(currentSequence.emails) ? currentSequence.emails : [];

      if (editSingleEmail && editingEmailId) {
        // Edit one email only
        const targetEmail = emailsArr.find((e) => e._id === editingEmailId);
        if (targetEmail && editorRef.current) {
          const { html, attachments: extracted } = transformContentForEditor(targetEmail.content || "");
          editorRef.current.innerHTML = html;
          setAttachments(extracted);
          setBrainType(targetEmail.type || "Architect");

          setEmails([
            {
              id: 1,
              brainType: targetEmail.type || "Architect",
              content: html,
              attachments: extracted,
            },
          ]);
          setCurrentEmailIndex(0);
        }
      } else {
        // Load entire sequence
        const transformedEmails = emailsArr.map((email, index) => {
          const { html, attachments: extracted } = transformContentForEditor(email.content || "");
          return {
            id: index + 1,
            brainType: email.type || "Architect",
            content: html,
            attachments: extracted,
          };
        });

        if (transformedEmails.length > 0) {
          setEmails(transformedEmails);
          setCurrentEmailIndex(0);

          // Load first email into editor
          if (editorRef.current) {
            editorRef.current.innerHTML = transformedEmails[0].content || "";
          }
          setAttachments(transformedEmails[0].attachments || []);
          setBrainType(transformedEmails[0].brainType);
        }
      }
    }

    setEmailsInitialized(true);
  }
}, [
  editSequenceId,
  currentSequence,
  transformContentForEditor,
  editSingleEmail,
  editingEmailId,
  emailsInitialized,
]);

  const handleSend = () => {
    // Save current email content before submission
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      setEmails(prev => prev.map((email, i) => 
        i === currentEmailIndex 
          ? { ...email, content: currentContent, attachments: [...attachments] }
          : email
      ));
    }

    // Validate all emails have content
    const emailsWithContent = emails.map((email, index) => {
      if (index === currentEmailIndex) {
        return { ...email, content: editorRef.current?.innerHTML || "", attachments: [...attachments] };
      }
      return email;
    });

    const hasValidContent = emailsWithContent.some(email => 
      email.content.trim() || email.attachments.length > 0
    );

    if (!hasValidContent) {
      toast.error("Please add content or attach at least one file to at least one email");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!selectedTier) {
      toast.error("Please select a tier");
      return;
    }

    if (selectedTier.length === 0) {
    toast.error("Please select at least one tier");
    return;
  }

const payload = {
  name: sequenceName || "email",
  category: category || "test",
  type: "manual",
  brainType: brainType || "Challenger",
  status: "scheduled",
  tier: selectedTier,
  emails: emails.map(email => ({
    content: email.content,   // content saved from editor
    type: email.brainType || brainType
  }))
};





  if (editSingleEmail && editSequenceId && editingEmailId) {
    // ...
  } else if (editSequenceId) {
    dispatch(updateEmailSequence({ id: editSequenceId, updateData: payload }));
  } else {
    dispatch(createEmailSequence(payload));
  }
  };

  // Add new email function
  const addNewEmail = () => {
    const newId = Math.max(...emails.map(e => e.id)) + 1;
    const newEmail = {
      id: newId,
      brainType: "Architect",
      content: "",
      attachments: []
    };
    setEmails([...emails, newEmail]);
    setCurrentEmailIndex(emails.length); // Switch to the new email
  };

  // Remove email function
  const removeEmail = (emailId) => {
    if (emails.length === 1) {
      toast.error("At least one email is required");
      return;
    }
    
    const newEmails = emails.filter(e => e.id !== emailId);
    setEmails(newEmails);
    
    // Adjust current index if needed
    if (currentEmailIndex >= newEmails.length) {
      setCurrentEmailIndex(newEmails.length - 1);
    }
  };

  // Switch between emails
  const switchToEmail = (index) => {
    // Save current email content and attachments
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      setEmails(prev => prev.map((email, i) => 
        i === currentEmailIndex 
          ? { ...email, content: currentContent, attachments: [...attachments] }
          : email
      ));
    }
    
    setCurrentEmailIndex(index);
    
    // Load the selected email content and attachments
    const selectedEmail = emails[index];
    if (editorRef.current) {
      editorRef.current.innerHTML = selectedEmail.content || "";
    }
    setAttachments(selectedEmail.attachments || []);
    setBrainType(selectedEmail.brainType);
  };

  // Update current email's brain type
  const updateCurrentEmailBrainType = (newBrainType) => {
    setBrainType(newBrainType);
    setEmails(prev => prev.map((email, i) => 
      i === currentEmailIndex 
        ? { ...email, brainType: newBrainType }
        : email
    ));
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

  // Focus the editor when component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    try { document.execCommand('styleWithCSS', false, true); } catch {
      // no-op
    }
  }, []);

  // Add event listeners for selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  return (
    <div className="bg-[#2A2A39] p-2">
      <Toaster position="top-right" />
      {/* Sender Section */}
      <div className="flex items-center gap-3 mb-2 mt-4 ml-6">
        <img
          src="/Avatar.png"
          alt="Aneuro Admin"
          className="w-13 h-13 rounded-full border-2 border-cyan-400 bg-white object-cover"
        />
        <div>
          <div className="text-white text-sm font-semibold leading-tight">
            {localStorage.getItem('userName') || ''}
          </div>
          <div className="text-gray-300 text-xs leading-tight">
            {localStorage.getItem('userEmail') || ''}
          </div>
        </div>
      </div>
      {/* Basic details and access control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-6 mr-6 mt-10">
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="sequence-name">
            Name
          </label>
          <input
            id="sequence-name"
            type="text"
            placeholder="Input Field"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="w-full px-4 py-3  border border-gray-500  text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-white text-base" htmlFor="sequence-category">
              Select Category
            </label>
            <button
              type="button"
              onClick={() => { setShowAddCategory(true); setNewCategoryName(""); }}
              className="text-xs px-3 py-1 border border-gray-500 text-white hover:bg-gray-700"
            >
              Add New
            </button>
          </div>
          <select
            id="sequence-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3  border  border-gray-500 text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition bg-[#2A2A39]"
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
                className="flex-1 px-3 py-2  border border-gray-500 bg-transparent text-gray-200 focus:outline-none focus:border-blue-500"
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
              <button
                type="button"
                onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}
                className="px-3 py-2 border border-gray-500 text-white text-xs hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="brain-type">
            Brain Type
          </label>
          <select
            id="brain-type"
            className="w-full px-4 py-3  border border-gray-500 bg-[#2A2A39] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
            value={brainType}
            onChange={(e) => updateCurrentEmailBrainType(e.target.value)}
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
        <div
          className="relative p-6  bg-[#2A2A39]"
          style={{
            boxShadow:
              `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040`,
          }}
        >
          <h3 className="text-white text-sm font-medium mb-4">Tier Access Control</h3>
         <div className="space-y-3">
  {/* Basic Tier */}
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={selectedTier.includes("starter")}
      onChange={() => toggleTier("starter")}
    />
    <img src={StarIcon} alt="Basic" className="w-6 h-6 object-contain" />
    <div className="flex-1 ml-2">
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Basic</span>
        <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">
          1250 users
        </span>
      </div>
      <div className="text-gray-500 text-xs mt-1">Free tier users</div>
    </div>
  </div>

  {/* Premium Tier */}
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={selectedTier.includes("growth")}
      onChange={() => toggleTier("growth")}
    />
    <img src={KingIcon} alt="Premium" className="w-6 h-6 object-contain" />
    <div className="flex-1 ml-2">
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Premium</span>
        <span className="text-gray-400 text-xs px-2 py-0.5 rounded">
          330 users
        </span>
      </div>
      <div className="text-gray-400 text-xs mt-1">Paid subscribers</div>
    </div>
  </div>

  {/* Enterprise Tier */}
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={selectedTier.includes("enterprise")}
      onChange={() => toggleTier("enterprise")}
    />
    <img src={DiamondIcon} alt="Enterprise" className="w-6 h-6 object-contain" />
    <div className="flex-1 ml-2">
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">Enterprise</span>
        <span className="text-gray-400 text-xs px-2 py-0.5 rounded">
          55 users
        </span>
      </div>
      <div className="text-gray-400 text-xs mt-1">Corporate clients</div>
    </div>
  </div>
</div>

        </div>
      </div>

      {/* Email Tabs Section */}
      <div className="ml-6 mr-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Email Sequence</h3>
          <button
            type="button"
            onClick={addNewEmail}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black text-sm font-medium  hover:bg-cyan-300 transition-colors"
          >
            <Plus size={16} />
            Add Another Email
          </button>
        </div>
        
        {/* Email Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {emails.map((email, index) => (
            <div
              key={email.id}
              className={`flex items-center gap-2 px-4 py-2  cursor-pointer transition-all ${
                currentEmailIndex === index
                  ? 'bg-cyan-400 text-black'
                  : 'bg-[#2A2A39] text-white border border-gray-600 hover:bg-gray-700'
              }`}
              onClick={() => switchToEmail(index)}
            >
              <span className="text-sm font-medium">Email {index + 1}</span>
              <span className="text-xs opacity-75">({email.brainType})</span>
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEmail(email.id);
                  }}
                  className="ml-2 p-1  hover:bg-red-500 hover:text-white transition-colors"
                  title="Remove email"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-5">
        <div
          className="relative p-8 ml-6 mr-6 mt-2  bg-[#2A2A39]"
          style={{
            boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040`,
          }}
        >
          <label
            className="text-white text-base font-semibold mb-2 block border-b py-10 px-4"
            style={{ borderBottomColor: "#D1D1D180" }}
          >
            Write Your Email {emails.length > 1 ? `(${currentEmailIndex + 1} of ${emails.length})` : ''}
          </label>
          
          {/* Rich Text Editor Toolbar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Basic Formatting */}
              {formatButtons.map((button, index) => (
                <button
                  type="button"
                  key={index}
                  className={`p-2  transition-colors ${
                    activeFormatting[button.key]
                      ? 'bg-cyan-400 text-black'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={button.label}
                  onMouseDown={(e) => { e.preventDefault(); executeCommand(button.command); }}
                >
                  <button.icon size={16} />
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              
              {/* Alignment */}
              {alignButtons.map((button, index) => (
                <button
                  type="button"
                  key={index}
                  className={`p-2  transition-colors ${
                    activeFormatting[button.key]
                      ? 'bg-cyan-400 text-black'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={button.label}
                  onMouseDown={(e) => { e.preventDefault(); handleAlignment(button.alignment); }}
                >
                  <button.icon size={16} />
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              
              {/* Lists */}
              {listButtons.map((button, index) => (
                <button
                  type="button"
                  key={index}
                  className={`p-2  transition-colors ${
                    activeFormatting[button.key]
                      ? 'bg-cyan-400 text-black'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={button.label}
                  onMouseDown={(e) => { e.preventDefault(); executeCommand(button.command); }}
                >
                  <button.icon size={16} />
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              
              {/* Link and Media */}
              <button
                type="button"
                className="p-2  hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Insert Link"
                onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
              >
                <Link size={16} />
              </button>
              
              <button
                type="button"
                className="p-2  hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Attach File"
                onMouseDown={(e) => { e.preventDefault(); handleFileUpload(); }}
              >
                <Paperclip size={16} />
              </button>
              
              <button
                type="button"
                className="p-2  hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Insert Image"
                onMouseDown={(e) => { e.preventDefault(); handleImage(); }}
              >
                <Image size={16} />
              </button>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 px-2">
              {attachments.map((item) => {
                const { id, file, url, isImage } = item;
                return (
                  <div key={id} className="relative group border border-slate-600 -md p-2 pr-8 bg-[#1f2937] flex items-center gap-2">
                    {isImage ? (
                      <img
                        src={url}
                        alt={item.name || file?.name || 'image'}
                        className="w-12 h-12 object-cover "
                        onLoad={() => {
                          // no-op; URL revoked on remove/unmount
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12  bg-slate-700 flex items-center justify-center text-slate-300 text-xs">
                        {(item.name || file?.name || 'FILE').split('.').pop()?.toUpperCase() || 'FILE'}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-white text-xs max-w-[180px] truncate" title={item.name || file?.name}>{getTruncatedFileName(item.name || file?.name)}</span>
                      {file?.size != null && (
                        <span className="text-slate-400 text-[10px]">{(file.size / 1024).toFixed(1)} KB</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-slate-300 hover:text-white"
                      onClick={() => removeAttachment(id)}
                      aria-label="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rich Text Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="w-full p-4 text-sm outline-none text-white transition-all duration-200 min-h-[150px] max-h-[400px] overflow-y-auto bg-transparent"
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
            onInput={handleContentChange}
            onKeyDown={(e) => {
              // Handle Enter key for new lines
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onMouseUp={updateActiveFormatting}
            onKeyUp={updateActiveFormatting}
            data-placeholder="Write your email content here..."
          />
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            style={{ display: 'none' }}
          />
          
          {/* Placeholder styling */}
          <style jsx>{`
            [contenteditable][data-placeholder]:empty:before {
              content: attr(data-placeholder);
              color: #94a3b8;
              pointer-events: none;
            }
            [contenteditable] ul {
              list-style: disc;
              margin-left: 1.25rem;
              padding-left: 1.25rem;
            }
            [contenteditable] ol {
              list-style: decimal;
              margin-left: 1.25rem;
              padding-left: 1.25rem;
            }
            [contenteditable] li {
              margin: 0.25rem 0;
            }
          `}</style>
        </div>
        <div className="flex justify-start ml-6 mt-4">
          <button
            className="cursor-pointer bg-cyan-400 text-black font-semibold px-10 py-2  hover:bg-cyan-300 transition-all text-sm "
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (editSequenceId ? "Saving..." : "Adding...") : (editSequenceId ? "Save" : "Add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmailMannually;
