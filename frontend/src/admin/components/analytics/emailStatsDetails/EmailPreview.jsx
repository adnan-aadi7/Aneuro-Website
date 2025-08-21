import React, { useEffect, useState } from "react";
import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchEmailSequenceById, selectCurrentSequence, selectEmailSequenceLoading } from "../../../../store/Slice/EmailSequenceSLice";
import axios from "../../../../store/axiosInstance";

const EmailPreview = ({ sequenceId }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sequence = useSelector(selectCurrentSequence);
  const loading = useSelector(selectEmailSequenceLoading);
  
  // State for category view
  const [categoryEmails, setCategoryEmails] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [isCategoryView, setIsCategoryView] = useState(false);

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
                  id: `${seq._id}-${index}`,
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

  const documentUrl = sequence?.type === 'file' ? sequence?.fileUrl : null;
  const manualEmails = Array.isArray(sequence?.emails) ? sequence.emails : [];

  const getFileExtension = (url) => {
    try {
      const cleanUrl = url.split('?')[0];
      const parts = cleanUrl.split('.');
      return parts.length > 1 ? parts.pop().toLowerCase() : '';
    } catch {
      return '';
    }
  };

  const renderFilePreview = (url) => {
    const ext = getFileExtension(url);

    // Uniform card with only the "View Uploaded Document" button, no inline preview
    const titleByExt = ext === 'pdf' ? 'Uploaded PDF' : ["png","jpg","jpeg","gif","webp","svg"].includes(ext) ? 'Uploaded Image' : 'Uploaded Document';

    return (
      <div className="bg-[#232334] border border-[#353545] rounded mb-6">
        <div className="px-6 pt-6 pb-2">
          <div className="text-sm text-white font-semibold">{titleByExt}</div>
        </div>
        <div className="px-6 pb-6">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-3 py-2  border border-cyan-400 text-white hover:bg-cyan-900 transition"
          >
            View Uploaded Document
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </div>
    );
  };

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

    return (
      <>
                 {categoryEmails.map((emailItem) => (
          <div
            key={emailItem.id}
            className="bg-[#232334] border border-[#353545] rounded mb-6 pb-6 relative"
          >
            {emailItem.type === 'manual' && (
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Edit Email"
                  onClick={() => {}}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Delete Email"
                  onClick={() => {}}
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
            renderFilePreview(documentUrl)
          ) : (
            <>
              {manualEmails.length === 0 ? (
                <div className="bg-[#232334] border border-[#353545] rounded p-6 text-white/70 text-sm">
                  No emails found for this sequence.
                </div>
              ) : (
                manualEmails.map((emailItem, index) => (
                  <div
                    key={index}
                    className={`bg-[#232334] border border-[#353545] rounded mb-14 pb-8 relative`}
                  >
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Edit Email"
                        onClick={() => {}}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Delete Email"
                        onClick={() => {}}
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
              <div className="flex justify-center mt-16">
                <button className="border border-cyan-400 text-white text-xs px-12 py-3 rounded hover:bg-cyan-900 transition">
                  {`View All ${manualEmails.length || 0} Emails`}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EmailPreview;
