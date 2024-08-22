import { forwardRef } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/libs/utils";

const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <IconSearch className="absolute left-1.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 peer-focus:text-gray-900" />

        <Input
          ref={ref}
          placeholder="搜索"
          className={cn("pl-8", className)}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
