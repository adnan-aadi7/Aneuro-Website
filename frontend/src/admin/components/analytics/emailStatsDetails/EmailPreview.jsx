import React, { useEffect } from "react";
import { ChevronRight, ChevronDown, List } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchEmailSequenceById } from "../../../../store/Slice/EmailSequenceSLice";

const emails = [
  {
    id: 1,
    title: "Email 1: 🥳 Welcome to Your Enterprise Training Access",
    subtitle:
      "Welcome to the Sales Mastery Course! This is the beginning of your journey...",
    expanded: true,
    content: (
      <>
        <div className="text-xs text-white/80 mb-4 mt-2">
          Hi [First Name],
          <br />
          You've Been Granted Access To The Aneuro Enterprise Training Hub — A
          Dedicated Space Designed To Help Your Team Stay Informed, Aligned, And
          Productive.
          <br />
          Here's What You Can Do Within Your Dashboard:
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-white/80 mt-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <List className="w-4 h-4 text-cyan-400 mt-0.5" />
              <span>
                <span className="font-semibold text-white">
                  Training Modules:
                </span>
                <br />
                Explore Expert-Curated Resources Shared By Your Admin.
              </span>
            </div>
            <div className="flex items-start gap-2 mt-5">
              <List className="w-4 h-4 text-cyan-400 mt-0.5" />
              <span>
                <span className="font-semibold text-white">
                  Quiz Analytics:
                </span>
                <br />
                Review Quiz Performance And Engagement Trends For Better
                Insight.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <List className="w-4 h-4 text-cyan-400 mt-0.5" />
              <span>
                <span className="font-semibold text-white">
                  Quiz Analytics:
                </span>
                <br />
                Review Quiz Performance And Engagement Trends For Better
                Insight.
              </span>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 2,
    title: "Email 1: Welcome & Introduction",
    subtitle:
      "Welcome to the Sales Mastery Course! This is the beginning of your journey...",
    expanded: false,
    content: null,
  },
];

const EmailPreview = ({ sequenceId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (sequenceId) {
      dispatch(fetchEmailSequenceById(sequenceId));
    }
  }, [dispatch, sequenceId]);

  return (
    <div className="w-full bg-[#303041] mx-auto p-4 mt-5">
      <div className="text-lg text-white mb-3">Email Preview</div>
      {emails.map((email) => (
        <div
          key={email.id}
          className={`bg-[#232334] border border-[#353545] rounded mb-14 ${
            email.expanded ? "pb-14" : "pb-8"
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-10">
            <div>
              <div className="text-sm text-white font-semibold">
                {email.title}
              </div>
              <div className="text-xs text-cyan-400 leading-tight mt-4 mb-4">
                {email.subtitle}
              </div>
            </div>
            <button className="bg-[#232334] border border-cyan-400 text-white text-xs px-6 py-3 rounded hover:bg-cyan-900 transition ml-6">
              View Full Email
            </button>
          </div>
          {email.expanded && <div className="px-6 mt-10">{email.content}</div>}
        </div>
      ))}
      <div className="flex justify-center mt-16">
        <button className="border border-cyan-400 text-white text-xs px-12 py-3 rounded hover:bg-cyan-900 transition">
          View All 12 Emails
        </button>
      </div>
    </div>
  );
};

export default EmailPreview;
