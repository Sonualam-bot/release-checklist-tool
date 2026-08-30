/**
 * Shared page shell: the "ReleaseCheck" title/subtitle above a white card.
 * The card's toolbar (breadcrumb + primary action) and body are supplied
 * by whichever page is rendering, since they differ between the list and
 * the release form.
 * @param {{toolbar: React.ReactNode, children: React.ReactNode}} props
 */
export default function Layout({ toolbar, children }) {
  return (
    <div className="page">
      <header className="page-header">
        <h1>ReleaseCheck</h1>
        <p>Your all-in-one release checklist tool</p>
      </header>
      <main className="card">
        <div className="card-toolbar">{toolbar}</div>
        <div className="card-body">{children}</div>
      </main>
    </div>
  );
}
