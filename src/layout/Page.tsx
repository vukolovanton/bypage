export default function Page({ content }: { content: (JSX.Element | null)[] }) {
  return (
    <div className="p-8 shadow-md/10 rounded-sm min-h-[70vh] max-h-[70vh] overflow-scroll">
      {content}
    </div>
  )
}
