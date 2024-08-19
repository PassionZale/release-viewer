"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef, PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const getLinkUrl = (href: LinkProps["href"], as?: LinkProps["as"]): string => {
  if (as) return as.toString();
  return href.toString();
};

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

// eslint-disable-next-line react/display-name
const ActiveLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<ActiveLinkProps>
>(({ children, activeClassName, className, ...props }, ref) => {
  const pathname = usePathname();
  const [computedClassName, setComputedClassName] = useState(className);

  useEffect(() => {
    if (pathname) {
      const linkUrl = getLinkUrl(props.href, props.as);

      const linkPathname = new URL(linkUrl, location.href).pathname;
      const activePathname = new URL(pathname, location.href).pathname;

      const isActived =
        linkPathname === "/admin"
          ? activePathname === linkPathname
          : activePathname.startsWith(linkPathname);

      const newClassName = isActived
        ? `${className} ${activeClassName}`.trim()
        : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [
    pathname,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
  ]);

  return (
    <Link ref={ref} className={computedClassName} {...props}>
      {children}
    </Link>
  );
});

// const ActiveLink = ({
//   children,
//   activeClassName,
//   className,
//   ...props
// }: PropsWithChildren<ActiveLinkProps>) => {
//   const pathname = usePathname();
//   const [computedClassName, setComputedClassName] = useState(className);

//   useEffect(() => {
//     if (pathname) {
//       const linkUrl = getLinkUrl(props.href, props.as);

//       const linkPathname = new URL(linkUrl, location.href).pathname;
//       const activePathname = new URL(pathname, location.href).pathname;

//       const isActived =
//         linkPathname === "/admin"
//           ? activePathname === linkPathname
//           : activePathname.startsWith(linkPathname);

//       const newClassName = isActived
//         ? `${className} ${activeClassName}`.trim()
//         : className;

//       if (newClassName !== computedClassName) {
//         setComputedClassName(newClassName);
//       }
//     }
//   }, [
//     pathname,
//     props.as,
//     props.href,
//     activeClassName,
//     className,
//     computedClassName,
//   ]);

//   return (
//     <Link className={computedClassName} {...props}>
//       {children}
//     </Link>
//   );
// };

export default ActiveLink;
