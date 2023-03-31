import { type ReactNode } from "react";

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) => {
  return (
    <div className="border-slate-6 flex h-80 items-center justify-center rounded-lg border">
      <div className="mx-auto flex max-w-md flex-col space-y-8 p-6 text-center">
        <div className="flex flex-col space-y-2">
          <h2 className="text-slate-12 text-xl font-bold tracking-[-0.16px]">
            {title}
          </h2>
          {description && (
            <span className="text-slate-11 text-sm font-normal">
              {description}
            </span>
          )}
          {action && <>{action}</>}
        </div>
      </div>
    </div>
  );
};
