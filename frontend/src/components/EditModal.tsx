import { FaTasks } from "react-icons/fa";

import { SubmitHandler, UseFormRegister, FieldErrors } from "react-hook-form";

interface EditModalProps {
  isModalOpen: boolean;
  handleSubmit: (callback: SubmitHandler<any>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: (data: any) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  titleCharCount: number;
  setTitleCharCount: (count: number) => void;
  descCharCount: number;
  setDescCharCount: (count: number) => void;
  isDateFocused: boolean;
  setIsDateFocused: (focused: boolean) => void;
  isSubmitting: boolean;
  handleCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isModalOpen, handleSubmit, onSubmit, register, errors, titleCharCount, setTitleCharCount, descCharCount, setDescCharCount, isDateFocused, setIsDateFocused, isSubmitting, handleCancel }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-400 bg-opacity-80 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h2 className="text-xl mb-4 text-[#4D869C]">Edit Todo</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {/* Title Input with Character Counter */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-700 font-medium mb-1">Task Title</label>
            <div className="relative">
              <input
                id="title"
                {...register("title")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] placeholder-gray-600"
                onChange={(e) => setTitleCharCount(e.target.value.length)}
                maxLength={50}
              />
              <FaTasks className="absolute right-3 top-3 text-gray-400" />
            </div>
            {errors.title && typeof errors.title.message === 'string' && <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>}
            <div className="text-gray-500 text-xs text-right mt-1">{titleCharCount}/50</div>
          </div>

          {/* Description Input with Character Counter */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-700 font-medium mb-1">Task Description (optional)</label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] placeholder-gray-600"
              onChange={(e) => setDescCharCount(e.target.value.length)}
              maxLength={300}
            />
            {errors.description && typeof errors.description.message === 'string' && <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>}
            <div className="text-gray-500 text-xs text-right mt-1">{descCharCount}/300</div>
          </div>

          {/* Deadline Input */}
          <div className="flex flex-col">
            <label htmlFor="deadline" className="text-gray-700 font-medium mb-1">Deadline</label>
            <div className="relative mb-6">
              <input
                id="deadline"
                type="date"
                {...register("deadline")}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4D869C] focus:border-[#4D869C] placeholder-gray-600 ${!isDateFocused && !errors.deadline ? "text-gray-400" : "text-gray-900"}`}
                defaultValue=""
                onFocus={() => setIsDateFocused(true)}
                onBlur={(e) => {
                  setIsDateFocused(false);
                  if (!e.target.value) {
                    e.target.value = "";
                  }
                }}
              />
            </div>
            {errors.deadline && typeof errors.deadline.message === 'string' && <span className="text-red-500 text-sm mt-1">{errors.deadline.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#205781] hover:bg-[#4F959D] text-white py-2 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-[#CDE8E5]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Task..." : "Update Task"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;