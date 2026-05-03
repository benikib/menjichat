/**
 * @param {string} label
 * @param {string} placeholder
 * @param {string} type
 * @param {string} name
 * @param {string} value
 * @param {function} onChange
 */

export function Input({ label, placeholder, type = "text", name, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-black">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        required
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
    </div>
  );
}

export default Input;