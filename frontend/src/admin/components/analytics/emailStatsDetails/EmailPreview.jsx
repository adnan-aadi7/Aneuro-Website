import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmailSequenceById, selectCurrentSequence, selectEmailSequenceLoading } from "../../../../store/Slice/EmailSequenceSLice";

// const emails = [
//   {
//     id: 1,
//     title: "Email 1: 🥳 Welcome to Your Enterprise Training Access",
//     subtitle:
//       "Welcome to the Sales Mastery Course! This is the beginning of your journey...",
//     expanded: true,
//     content: (
//       <>
//         <div className="text-xs text-white/80 mb-4 mt-2">
//           Hi [First Name],
//           <br />
//           You've Been Granted Access To The Aneuro Enterprise Training Hub — A
//           Dedicated Space Designed To Help Your Team Stay Informed, Aligned, And
//           Productive.
//           <br />
//           Here's What You Can Do Within Your Dashboard:
//         </div>
//         <div className="grid grid-cols-2 gap-4 text-xs text-white/80 mt-5">
//           <div className="flex flex-col gap-2">
//             <div className="flex items-start gap-2">
//               <List className="w-4 h-4 text-cyan-400 mt-0.5" />
//               <span>
//                 <span className="font-semibold text-white">
//                   Training Modules:
//                 </span>
//                 <br />
//                 Explore Expert-Curated Resources Shared By Your Admin.
//               </span>
//             </div>
//             <div className="flex items-start gap-2 mt-5">
//               <List className="w-4 h-4 text-cyan-400 mt-0.5" />
//               <span>
//                 <span className="font-semibold text-white">
//                   Quiz Analytics:
//                 </span>
//                 <br />
//                 Review Quiz Performance And Engagement Trends For Better
//                 Insight.
//               </span>
//             </div>
//           </div>
//           <div className="flex flex-col gap-2">
//             <div className="flex items-start gap-2">
//               <List className="w-4 h-4 text-cyan-400 mt-0.5" />
//               <span>
//                 <span className="font-semibold text-white">
//                   Quiz Analytics:
//                 </span>
//                 <br />
//                 Review Quiz Performance And Engagement Trends For Better
//                 Insight.
//               </span>
//             </div>
//           </div>
//         </div>
//       </>
//     ),
//   },
//   {
//     id: 2,
//     title: "Email 1: Welcome & Introduction",
//     subtitle:
//       "Welcome to the Sales Mastery Course! This is the beginning of your journey...",
//     expanded: false,
//     content: null,
//   },
// ];

const EmailPreview = ({ sequenceId }) => {
  const dispatch = useDispatch();
  const sequence = useSelector(selectCurrentSequence);
  const loading = useSelector(selectEmailSequenceLoading);

  useEffect(() => {
    if (sequenceId) {
      dispatch(fetchEmailSequenceById(sequenceId));
    }
  }, [dispatch, sequenceId]);

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

  return (
    <div className="w-full bg-[#303041] mx-auto p-4 mt-5">
      <div className="flex items-center justify-between">
        <div className="text-lg text-white mb-3">Email Preview</div>
        {loading ? (
          <div className="text-xs text-white/60 mb-3">Loading…</div>
        ) : null}
      </div>

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
                className={`bg-[#232334] border border-[#353545] rounded mb-14 pb-8`}
              >
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
    </div>
  );
};

export default EmailPreview;
