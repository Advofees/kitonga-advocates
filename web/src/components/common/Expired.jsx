
export function Expired({ onCancel = () => {}, onLogin = () => {} }) {

  return (
    <div className="fixed z-50 flex items-center justify-center inset-0 bg-gray-300/75">
      <div className="bg-white/50 p-8 rounded-lg border-2 border-amber-700">
        <h3 className="mb-4">
          Your login session has expired?
          <br />
          Please login again.
        </h3>
        <div className="flex">
          <button
            onClick={onCancel}
            className={`m-2 shadow hover:-translate-y-2 duration-300 shadow-black hover:bg-amber-700 hover:text-white rounded-lg block px-8 py-2`}
            type="submit"
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            className={`m-2 shadow hover:-translate-y-2 duration-300 shadow-black hover:bg-amber-700 hover:text-white rounded-lg block px-8 py-2`}
            type="submit"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
