export const dynamic = 'force-dynamic';
import { getDiaries } from '@/lib/queries/diaries';
import { DiaryFeed } from '@/components/home/DiaryFeed';

export const metadata = {
  title: '写メ日記 | SPARK GROUP',
  description: 'キャストの写メ日記一覧',
};

export default async function DiaryPage() {
  const diaries = await getDiaries(100);

  return (
    <div className="section-container py-10">
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-green-500">Photo Diary</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">写メ日記</h1>
        <p className="mt-1 text-sm text-gray-400">全{diaries.length}件</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-green-500" />
          <span className="block h-[3px] w-3 rounded-full bg-green-500 opacity-40" />
        </div>
      </div>

      <DiaryFeed entries={diaries as never[]} />
    </div>
  );
}
