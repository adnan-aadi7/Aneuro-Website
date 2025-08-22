import React, { useEffect, useState } from "react";
import { ChevronRight, Edit, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchEmailSequenceById, selectCurrentSequence, selectEmailSequenceLoading, deleteEmailInSequence } from "../../../../store/Slice/EmailSequenceSLice";
import axios from "../../../../store/axiosInstance";

const EmailPreview = ({ sequenceId }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const sequence = useSelector(selectCurrentSequence);
  const loading = useSelector(selectEmailSequenceLoading);
  
  
  // State for category view
  const [categoryEmails, setCategoryEmails] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isCategoryView, setIsCategoryView] = useState(false);
  
  // State for controlling email display
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [showAllCategoryEmails, setShowAllCategoryEmails] = useState(false);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, sequenceId: null, emailId: null, isCategory: false });

  useEffect(() => {
    // Check if we're viewing from category (grouped view)
    const categoryData = location.state;
    if (categoryData?.category && categoryData?.sequenceIds) {
      setIsCategoryView(true);
      fetchCategoryEmails(categoryData.sequenceIds);
    } else {
      setIsCategoryView(false);
      if (sequenceId) {
        dispatch(fetchEmailSequenceById(sequenceId));
      }
    }
  }, [dispatch, sequenceId, location.state]);

  const fetchCategoryEmails = async (sequenceIds) => {
    setCategoryLoading(true);
    try {
      const allEmails = [];
      
      // Fetch each sequence and collect all emails
      for (const id of sequenceIds) {
        try {
          const response = await axios.get(`/email-sequences/${id}`);
          if (response.data?.success && response.data?.data) {
            const seq = response.data.data;
            if (seq.type === 'file' && seq.fileUrl) {
              allEmails.push({
                id: seq._id,
                sequenceName: seq.name,
                type: 'file',
                fileUrl: seq.fileUrl,
                brainType: seq.brainType,
                tier: seq.tier
              });
            } else if (seq.emails && Array.isArray(seq.emails)) {
              seq.emails.forEach((email, index) => {
                allEmails.push({
                  id: `${seq._id}-${email._id || index}`,
                  sequenceId: seq._id,
                  emailId: email._id,
                  sequenceName: seq.name,
                  type: 'manual',
                  content: email.content,
                  brainType: email.type || seq.brainType,
                  tier: seq.tier,
                  emailNumber: index + 1
                });
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching sequence ${id}:`, error);
        }
      }
      
      setCategoryEmails(allEmails);
    } catch (error) {
      console.error('Error fetching category emails:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const openConfirmDelete = (sequenceId, emailId, isCategory = false) => {
    setConfirmModal({ open: true, sequenceId, emailId, isCategory });
  };

  const closeConfirmDelete = () => setConfirmModal({ open: false, sequenceId: null, emailId: null, isCategory: false });

  const confirmDeleteEmail = async () => {
    const { sequenceId, emailId, isCategory } = confirmModal;
    if (!sequenceId || !emailId) return;
    try {
      await dispatch(deleteEmailInSequence({ sequenceId, emailId })).unwrap();
      if (isCategory) {
        setCategoryEmails((prev) => prev.filter((e) => !(e.sequenceId === sequenceId && e.emailId === emailId)));
      } else {
        dispatch(fetchEmailSequenceById(sequenceId));
      }
    } catch (err) {
      console.error('Failed to delete email:', err);
    } finally {
      closeConfirmDelete();
    }
  };

  const documentUrl = sequence?.type === 'file' ? sequence?.fileUrl : null;
  const manualEmails = Array.isArray(sequence?.emails) ? sequence.emails : [];
  const fileEmailId = Array.isArray(sequence?.emails) && sequence.emails.length > 0 ? sequence.emails[0]?._id : null;

  const getFileExtension = (url) => {
    try {
      const cleanUrl = url.split('?')[0];
      const parts = cleanUrl.split('.');
      return parts.length > 1 ? parts.pop().toLowerCase() : '';
    } catch {
      return '';
    }
  };

  
  // removed legacy renderFilePreview (inlined custom card used instead)

  const renderCategoryEmails = () => {
    if (categoryLoading) {
      return (
        <div className="bg-[#232334] border border-[#353545] rounded p-6 text-white/70 text-sm">
          Loading category emails...
        </div>
      );
    }

    if (categoryEmails.length === 0) {
      return (
        <div className="bg-[#232334] border border-[#353545] rounded p-6 text-white/70 text-sm">
          No emails found in this category.
        </div>
      );
    }

    // Show only first 2 emails initially, or all if showAllCategoryEmails is true
    const emailsToShow = showAllCategoryEmails ? categoryEmails : categoryEmails.slice(0, 2);

    return (
      <>
                 {emailsToShow.map((emailItem) => (
          <div
            key={emailItem.id}
            className="bg-[#232334] border border-[#353545] rounded mb-6 pb-6 relative"
          >
            {emailItem.type === 'manual' && (
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Edit Email"
                  onClick={() => navigate(`/admin/mannual-email/${emailItem.sequenceId}`, { state: { sequenceId: emailItem.sequenceId, emailId: emailItem.emailId, editSingleEmail: true } })}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Delete Email"
                  onClick={() => openConfirmDelete(emailItem.sequenceId, emailItem.emailId, true)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex-1">
                <div className="text-sm text-white font-semibold">
                  {emailItem.type === 'file' ? (
                    `File: ${emailItem.sequenceName}`
                  ) : (
                    `Email ${emailItem.emailNumber}: ${emailItem.sequenceName}`
                  )}
                </div>
                <div className="text-xs text-cyan-400 mt-2">
                  Brain Type: {emailItem.brainType} | Tier: {emailItem.tier}
                </div>
                {emailItem.type === 'manual' && emailItem.content && (
                  <div className="text-xs text-cyan-400 leading-tight mt-2">
                    Preview below
                  </div>
                )}
              </div>
                             {emailItem.type === 'file' ? (
                 <a
                   href={emailItem.fileUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="bg-[#232334] border border-cyan-400 text-white text-xs px-4 py-2  hover:bg-cyan-900 transition ml-4 inline-flex items-center gap-2"
                 >
                   View File
                   <ChevronRight className="w-4 h-4 text-cyan-400" />
                 </a>
               ) : (
                 <button className="bg-[#232334] border border-cyan-400 text-white text-xs px-4 py-2  hover:bg-cyan-900 transition ml-4">
                   View Full Email
                 </button>
               )}
            </div>
            
                         {emailItem.type === 'manual' && emailItem.content && (
               <div className="px-6 mt-4 text-xs text-white/80 whitespace-pre-wrap">
                 {emailItem.content}
               </div>
             )}
          </div>
        ))}
        
        <div className="flex justify-center mt-8">
          <div className="text-white text-sm">
            Total: {categoryEmails.length} emails in this category
          </div>
        </div>
        
        {/* Show View All Emails button if there are more than 2 emails */}
        {categoryEmails.length > 2 && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => setShowAllCategoryEmails(!showAllCategoryEmails)}
              className="border border-cyan-400 text-white text-xs px-12 py-3 rounded hover:bg-cyan-900 transition"
            >
              {showAllCategoryEmails ? 'Show Less' : `View All ${categoryEmails.length} Emails`}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full bg-[#303041] mx-auto p-4 mt-5">
      <div className="flex items-center justify-between">
        <div className="text-lg text-white mb-3">
          {isCategoryView ? 'Category Email Preview' : 'Email Preview'}
        </div>
        {loading || categoryLoading ? (
          <div className="text-xs text-white/60 mb-3">Loading…</div>
        ) : null}
      </div>

      {/* Show category emails if viewing from category, otherwise show single sequence */}
      {isCategoryView ? (
        renderCategoryEmails()
      ) : (
        <>
          {/* If sequence is file-based, show only the button; otherwise render manual emails */}
          {!loading && sequence?.type === 'file' && documentUrl ? (
            // File-based sequence preview with action icons
            <div className="bg-[#232334] border border-[#353545] rounded mb-6 relative">
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Edit Email"
                  onClick={() =>
                    navigate(`/admin/mannual-email/${sequenceId}`, {
                      state: fileEmailId
                        ? { sequenceId, emailId: fileEmailId, editSingleEmail: true }
                        : { sequenceId, editSingleEmail: true },
                    })
                  }
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className={`text-gray-400 hover:text-white transition-colors ${!fileEmailId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Delete Email"
                  onClick={() => fileEmailId && openConfirmDelete(sequenceId, fileEmailId, false)}
                  disabled={!fileEmailId}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 pt-10 pb-2">
                <div className="text-sm text-white font-semibold">
                  {(() => { const ext = getFileExtension(documentUrl); return ext === 'pdf' ? 'Uploaded PDF' : (["png","jpg","jpeg","gif","webp","svg"].includes(ext) ? 'Uploaded Image' : 'Uploaded Document'); })()}
                </div>
              </div>
              <div className="px-6 pb-6">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-3 py-2  border border-cyan-400 text-white hover:bg-cyan-900 transition"
                >
                  View Email Document
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>
          ) : (
            <>
              {manualEmails.length === 0 ? (
                <div className="bg-[#232334] border border-[#353545] rounded p-6 text-white/70 text-sm">
                  No emails found for this sequence.
                </div>
              ) : (
                // Show only first 2 emails initially, or all if showAllEmails is true
                (showAllEmails ? manualEmails : manualEmails.slice(0, 2)).map((emailItem, index) => (
                  <div
                    key={index}
                    className={`bg-[#232334] border border-[#353545] rounded mb-14 pb-8 relative`}
                  >
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Edit Email"
                        onClick={() => navigate(`/admin/mannual-email/${sequenceId}`, { state: { sequenceId, emailId: emailItem._id, editSingleEmail: true } })}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Delete Email"
                        onClick={() => openConfirmDelete(sequenceId, emailItem._id, false)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between px-6 pt-10">
                      <div>
                        <div className="text-sm text-white font-semibold">
                          {`Email ${index + 1}${emailItem?.type ? `: ${emailItem.type}` : ''}`}
                        </div>
                        {emailItem?.content ? (
                          <div className="text-xs text-cyan-400 leading-tight mt-4 mb-4">
                            Preview below
                          </div>
                        ) : null}
                      </div>
                      <button className="bg-[#232334] border border-cyan-400 text-white text-xs px-6 py-3 rounded hover:bg-cyan-900 transition ml-6">
                        View Full Email
                      </button>
                    </div>
                    {emailItem?.content && (
                      <div className="px-6 mt-6 text-xs text-white/80 whitespace-pre-wrap">
                        {emailItem.content}
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Show View All Emails button only if there are more than 2 emails */}
              {manualEmails.length > 2 && (
                <div className="flex justify-center mt-16">
                  <button 
                    onClick={() => setShowAllEmails(!showAllEmails)}
                    className="border border-cyan-400 text-white text-xs px-12 py-3 rounded hover:bg-cyan-900 transition"
                  >
                    {showAllEmails ? 'Show Less' : `View All ${manualEmails.length || 0} Emails`}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1F2937]  p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Delete Email</h3>
              <button onClick={closeConfirmDelete} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this email? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={closeConfirmDelete} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">Cancel</button>
              <button onClick={confirmDeleteEmail} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailPreview;
