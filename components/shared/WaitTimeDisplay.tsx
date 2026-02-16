interface WaitTimeDisplayProps {
  shopId: string;
  minutes?: number;
}

export function WaitTimeDisplay({ shopId: _shopId, minutes }: WaitTimeDisplayProps) {
  if (minutes === undefined || minutes === null) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
        待ち時間: −
      </span>
    );
  }

  let colorClasses: string;
  if (minutes <= 15) {
    colorClasses = 'bg-green-500/20 text-green-400 border-green-500/30';
  } else if (minutes <= 30) {
    colorClasses = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  } else {
    colorClasses = 'bg-red-500/20 text-red-400 border-red-500/30';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${colorClasses}`}
    >
      待ち {minutes}分
    </span>
  );
}
