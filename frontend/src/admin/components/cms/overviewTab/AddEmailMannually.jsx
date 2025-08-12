import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { Bold, Italic, Underline, Strikethrough, Link, Paperclip, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react';
import {
  createEmailSequence,
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

  const handleSend = () => {
    const htmlContent = getHtmlContent();
    const plainTextContent = getPlainTextContent();
    
    if (!plainTextContent.trim()) {
      toast.error("Please write your email content first");
      return;
    }

    const payload = {
      name: `Manual Email - ${new Date().toLocaleString()}`,
      tier: "basic",
      type: "manual",
      manualContent: htmlContent, // Use HTML content for rich formatting
      plainTextContent: plainTextContent
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
          className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-white object-cover"
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
      <div className="mb-4">
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
