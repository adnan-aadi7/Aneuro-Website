import Openticket from '../../components/support&feedback/openticket';
import Closeticket from '../../components/support&feedback/closeticket';
import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, Link, Paperclip, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react';

const Userdetail = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
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

  return (
    <div className="text-white">
      <div>
        <h1 className="text-[32px] font-medium inline-block pb-1">Support Center</h1>
        <p className="text-[20px] opacity-70 mt-1">Let's make the day productive</p>
      </div>

      <div
        className="p-2 md:p-6 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
        style={{
          backgroundImage: `url('/Frame 2.png')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="p-2 md:p-6 rounded-md mb-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-3  md:justify-between md:items-center">
            <div className="flex items-center gap-4">
              <img
                src="/Frame 1000006611.png"
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Devon Lane</p>
                <p className="text-sm text-gray-400">yourname@gmail.com</p>
              </div>
            </div>

            <div className="flex gap-3">
              <select className="bg-transparent border border-gray-600 px-4 py-2  text-sm outline-none">
                <option>Assign To Admin</option>
                <option>Support Agent</option>
              </select>

              {activeTab === 'open' && (
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="bg-transparent cursor-pointer border border-gray-600 px-4 py-2 text-sm  font-medium"
                >
                  Reply To This
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-12 border-b border-gray-700 text-sm">
            <button
              onClick={() => {
                setActiveTab('open');
                setShowReply(false);
              }}
              className={`pb-2 px-4 border-b-2 cursor-pointer ${
                activeTab === 'open'
                  ? 'border-[#12DCF0] text-[#12DCF0]'
                  : 'border-transparent text-gray-400'
              }`}
            >
              Open Ticket
            </button>
            <button
              onClick={() => {
                setActiveTab('closed');
                setShowReply(false);
              }}
              className={`pb-2 px-4 border-b-2 cursor-pointer ${
                activeTab === 'closed'
                  ? 'border-[#12DCF0] text-[#12DCF0]'
                  : 'border-transparent text-gray-400'
              }`}
            >
              Close Ticket
            </button>
          </div>

          {/* Ticket Message */}
          {activeTab === 'open' && <Openticket />}
          {activeTab === 'closed' && <Closeticket />}

          {/* Reply Section (only in open tab) */}
          {activeTab === 'open' && showReply && (
            <div className=" mt-8   ">
        <h2 className="text-xl font-medium text-white mb-6">Reply to Devon</h2>
        
        {/* Formatting Toolbar */}
        <div className='border border-[#FFFFFF8F] '>
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

        {/* Rich Text Editor */}
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
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="*/*"
        />

        {/* Send Button and Stats */}
        <div className="flex justify-between items-center">
          
          
          <button
            onClick={handleSend}
            className="px-12 cursor-pointer py-3 bg-[#12DCF0] text-black font-semibold mt-5"
            disabled={!replyText.trim()}
          >
            Send
          </button>
        </div>

       
      </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userdetail;
