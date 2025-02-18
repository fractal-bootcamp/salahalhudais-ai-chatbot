import Link from 'next/link';
import SessionList from './_components/sessionList';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">AI Chat</h1>
        <div className="flex gap-8">
          <div className="w-64">
            <SessionList />
          </div>
          <div className="flex-1 bg-white rounded-lg p-8 shadow-sm border border-gray-100">
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">+</span> New Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}