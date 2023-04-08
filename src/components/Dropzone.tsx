import React, { useState, useCallback, useEffect } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { HiOutlineUpload } from "react-icons/hi";

type Props = {
  file: any;
  setFile: any;
};

const Dropzone = (props: Props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>{file.path}</li>
  ));

  useEffect(() => {
    props.setFile(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <div
      className="flex flex-col h-24 text-xs justify-center items-center w-full border border-dashed border-gray-300 rounded cursor-pointer"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {files.length === 0 || props.file === undefined ? (
        <>
          <HiOutlineUpload size={20} />
          <p>
            Drag and drop or <span className="font-medium">browse</span>
          </p>
        </>
      ) : (
        <>
          <HiOutlineUpload size={20} />
          <p className="pb-2">
            Upload a new file or <span className="font-medium">browse</span>
          </p>
          <ul>{files}</ul>
        </>
      )}
    </div>
  );
};

export default Dropzone;
