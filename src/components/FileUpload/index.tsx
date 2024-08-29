import Upload, { UploadProps } from "rc-upload";

import { cn } from "@/libs/utils";
import { IconPlus } from "@tabler/icons-react";

export interface FileUploadProps extends Omit<UploadProps, "onChange"> {
  value?: string[];
  onChange?: (value?: string[]) => void;
}

const FileUpload = ({ value = [], onChange, ...props }: FileUploadProps) => {
  return (
    <Upload>
      <IconPlus />
    </Upload>
  );
};

export { FileUpload };
