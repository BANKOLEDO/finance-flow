// src/pages/dashboard/Settings.jsx
import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import SettingsLayout from '../../components/settings/SettingsLayout'
import ProfileSettings from '../../components/settings/ProfileSettings'
import NotificationsSettings from '../../components/settings/NotificationsSettings'
import SecuritySettings from '../../components/settings/SecuritySettings'
import ExportDataSettings from '../../components/settings/ExportDataSettings'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />
      case 'notifications':
        return <NotificationsSettings />
      case 'security':
        return <SecuritySettings />
      case 'export':
        return <ExportDataSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <DashboardLayout>
      <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderActiveTab()}
      </SettingsLayout>
    </DashboardLayout>
  )
}