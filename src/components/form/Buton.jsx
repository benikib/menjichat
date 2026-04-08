/**
 * @param {String} label
 * @param {Function} onClick
 * @param {String} type
 * @param {Boolean} disabled
 * @param {String} variant (primary, secondary, danger)
 */

const Button = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
}) => {

  const baseStyle =
    "px-5 py-2.5 rounded-lg font-medium transition focus:outline-none";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
};

export default Button;