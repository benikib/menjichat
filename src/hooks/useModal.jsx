import { act, useState } from "react";



const useModal =()=>{
    const [isOpen,setIsOpen]=useState(false)
    const onClose=()=>{
        setIsOpen(false)
    }

    const onOpen=()=>{
        setIsOpen(true)
    }

    const onConfirm=(action)=>{
        setIsOpen(false)
         action()
       
    }


    return {
        isOpen,
        onClose,
        onOpen,
        onConfirm
    }


}
export default useModal;