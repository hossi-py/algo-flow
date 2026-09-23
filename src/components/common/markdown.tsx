import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components: Components = {
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  em: ({ children }) => (
    <em className="text-foreground not-italic underline decoration-primary decoration-2 underline-offset-4">
      {children}
    </em>
  ),
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-primary-strong">{children}</ul>,
  ol: ({ children }) => (
    <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:font-bold marker:text-primary-strong">{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="rounded-md bg-info px-4 py-3 text-small text-info-foreground">{children}</blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = /language-/.test(className ?? "") || String(children).includes("\n");
    if (isBlock) return <code className="font-mono text-code-sm">{children}</code>;
    return (
      <code className="rounded-xs bg-primary-soft px-1.5 py-0.5 font-mono text-[0.9em] text-primary-soft-foreground">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-md border bg-muted px-4 py-3 font-mono text-[13px] leading-5 text-foreground shadow-inset">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-small">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b px-3 py-2 text-left font-bold">{children}</th>,
  td: ({ children }) => <td className="border-b px-3 py-2 align-top">{children}</td>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="font-semibold text-primary-strong underline underline-offset-2"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
};

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 text-body text-foreground", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
