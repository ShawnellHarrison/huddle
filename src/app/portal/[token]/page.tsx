export default function PortalPage({ params }: { params: { token: string } }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold font-headline">Client Portal</h1>
      <p className="text-muted-foreground mt-2">Public invoice view for token: {params.token}. Coming soon.</p>
    </div>
  )
}
