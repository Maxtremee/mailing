import { ReactNode } from "react";
import { InferProps } from "prop-types";
import Link from "next/link";

type AProps = InferProps<HTMLAnchorElement> & {
  children: ReactNode | ReactNode[];
};

export default function A({ children, ...anchorProps }: AProps) {
  const href: string = anchorProps.href;

  return href.startsWith("/") ? (
    <Link {...anchorProps} href={href} className="text-blue-500 no-underline">
      {children}
    </Link>
  ) : (
    <a
      {...anchorProps}
      className="text-blue-500 no-underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
