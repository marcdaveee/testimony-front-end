import { cn } from "@/lib/utils";

export default function Field({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn(`flex flex-col gap-y-3`, className)}>{children}</div>
  );
}
