import { useState } from "react";

export default function ComboboxSeach({ options, placeholder, onSelect,onSearchChange }) {

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  
  const handleSelect = (option) => {
    setSelected(option);
    setSearch(option.value);
    setIsOpen(false);

    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative">
      
      <input
        type="text"
        value={search}
        placeholder={placeholder}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearchChange(e.target.value)
          setIsOpen(true);
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      />
     
      {isOpen && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto z-10">
          
          {options.length === 0 && (
            <li className="p-2 text-gray-500">Aucun résultat</li>
          )}

          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="p-2 cursor-pointer hover:bg-blue-100"
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}