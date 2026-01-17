export const FormActions = () => {
  return (
    <div className="items-center box-border caret-transparent flex justify-between">
      <button
        type="button"
        className="text-white font-bold bg-slate-600 caret-transparent block text-center px-4 py-2 rounded-bl rounded-br rounded-tl rounded-tr"
      >
        Sign In
      </button>
      <a
        href="pages/auth/forgot-password.html"
        className="text-emerald-500 text-sm font-bold box-border caret-transparent block leading-5"
      >
        Forgot Password?
      </a>
    </div>
  );
};
