export default function Page({ content }: { content: JSX.Element[] }) {
  return (
    <div className="p-8">
      {content}
    </div>
  )
}
