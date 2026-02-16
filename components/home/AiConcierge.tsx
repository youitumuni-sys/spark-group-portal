'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronRight } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  age: number | null;
  images: string[];
  shop: { name: string; slug: string };
}

interface AiConciergeProps {
  staffList: Staff[];
}

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  options?: { label: string; value: string }[];
  staffResults?: Staff[];
}

const brandInfo: Record<string, { name: string; color: string; description: string }> = {
  ohoku: { name: '大奥', color: '#8B1A2B', description: '上品で大人の色気。落ち着いた雰囲気の中で至高の時間を。' },
  pururun: { name: 'ぷるるん小町', color: '#E85B93', description: 'ふんわり可愛い癒し系。愛らしいキャストがお出迎え。' },
  spark: { name: 'スパーク', color: '#7C4DFF', description: 'フレッシュ＆元気！未経験の輝きが魅力のブランド。' },
};

function getBrand(slug: string): string {
  if (slug.startsWith('ohoku')) return 'ohoku';
  if (slug.startsWith('pururun')) return 'pururun';
  return 'spark';
}

export function AiConcierge({ staffList }: AiConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        role: 'bot',
        text: 'こんばんは！SPARK GROUP AIコンシェルジュです✨\n\n今夜はどんな気分ですか？',
        options: [
          { label: '癒されたい', value: 'heal' },
          { label: '刺激がほしい', value: 'excite' },
          { label: '大人の時間', value: 'mature' },
          { label: 'おまかせ！', value: 'random' },
        ],
      }]);
      setStep(1);
    }
  };

  const handleOption = (value: string) => {
    const optionLabels: Record<string, string> = {
      heal: '癒されたい', excite: '刺激がほしい', mature: '大人の時間', random: 'おまかせ！',
      young: '若い子がいい', beauty: '美人系', cute: 'カワイイ系', any: 'こだわりなし',
    };

    // ユーザーの選択を追加
    setMessages(prev => [...prev, { id: prev.length + 1, role: 'user', text: optionLabels[value] || value }]);

    if (step === 1) {
      // 気分に基づくブランド提案
      const brandMap: Record<string, string> = {
        heal: 'pururun',
        excite: 'spark',
        mature: 'ohoku',
        random: ['ohoku', 'pururun', 'spark'][Math.floor(Math.random() * 3)],
      };
      const brand = brandMap[value] || 'spark';
      const info = brandInfo[brand];

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          role: 'bot',
          text: `なるほど！それなら「${info.name}」がぴったりです💫\n\n${info.description}\n\nどんなタイプが好みですか？`,
          options: [
            { label: '若い子がいい', value: `type_young_${brand}` },
            { label: '美人系', value: `type_beauty_${brand}` },
            { label: 'カワイイ系', value: `type_cute_${brand}` },
            { label: 'こだわりなし', value: `type_any_${brand}` },
          ],
        }]);
        setStep(2);
      }, 800);
    } else if (step === 2) {
      // タイプに基づくキャスト提案
      const brand = value.split('_').pop() || 'spark';
      const brandStaff = staffList.filter(s => getBrand(s.shop.slug) === brand);
      const recommended = brandStaff.length > 0 ? brandStaff.slice(0, 3) : staffList.slice(0, 3);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          role: 'bot',
          text: 'あなたにおすすめのキャストはこちらです！✨',
          staffResults: recommended,
        }]);
        setStep(3);
      }, 1000);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          role: 'bot',
          text: '気になるキャストはいましたか？もう一度探したい場合はこちらから👇',
          options: [
            { label: 'もう一度探す', value: 'restart' },
          ],
        }]);
      }, 2000);
    } else if (value === 'restart') {
      setMessages([{
        id: 1,
        role: 'bot',
        text: '了解です！もう一度聞きますね✨\n\n今夜はどんな気分ですか？',
        options: [
          { label: '癒されたい', value: 'heal' },
          { label: '刺激がほしい', value: 'excite' },
          { label: '大人の時間', value: 'mature' },
          { label: 'おまかせ！', value: 'random' },
        ],
      }]);
      setStep(1);
    }
  };

  return (
    <>
      {/* フローティングボタン */}
      {!isOpen && (
        <button
          onClick={startChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
        </button>
      )}

      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">AIコンシェルジュ</p>
                <p className="text-[10px] text-white/60">あなたにぴったりのキャストを提案</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'bot' ? (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[260px]">
                        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* キャスト結果 */}
                      {msg.staffResults && (
                        <div className="mt-2 space-y-2">
                          {msg.staffResults.map((staff) => {
                            const staffImages = staff.images as string[];
                            const brand = getBrand(staff.shop.slug);
                            const info = brandInfo[brand];
                            return (
                              <a
                                key={staff.id}
                                href={`/girls/${staff.id}`}
                                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2.5 hover:shadow-md transition-all group"
                              >
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                  {staffImages[0] ? (
                                    <img src={staffImages[0]} alt={staff.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-bold text-gray-900">{staff.name}</p>
                                  <p className="text-[10px] text-gray-400">{staff.shop.name}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition-colors" />
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* 選択肢 */}
                      {msg.options && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleOption(opt.value)}
                              className="px-3.5 py-2 bg-white border border-pink-200 text-pink-600 text-[12px] font-medium rounded-full hover:bg-pink-50 hover:border-pink-300 transition-all"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[200px]">
                      <p className="text-[13px]">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア（読み取り専用感） */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5">
              <p className="text-[12px] text-gray-300">上の選択肢からお選びください</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Send className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
