import { cn } from "@/lib/utils";

export default function Header({
  children,
  className,
}: React.ComponentProps<"h3">) {
  return <h3 className={cn(`text-xl font-semibold`, className)}>{children}</h3>;
}
