/**
 * @param {String} label;
 * @param {Array} options;
 * @param {Function} onChange;
 * @param {String} defaultValue;
 */

const ComboBox=({label,children,onChange,defaultValue})=>{
    return <div>
        <label className="block mb-1 text-sm font-medium">{label}</label>
        <select value={defaultValue} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 
        font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
            {
                children
            }
        </select>
    </div>

}

export default ComboBox;
