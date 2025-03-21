"use client";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import type { FilePondHookProps } from "filepond";

// Register FilePond plugins
registerPlugin(FilePondPluginFileEncode);
registerPlugin(FilePondPluginImagePreview);

export default function FileUploader(props: FilePondHookProps) {
  return (
    <FilePond
      allowMultiple={true}
      allowFileEncode={true}
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      {...props}
    />
  );
}
