/* eslint-disable react/prop-types */
const DeleteForm = ({ closeToast, deleteFn, text, isPending }) => (
  <div>
    <p>{text}</p>
    <div className="mt-3">
      <button
        className="bg-red-500 px-2 py-1 rounded-md me-2"
        onClick={deleteFn}
        disabled={isPending}
      >
        Delete
      </button>
      <button
        onClick={closeToast}
        className="bg-white text-black px-2 py-1 rounded-md"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default DeleteForm;
