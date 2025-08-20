import React, { useState } from "react";

const AdminPermission = () => {
  const [permissions, setPermissions] = useState({
    resolveFeedbackTickets: true,
    manageUsers: true,
    viewAnalytics: true,
    manageContent: true,
    systemSettings: true,
    billingManagement: true,
    emailSequences: true,
    promptPacks: true,
  });

  const handleToggle = (permissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  };

  const handleAddAdmin = () => {
    console.log("Permissions granted:", permissions);
    // Handle adding admin with selected permissions
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    // Handle cancel action
  };

  const permissionList = [
    { key: 'resolveFeedbackTickets', label: 'Resolve Feedback Tickets' },
    { key: 'manageUsers', label: 'Manage Users' },
    { key: 'viewAnalytics', label: 'View Analytics' },
    { key: 'manageContent', label: 'Manage Content' },
    { key: 'systemSettings', label: 'System Settings' },
    { key: 'billingManagement', label: 'Billing Management' },
    { key: 'emailSequences', label: 'Email Sequences' },
    { key: 'promptPacks', label: 'Prompt Packs' },
  ];

  return (
    <div className=" text-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Admin Permissions</h1>
        <p className="text-gray-400 text-sm">
          Admin will get the access that you(as super admin) can grant.
        </p>
      </div>

      {/* Permissions List */}
      <div className="space-y-4 mb-8">
        {permissionList.map((permission) => (
          <div key={permission.key} className="flex items-center justify-between py-3 border-b border-[#374151]">
            <span className="text-white">{permission.label}</span>
            <button
              onClick={() => handleToggle(permission.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full   focus:ring-offset-[#16161C] ${
                permissions[permission.key] ? 'bg-[#12DCF0]' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  permissions[permission.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddAdmin}
          className="bg-[#12DCF0] text-black font-medium px-10 py-2 hover:bg-[#0FB8CC] transition-colors"
        >
          Add Admin
        </button>
        <button
          onClick={handleCancel}
          className="bg-transparent border border-[#12DCF0] text-white px-10 py-2 hover:bg-[#12DCF0] hover:text-black transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminPermission;
