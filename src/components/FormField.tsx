export type FormFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  variant: string;
};

export const FormField = (props: FormFieldProps) => {
  return (
    <div className={`box-border caret-transparent ${props.variant}`}>
      <label className="text-gray-800 text-sm font-bold box-border caret-transparent block leading-5 mb-2">
        {props.label}
      </label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        className="text-gray-800 shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px] box-border caret-transparent leading-5 w-full border border-gray-200 px-3 py-2 rounded-bl rounded-br rounded-tl rounded-tr border-solid"
      />
    </div>
  );
};
