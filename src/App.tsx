import React, { useState, useEffect } from 'react';
import { FiMusic, FiCopy, FiCheck } from 'react-icons/fi';
import './App.css';

interface Item {
  id: string;
  title: string;
  placeholder: string;
  layout: 'full' | 'auto';
  type?: 'textarea';
}

type Values = {
  [key: string]: string;
};

const initialItems: Item[] = [
  { id: 'title', title: 'Title (曲名)', placeholder: 'Fly me to the Night', layout: 'full' },
  { id: 'theme', title: 'Theme (テーマ)', placeholder: 'longing for someone who is far away', layout: 'full' },
  { id: 'style', title: 'Style (スタイル)', placeholder: 'lo-fi pop + chill', layout: 'full' },
  { id: 'mood', title: 'Mood (雰囲気)', placeholder: 'dramatic, passionate, emotional', layout: 'full' },
  { id: 'features', title: 'Features (特徴)', placeholder: 'guitar solo, 16beat drums', layout: 'full' },
  { id: 'key', title: 'Key (キー)', placeholder: 'E minor', layout: 'auto' },
  { id: 'time', title: 'Time (時間)', placeholder: '4:00', layout: 'auto' },
  { id: 'beat', title: 'Beat (拍子)', placeholder: '4/4', layout: 'auto' },
  { id: 'bpm', title: 'BPM (テンポ)', placeholder: '110', layout: 'auto' },
  { id: 'vocal', title: 'Vocal (ボーカル)', placeholder: 'female', layout: 'auto' },
  { id: 'chorus', title: 'Chorus (コーラス)', placeholder: 'female', layout: 'auto' },
  { id: 'genre', title: 'Genre (ジャンル)', placeholder: 'Japanese pop', layout: 'auto' },
  { id: 'structure', title: 'Structure (構成)', placeholder: 'instrumental intro → verse → pre-chorus → chorus → ...', type: 'textarea', layout: 'full' },
];

function App() {
  const [values, setValues] = useState<Values>(
    initialItems.reduce((acc, item) => {
      acc[item.id] = '';
      return acc;
    }, {} as Values)
  );

  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const sortedItems: Item[] = [...initialItems].sort((a, b) => {
      if (a.layout === 'full' && b.layout === 'auto') return -1;
      if (a.layout === 'auto' && b.layout === 'full') return 1;
      return 0;
    });

    const parts: string[] = sortedItems.map(item => {
      const value = values[item.id];
      if (value) {
        return `[${item.title.split(' ')[0]}: ${value}]`;
      }
      return null;
    }).filter((part): part is string => part !== null);

    setGeneratedPrompt(parts.join(' '));
  }, [values]);

  const handleValueChange = (id: string, newValue: string): void => {
    setValues(prev => ({ ...prev, [id]: newValue }));
  };

  const copyToClipboard = (): void => {
    if (isCopied || !generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => console.error('Copy failed', err));
  };

  return (
    <div className="container">
      <header className="header">
        <div className="h1-wrapper">
          <FiMusic size={32} />
          <h1>Suno AI Prompt Helper</h1>
        </div>
        <p>作りたい音楽の要素を入力して、プロンプトを生成しましょう。</p>
      </header>

      <div className="prompt-builder">
        {initialItems.map((item) => (
          <div key={item.id} className={`prompt-item layout-${item.layout}`}>
            <label htmlFor={item.id}>{item.title}</label>
            {item.type === 'textarea' ? (
              <textarea
                id={item.id}
                value={values[item.id]}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleValueChange(item.id, e.target.value)}
                placeholder={item.placeholder}
                rows={4}
              />
            ) : (
              <input
                type="text"
                id={item.id}
                value={values[item.id]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(item.id, e.target.value)}
                placeholder={item.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="output-area">
        <h2>生成されたプロンプト</h2>
        <div className="output-wrapper">
          <textarea
            value={generatedPrompt}
            readOnly
            rows={5}
            placeholder="各項目に入力すると、ここにプロンプトが自動生成されます..."
          />
          <button
            onClick={copyToClipboard}
            className={`copy-button ${isCopied ? 'copied' : ''}`}
            disabled={isCopied || !generatedPrompt}
            title="プロンプトをコピー"
          >
            {isCopied ? <FiCheck /> : <FiCopy />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;