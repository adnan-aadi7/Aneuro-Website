import { Bold, Italic, Underline, Strikethrough, Link, Paperclip, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';


const Texteditor=()=>{
const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Execute formatting commands
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
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
    const plainText = getPlainTextContent();
    setReplyText(plainText);
  };

  // Handle send
  const handleSend = () => {
    const htmlContent = getHtmlContent();
    const plainTextContent = getPlainTextContent();
    
    console.log('Reply Sent (HTML):', htmlContent);
    console.log('Reply Sent (Plain Text):', plainTextContent);
    
    // Clear the editor
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setReplyText('');
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

  // Focus the editor when component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
    return(
        <>
        <div className="mb-4  ">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Basic Formatting */}
            {formatButtons.map((button, index) => (
              <button
                key={index}
                className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
                className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
                className="p-2 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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

        <div className="mb-4">
          <div
            ref={editorRef}
            contentEditable
            className="w-full p-4 text-sm outline-none text-white transition-all duration-200 min-h-[150px] max-h-[400px] overflow-y-auto"
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

        </>
    )
}

export default Texteditor;