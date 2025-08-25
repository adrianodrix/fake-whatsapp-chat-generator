import React, { Suspense, lazy } from 'react';
import type { ExportModalProps } from '@/components/modals/ExportModal/ExportModal.types';

// Lazy load do ExportModal
const ExportModal = lazy(() =>
  import('@/components/modals/ExportModal/ExportModal').then((module) => ({
    default: module.ExportModal,
  }))
);

// Loading component para ExportModal
const ExportModalLoading: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div className="p-6 border-b">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border-2 border-gray-200">
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-100 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-20"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

// Wrapper com Suspense
export const LazyExportModal: React.FC<ExportModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={<ExportModalLoading />}>
      <ExportModal {...props} />
    </Suspense>
  );
};

LazyExportModal.displayName = 'LazyExportModal';
