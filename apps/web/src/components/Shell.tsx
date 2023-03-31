import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

const routes = [
  {
    name: "Empty",
    path: "/empty",
  },
  {
    name: "Contact Lists",
    path: "/contact-lists",
  },
];

export const Shell = ({
  children,
  title,
  details,
  actions,
}: {
  children: ReactNode;
  title?: string;
  details?: ReactNode;
  // TODO: take an object with label, icon, onClick. Handle if it should render a button or a popover with more actions and stuff. I have this on other project but don't really wanna spend the time bringing it here. Allowing the consumer to pass what it wants is good enough for now.
  actions?: ReactNode;
}) => {
  const { asPath } = useRouter();

  return (
    <div className="flex">
      <Sidebar activeRoute={asPath} />
      <div className="w-full">
        <Topbar />
        <div className="h-[calc(100vh-60px)] overflow-auto pb-10">
          <main>
            <div className="mx-auto flex max-w-5xl flex-col px-6 py-8">
              <div className="flex items-center justify-between">
                <h1 className="text-slate-12 text-[28px] font-bold leading-[34px] tracking-[-0.416px]">
                  {title ||
                    routes.find((route) => route.path === asPath)?.name ||
                    "hmm..."}
                </h1>
                {actions}
              </div>
              {details}
            </div>
            <div className="mx-auto max-w-5xl px-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeRoute }: { activeRoute?: string }) => {
  return (
    <aside className="border-slate-6 flex h-screen w-[250px] flex-shrink-0 flex-col justify-between border-r">
      <Navigation activeRoute={activeRoute} />
      <div className="px-4 py-6">
        <AccountButton />
      </div>
    </aside>
  );
};

const Navigation = ({ activeRoute }: { activeRoute?: string }) => {
  return (
    <div>
      <div className="flex h-[60px] items-center px-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="mt-6 px-4">
        <ul className="flex flex-col gap-2">
          {routes.map((route) => (
            <li key={route.name}>
              <Link className="h-8 rounded-md" href={route.path}>
                <span
                  className={
                    activeRoute?.includes(route.path)
                      ? // TODO: variants???
                        "bg-slate-6 text-slate-12 flex h-8 items-center gap-2 rounded-md px-2 text-sm"
                      : "text-slate-11 hover:bg-slate-5 hover:text-gray-12 flex h-8 items-center gap-2 rounded-md px-2 text-sm"
                  }
                >
                  {route.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const AccountButton = () => {
  return (
    <div className="flex flex-1 items-center gap-3 overflow-hidden">
      <div className="bg-slate-8 h-6 w-6 rounded-full" />
      <span className="truncate">igorbedesqui@gmail.com</span>
    </div>
  );
};

const Topbar = () => {
  return (
    <div className="border-slate-6 flex h-[60px] items-center justify-end border-b px-6">
      <div className="flex gap-3">
        <div className="bg-slate-4 border-slate-6 text-slate-11 inline-flex h-8 select-none items-center justify-center gap-1 rounded-md border pl-2 pr-3 text-sm font-semibold">
          Hej
        </div>
        <div className="bg-slate-4 border-slate-6 text-slate-11 inline-flex h-8 select-none items-center justify-center gap-1 rounded-md border pl-2 pr-3 text-sm font-semibold">
          Do
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return <>▲ LOGO</>;
};
