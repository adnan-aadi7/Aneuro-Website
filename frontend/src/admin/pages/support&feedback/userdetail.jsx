import Openticket from '../../components/support&feedback/openticket';
import Closeticket from '../../components/support&feedback/closeticket';
import CloseTicketReply from '../../components/support&feedback/CloseTicketReply';
import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, Link, Paperclip, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, addReplyToTicket, updateTicketStatus, getTicketById } from '../../../store/Slice/TicketSlice';

const Userdetail = () => {
  const location = useLocation();
  const { ticketId } = useParams();
  const ticketFromState = location.state?.ticket;
  const dispatch = useDispatch();
  const allTickets = useSelector((state) => state.ticket.tickets);
  const currentTicket = useSelector((state) => state.ticket.currentTicket);
  const { loading, error } = useSelector((state) => state.ticket);
  const [activeTab, setActiveTab] = useState('open');
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [closeLoading, setCloseLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Determine which ticket to use
  const ticket = ticketFromState || currentTicket;

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fetch ticket by ID if not available in state
  useEffect(() => {
    if (ticketId && !ticketFromState) {
      dispatch(getTicketById(ticketId));
    }
  }, [dispatch, ticketId, ticketFromState]);

  // Fetch all tickets for this user on mount
  useEffect(() => {
    if (ticket?.email) {
      dispatch(getTickets({ email: ticket.email }));
    }
  }, [dispatch, ticket?.email]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  // Show toast for no ticket found
  useEffect(() => {
    if (!loading && !ticket && ticketId) {
      showToast('Ticket not found', 'error');
    }
  }, [loading, ticket, ticketId]);

  // Loading state
  if (loading && !ticket) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12DCF0] mx-auto mb-4"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  // No ticket found - show empty state with toast
  if (!ticket) {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No ticket data available</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-[#12DCF0] text-black px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Filter tickets by status
  const openTickets = allTickets.filter(t => t.status !== 'CLOSED');
  const closedTickets = allTickets.filter(t => t.status === 'CLOSED');

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
  const handleSend = async () => {
    const htmlContent = getHtmlContent();
    if (!ticket?._id) return;
    
    setReplyLoading(true);
    try {
      await dispatch(addReplyToTicket({
        ticketId: ticket._id,
        replyData: {
          message: htmlContent,
          repliedBy: 'admin',
        },
      }));
      
      // Show success message
      showToast('Reply sent successfully!', 'success');
      
      dispatch(getTickets({ email: ticket.email }));
    } catch (error) {
      console.error('Failed to send reply:', error);
      showToast('Failed to send reply. Please try again.', 'error');
    } finally {
      setReplyLoading(false);
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      setReplyText('');
    }
  };

  // Handle close ticket
  const handleCloseTicket = async () => {
    if (!ticket?._id) return;
    
    setCloseLoading(true);
    try {
      await dispatch(updateTicketStatus({ 
        ticketId: ticket._id, 
        status: 'CLOSED' 
      })).unwrap();
      
      // Show success message
      showToast('Ticket closed successfully!', 'success');
      
      // Refresh tickets list
      dispatch(getTickets({ email: ticket.email }));
      
      // Switch to closed tab
      setActiveTab('closed');
      setShowReply(false);
    } catch (error) {
      console.error('Failed to close ticket:', error);
      showToast('Failed to close ticket. Please try again.', 'error');
    } finally {
      setCloseLoading(false);
    }
  };

  // Handle reopen ticket
  const handleReopenTicket = async (ticketId) => {
    try {
      await dispatch(updateTicketStatus({ 
        ticketId: ticketId, 
        status: 'OPEN' 
      })).unwrap();
      
      // Show success message
      showToast('Ticket reopened successfully!', 'success');
      
      // Refresh tickets list
      dispatch(getTickets({ email: ticket.email }));
      
      // Switch to open tab
      setActiveTab('open');
    } catch (error) {
      console.error('Failed to reopen ticket:', error);
      showToast('Failed to reopen ticket. Please try again.', 'error');
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
                src={ticket?.profileImage || "/Frame 1000006611.png"}
                alt={ticket?.name || "avatar"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{ticket?.name || "No Name"}</p>
                <p className="text-sm text-gray-400">{ticket?.email || "No Email"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <select className="bg-[#2A2A39] border border-gray-600 px-4 py-2  text-sm outline-none">
                <option>Assign To Admin</option>
                <option>Support Agent</option>
              </select>

              {activeTab === 'open' && (
                <>
                  <button
                    onClick={() => setShowReply(!showReply)}
                    className="bg-transparent cursor-pointer border border-gray-600 px-4 py-2 text-sm font-medium"
                  >
                    Reply To This
                  </button>
                  <button
                    onClick={handleCloseTicket}
                    disabled={closeLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {closeLoading ? 'Closing...' : 'Close Ticket'}
                  </button>
                </>
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
          {activeTab === 'open' && <Openticket tickets={openTickets} />}
          {activeTab === 'closed' && (
            <div className="mt-8">
              <Closeticket tickets={closedTickets} onReopenTicket={handleReopenTicket} />
            </div>
          )}

          {/* Reply Section (only in open tab) */}
          {activeTab === 'open' && showReply && (
            <div className=" mt-8   ">
        <h2 className="text-xl font-medium text-white mb-6">Reply to {ticket?.name || "User"}</h2>
        
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
            disabled={!replyText.trim() || replyLoading}
            className="px-12 cursor-pointer py-3 bg-[#12DCF0] text-black font-semibold mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {replyLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>

       
      </div>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
          toast.type === 'success' 
            ? 'bg-green-600 text-white border border-green-500' 
            : 'bg-red-600 text-white border border-red-500'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdetail;
