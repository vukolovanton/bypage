import TranslationProgress from "@/components/TranslationProgress";

export default function Page({ content, translate }: { content: (JSX.Element | null)[], translate?: boolean }) {

  return (
    <div className="relative p-8 shadow-md/10 rounded-sm min-h-[70vh] max-h-[70vh] overflow-scroll">
      {translate && <TranslationProgress />}
      {content}
    </div>
  );
}
