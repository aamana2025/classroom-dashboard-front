import { useEffect, useRef } from "react";
export const Uploadbtn = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: '',
            uploadPreset: '',
        }, function (error, result) {
            console.log(result);
        })
    }, [])
    return (
        <button onClick={()=>widgetRef.current.open()}>
            Upload
        </button>
    )
}