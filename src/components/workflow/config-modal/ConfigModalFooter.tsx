import React from 'react';

interface ConfigModalFooterProps {
    onClose: () => void;
    onSave: () => void;
}

export const ConfigModalFooter: React.FC<ConfigModalFooterProps> = ({ onClose, onSave }) => {
    return (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 z-10">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Cancel
            </button>
            <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-200 transition-all active:scale-95">
                Save Configuration
            </button>
        </div>
    );
};
