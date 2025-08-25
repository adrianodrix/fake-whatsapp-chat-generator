import React, { Suspense, lazy } from 'react';
import type { ProfilePanelProps } from '@/components/chat/ProfilePanel/ProfilePanel.types';

// Lazy load do ProfilePanel
const ProfilePanel = lazy(() =>
  import('@/components/chat/ProfilePanel/ProfilePanel').then((module) => ({
    default: module.ProfilePanel,
  }))
);

// Loading component para ProfilePanel
const ProfilePanelLoading: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
    <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-24"></div>

    {/* Avatar Section Skeleton */}
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
        <div className="h-3 bg-gray-100 rounded animate-pulse w-16"></div>
      </div>
    </div>

    {/* Name Input Skeleton */}
    <div>
      <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-12"></div>
      <div className="h-10 bg-gray-100 rounded animate-pulse mb-1"></div>
      <div className="h-3 bg-gray-100 rounded animate-pulse w-24"></div>
    </div>
  </div>
);

// Wrapper com Suspense
export const LazyProfilePanel: React.FC<ProfilePanelProps> = (props) => (
  <Suspense fallback={<ProfilePanelLoading className={props.className} />}>
    <ProfilePanel {...props} />
  </Suspense>
);

LazyProfilePanel.displayName = 'LazyProfilePanel';
