'use client'

export default function Home() {
  const url = 'https://example.com'

  return (
    <div className="p-4">
      <p>HOme Page</p>
      <a href={url}>{url}</a>
    </div>
  )
}
