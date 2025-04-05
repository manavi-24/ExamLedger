import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const AlertPopup = ({ type, message, onClose }) => {
  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };
  
  const IconComponent = iconMap[type] || Info;
  const colorMap = {
    success: 'green',
    error: 'red',
    info: 'indigo',
  };
  const color = colorMap[type] || 'indigo';

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
      <div className={`flex items-center p-4 rounded-lg shadow-lg bg-white border-l-4 border-${color}-500 min-w-[300px]`}>
        <IconComponent className={`h-6 w-6 mr-3 text-${color}-500`} />
        <div className="flex-1">
          <p className={`text-sm font-medium text-${color}-800`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 p-1 rounded-full hover:bg-${color}-50`}
        >
          <X className={`h-5 w-5 text-${color}-500`} />
        </button>
      </div>
    </div>
  );
};