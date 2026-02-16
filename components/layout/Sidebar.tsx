'use client';

interface SidebarProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

export function Sidebar({ children, isOpen = true }: SidebarProps) {
  return (
    <aside
      className={`w-64 flex-shrink-0 bg-gray-950 border-r border-gray-800 transition-all duration-300 ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 w-0'
      }`}
    >
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        {children}
      </div>
    </aside>
  );
}
