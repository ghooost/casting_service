import { HTMLProps, useEffect } from "react";

import { initAuth } from "@stores/auth";
import { useAppDispatch } from "@stores/store";

interface PageProps extends HTMLProps<HTMLDivElement> {}

export const Page = ({ children, className }: PageProps) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);
  return <section className={className}>{children}</section>;
};
