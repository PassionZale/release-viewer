import Upload, { UploadProps } from "rc-upload";
import Image from "next/image";
import { IconEye, IconLoader2, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import request from "@/libs/request";
import { useToast } from "@/components/ui/use-toast";
import { RcFile } from "rc-upload/lib/interface";

export interface FileUploadProps extends Omit<UploadProps, "onChange"> {
  maxLength?: number;
  maxSize?: number;
  allowedTypes?: string[];
  value?: string[];
  onChange?: (value?: string[]) => void;
}

const UploadButton = ({ loading }: { loading?: boolean }) => {
  return <div>{loading ? <IconLoader2 /> : <IconPlus />}</div>;
};

const UploadFile = (props: {
  url: string;
  disabled?: boolean;
  onPreview?: (url: string) => void;
  onDelete?: (url: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const onPreview = () => props.onPreview?.(props.url);
  const onDelete = () => props.onDelete?.(props.url);

  const arrs = props.url.split("/");
  const fileName = arrs[arrs.length - 1].replace(/\.[0-9a-zA-Z]+$/, "");

  return (
    <div
      className="w-20 h-20 cursor-pointer relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {open ? (
        <>
          <div className="absolute inset-0 z-10 bg-black opacity-40" />
          <div className="absolute flex top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 text-center leading-none">
            <IconEye
              onClick={onPreview}
              style={{ fontSize: 18, color: "#fff", cursor: "pointer" }}
            />

            {props.disabled ? null : (
              <IconTrash
                onClick={onDelete}
                style={{
                  fontSize: 18,
                  color: "#fff",
                  cursor: "pointer",
                  marginLeft: 10,
                }}
              />
            )}
          </div>
        </>
      ) : null}

      <Image fill src={props.url} priority alt={fileName} />
    </div>
  );
};

const FileUpload = ({
  value = [],
  onChange,
  maxLength = 1,
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"],
  onError,
  disabled,
  ...props
}: FileUploadProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const triggerError: FileUploadProps["onError"] = (error, response, file) => {
    onError
      ? onError(error as Error, response, file as RcFile)
      : toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
        });
  };

  const beforeUpload: FileUploadProps["beforeUpload"] = (file) => {
    if (file.size > maxSize!) {
      const error = new Error(
        `图片不能超过${Math.ceil(maxSize! / 1024 / 1024)}MB`
      );

      triggerError(error as Error, {}, file as RcFile);

      return false;
    }

    if (!allowedTypes!.includes(file.type)) {
      const error = new Error(
        `图片只支持 ${allowedTypes!
          .map((item) => {
            const arrs = item.split("/");
            return arrs[1];
          })
          .join("/")}`
      );

      triggerError(error as Error, {}, file as RcFile);

      return false;
    }

    return true;
  };

  const customRequest: FileUploadProps["customRequest"] = async ({ file }) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await request.post<string>("/api/upload/image", {
        params: formData,
      });

      onChange?.([...(value || []), ...[res.data]]);

      setLoading(false);
    } catch (error) {
      triggerError(
        error as Error,
        error as Record<string, unknown>,
        file as RcFile
      );
      setLoading(false);
    }
  };

  const onPreview = (url: string) => window.open(url, "_blank");

  const onDelete = (url: string) =>
    onChange?.(value!.filter((item) => item !== url));

  return (
    <div className="flex flex-wrap space-x-4">
      {value.length > 0
        ? value.map((url) => (
            <UploadFile
              key={url}
              url={url}
              disabled={disabled}
              onPreview={onPreview}
              onDelete={onDelete}
            />
          ))
        : null}

      {disabled || value.length >= maxLength! ? null : (
        <Upload
          className="flex items-center justify-center w-20 h-20 rounded-md border border-input bg-background px-3 py-2 text-sm hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2"
          component={"div"}
          disabled={disabled || loading}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          {...props}
        >
          <UploadButton loading={loading} />
        </Upload>
      )}
    </div>
  );
};

export { FileUpload };
