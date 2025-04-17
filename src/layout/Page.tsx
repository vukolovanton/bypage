export default function Page({ content }: { content: (JSX.Element | null)[] }) {
  return (
    <div className="p-8">
      {content}
    </div>
  )
}
