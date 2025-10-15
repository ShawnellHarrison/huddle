import { BackButton } from '@/components/back-button';

export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col items-start h-full text-left">
      <BackButton />
      <div className="flex flex-col items-center justify-center h-full text-center w-full -mt-12">
        <h1 className="text-4xl font-bold font-headline">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and settings. Coming soon.</p>
      </div>
    </div>
  )
}
