import React from "react";

const TextLoading: React.FC = () => {
  return (
    <div className="rounded-md p-4 w-full">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextLoading;
