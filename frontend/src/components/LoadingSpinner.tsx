const LoadingSpinner: React.FC = () => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-[#3B6B82] rounded-full animate-spin"></div>
      </div>
    );
  };
  
  export default LoadingSpinner;