// components/Modal.js
import { useState } from 'react';
import { CircleHelp, X } from "lucide-react";


const Modal = ({ isOpen, onClose }) => {
    const [files, setFiles] = useState([]);
    const [progress,setProgress] = useState({});
    const [overallProgress, setOverallProgress] = useState(0);
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'application/pdf'];

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            allowedTypes.includes(file.type)
        );
        startUpload(droppedFiles);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter((file) =>
            allowedTypes.includes(file.type)
        );
        startUpload(selectedFiles);
    };

    const startUpload = (selectedFiles) => {
        selectedFiles.forEach((file) => {
            setProgress((prevProgress) => ({ ...prevProgress, [file.name]: 0 }));
            simulateUpload(file);
        });
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    const simulateUpload = (file) => {
        const reader = new FileReader();
        reader.onloadstart = () => updateProgress(file.name, 0);
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percentage = Math.round((e.loaded / e.total) * 100);
                updateProgress(file.name, percentage);
            }
        };
        reader.onloadend = () => updateProgress(file.name, 100);
        reader.readAsDataURL(file);
    };

    const updateProgress = (fileName, percentage) => {
        setProgress((prevProgress) => {
            const updatedProgress = { ...prevProgress, [fileName]: percentage };
            const totalProgress = calculateOverallProgress(updatedProgress);
            setOverallProgress(totalProgress);
            return updatedProgress;
        });
        // Calculate overall progress here
        const totalProgress = calculateOverallProgress({ ...progress, [fileName]: percentage });
        setOverallProgress(totalProgress);
    };

    const calculateOverallProgress = (progressData) => {
        const total = Object.values(progressData).reduce((sum, value) => sum + value, 0);
        return Object.keys(progressData).length ? total / Object.keys(progressData).length : 0;
    };

    const deleteFile = (fileName) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        setProgress((prevProgress) => {
            const updatedProgress = { ...prevProgress };
            delete updatedProgress[fileName];
            setOverallProgress(calculateOverallProgress(updatedProgress));
            return updatedProgress;
        });
    };

    const renderFiles = () => (
        <ul className="mt-4 space-y-2">
            {files.map((file) => (
                <li key={file.name} className="text-sm text-gray-600 flex items-center justify-between">
                    <p>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                    <button
                        className="text-red-500 hover:text-red-700 ml-2"
                        onClick={() => deleteFile(file.name)}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-auto scroll-width-none">
            <div className="bg-white rounded-xl p-6 w-2/3 max-md:w-full relative max-h-[80vh] overflow-y-auto scroll-width-none">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-Ambit font-medium text-base">Upload Photos</p>
                    <button className="text-black" onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div
                    id="file_upload"
                    className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <p className="text-gray-600">Drag & Drop your files here</p>
                    <p className="text-gray-500">or</p>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".png, .jpg, .jpeg, .webp, .pdf"
                        className="block w-full text-sm text-gray-600
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded file:border-0
                                   file:text-sm file:font-semibold
                                   file:bg-blue-50 file:text-blue-700
                                   hover:file:bg-blue-100 mt-2"
                    />
                </div>

                {files.length > 0 && (
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded h-2 mb-2">
                            <div
                                className="bg-blue-500 h-2 rounded"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-right">{overallProgress.toFixed(0)}%</p>
                        {renderFiles()}
                    </div>
                )}
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-gray-200 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
                </div>
                <div className='w-full mt-3'>
                    <p className='font-Ambit font-normal text-xs'>Import from URL</p>
                    <input className='w-full h-9 rounded-md bg-gray-200 text-xs p-3' placeholder='Add file URL' />
                </div>
                <div className='w-full mt-3'>
                    <p className='font-Ambit font-normal text-xs'>Title</p>
                    <input className='w-full h-9 rounded-md bg-gray-200 text-xs p-3' placeholder='Write a title' />
                </div>
                <div className='w-full mt-3'>
                    <p className='font-Ambit font-normal text-xs'>Source</p>
                    <input className='w-full h-9 rounded-md bg-gray-200 text-xs p-3' placeholder='Write a title' />
                </div>
                <div className='w-full mt-3'>
                    <p className='font-Ambit font-normal text-xs'>Date</p>
                    <input className='w-full h-9 rounded-md bg-gray-200 text-xs p-3' placeholder='Enter a Date' />
                </div>
                <div className='w-full mt-3'>
                    <p className='font-Ambit font-normal text-xs'>Tag</p>
                    <input className='w-full h-9 rounded-md bg-gray-200 text-xs p-3' placeholder='Write a tag' />
                </div>
                <div className='inline-grid grid-cols-5 max-md:grid-cols-2 mt-7 w-full justify-between'>
                    <div className="flex items-center mb-4">
                        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Corporate Tax</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Lorem Ispum</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Lorem Ispum</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Lorem Ispum</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Employment Law</label>
                    </div>
                </div>
                <div className='flex justify-between w-full'>
                    <div className='flex items-center text-gray-400 font-Ambit text-xs'>
                        <CircleHelp />
                        <p>Help Centre</p>
                    </div>
                    <div className='flex items-center font-Ambit'>
                        <button className='rounded-md w-20 h-8 text-xs border-gray-300 border-2 font-medium mr-4' onClick={onClose}>Cancel</button>
                        <button className='rounded-md w-20 h-8 text-xs border-none bg-regal-blue text-white font-medium'>Done</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
