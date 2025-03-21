interface ConfirmCompletionModalProps {
  isConfirmModalOpen: boolean;
  confirmCompletion: () => void;
  cancelCompletion: () => void;
}

const ConfirmCompletionModal = ({ isConfirmModalOpen, confirmCompletion, cancelCompletion }: ConfirmCompletionModalProps) => {
  if (!isConfirmModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-80 backdrop-blur-md p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-xl mb-4 text-[#4D869C]">Confirm Completion</h2>
        <p className="mb-4 text-center">Are you sure you want to mark this task as complete?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={cancelCompletion}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmCompletion}
            className="bg-[#205781] hover:bg-[#4F959D] text-white py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCompletionModal;