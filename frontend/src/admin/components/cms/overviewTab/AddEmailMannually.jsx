import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { Bold, Italic, Underline, Strikethrough, Link, Paperclip, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react';
import DiamondIcon from "../../../../../public/icons/diamond.png";
import KingIcon from "../../../../../public/icons/king.png";
import StarIcon from "../../../../../public/icons/star.png";
import {
  createEmailSequence,
  fetchEmailCategories,
  selectEmailSequenceLoading,
  selectEmailSequenceError,
  selectEmailSequenceSuccess,
  clearError,
  clearSuccess,
} from "../../../../store/Slice/EmailSequenceSLice";

const AddEmailMannually = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectEmailSequenceLoading);
  const error = useSelector(selectEmailSequenceError);
  const success = useSelector(selectEmailSequenceSuccess);
  const categories = useSelector((state) => state.emailSequence.categories || []);
  const categoriesLoading = useSelector((state) => state.emailSequence.categoriesLoading);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

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
  const [selectedTier, setSelectedTier] = useState(""); // basic | premium | enterprise
  const [brainType] = useState("Architect"); // default for manual

  // Execute formatting commands
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      // In a real app, you would upload the file here
    }
  };

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
      alignLeft: document.queryCommandValue('justifyLeft') === 'left',
      alignCenter: document.queryCommandValue('justifyCenter') === 'center',
      alignRight: document.queryCommandValue('justifyRight') === 'right',
      alignJustify: document.queryCommandValue('justifyFull') === 'justify',
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList')
    });
  };

  // Get plain text content
  const getPlainTextContent = () => {
    return editorRef.current ? editorRef.current.textContent || '' : '';
  };

  // Get HTML content
  const getHtmlContent = () => {
    return editorRef.current ? editorRef.current.innerHTML || '' : '';
  };

  // Handle content change
  const handleContentChange = () => {
    // Content change is handled directly by the editor
    // No need to store in state since we get content on demand
  };

  // Handle selection change
  const handleSelectionChange = () => {
    updateActiveFormatting();
  };

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

  const handleSend = () => {
    const htmlContent = getHtmlContent();
    const plainTextContent = getPlainTextContent();
    
    if (!plainTextContent.trim()) {
      toast.error("Please write your email content first");
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

    // Map UI tier to backend tier values
    const tierMap = { basic: 'starter', premium: 'growth', enterprise: 'enterprise' };
    const backendTier = tierMap[selectedTier] || 'starter';

    // Build emails array per backend contract
    const emails = [
      { content: htmlContent, type: brainType }
    ];

    const payload = {
      name: sequenceName?.trim() || `Manual Email - ${new Date().toLocaleString()}`,
      tier: backendTier,
      type: "manual",
      brainType,
      category,
      emails
    };

    dispatch(createEmailSequence(payload));
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
  }, []);

  // Add event listeners for selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

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
            className="w-full px-4 py-3 rounded border border-gray-500  text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white text-base mb-2" htmlFor="sequence-category">
            Select Category
          </label>
          <select
            id="sequence-category"
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
        </div>
      </div>
      <div className="ml-6 mr-6 mt-3 w-[550px]">
        <div
          className="relative p-6 rounded bg-[#2A2A39]"
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
                className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
                checked={selectedTier === "basic"}
                onChange={() => setSelectedTier(selectedTier === "basic" ? "" : "basic")}
              />
              <img src={StarIcon} alt="Basic" className="w-6 h-6 object-contain" />
              <div className="flex-1 ml-2">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Basic</span>
                  <span className="bg-[#2A3344] text-gray-200 text-xs px-2 py-0.5 rounded">1250 users</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">Free tier users</div>
              </div>
            </div>

            {/* Premium Tier */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
                checked={selectedTier === "premium"}
                onChange={() => setSelectedTier(selectedTier === "premium" ? "" : "premium")}
              />
              <img src={KingIcon} alt="Premium" className="w-6 h-6 object-contain" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Premium</span>
                  <span className="text-gray-400 text-sm">330 users</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">Paid subscribers</div>
              </div>
            </div>

            {/* VIP / Enterprise Tier */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-gray-400 bg-transparent focus:ring-0 focus:outline-none accent-blue-500"
                checked={selectedTier === "enterprise"}
                onChange={() => setSelectedTier(selectedTier === "enterprise" ? "" : "enterprise")}
              />
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
      <div className="mb-4 mt-5">
        <div
          className="relative p-8 ml-6 mr-6 mt-2 rounded bg-[#2A2A39]"
          style={{
            boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040`,
          }}
        >
          <label
            className="text-white text-base font-semibold mb-2 block border-b py-10 px-4"
            style={{ borderBottomColor: "#D1D1D180" }}
          >
            Write Your Email
          </label>
          
          {/* Rich Text Editor Toolbar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Basic Formatting */}
              {formatButtons.map((button, index) => (
                <button
                  key={index}
                  className={`p-2 rounded transition-colors ${
                    activeFormatting[button.key]
                      ? 'bg-cyan-400 text-black'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={button.label}
                  onClick={() => executeCommand(button.command)}
                >
                  <button.icon size={16} />
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              
              {/* Alignment */}
              {alignButtons.map((button, index) => (
                <button
                  key={index}
                  className={`p-2 rounded transition-colors ${
                    activeFormatting[button.key]
                      ? 'bg-cyan-400 text-black'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={button.label}
                  onClick={() => handleAlignment(button.alignment)}
                >
                  <button.icon size={16} />
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              
              {/* Lists */}
              {listButtons.map((button, index) => (
                <button
                  key={index}
                  className={`p-2 rounded transition-colors ${
                    activeFormatting[button.key]
                      ? 'bg-cyan-400 text-black'
                      : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={button.label}
                  onClick={() => executeCommand(button.command)}
                >
                  <button.icon size={16} />
                </button>
              ))}
              
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              
              {/* Link and Media */}
              <button
                className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Insert Link"
                onClick={handleLink}
              >
                <Link size={16} />
              </button>
              
              <button
                className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Attach File"
                onClick={handleFileUpload}
              >
                <Paperclip size={16} />
              </button>
              
              <button
                className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Insert Image"
                onClick={handleImage}
              >
                <Image size={16} />
              </button>
            </div>
          </div>

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
            style={{ display: 'none' }}
          />
          
          {/* Placeholder styling */}
          <style jsx>{`
            [contenteditable][data-placeholder]:empty:before {
              content: attr(data-placeholder);
              color: #94a3b8;
              pointer-events: none;
            }
          `}</style>
        </div>
        <div className="flex justify-start ml-6 mt-4">
          <button
            className="cursor-pointer bg-cyan-400 text-black font-semibold px-10 py-2  hover:bg-cyan-300 transition-all text-sm "
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmailMannually;
