import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateKeywords } from '../services/geminiService';

/* --- Shared UI Components --- */
interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>{children}</div>
);

interface LabelProps {
  children?: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children }) => (
  <label className="block text-sm font-medium text-slate-700 mb-2">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all ${props.className || ''}`} />
);

interface ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, loading, disabled, className = "" }) => (
  <button 
    onClick={onClick} 
    disabled={loading || disabled}
    className={`w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? 'Processing...' : children}
  </button>
);

/* --- Tool: ROI Calculator --- */
export const RoiCalculator: React.FC = () => {
  const [invested, setInvested] = useState<number | ''>('');
  const [returned, setReturned] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (invested && returned) {
      const roi = ((Number(returned) - Number(invested)) / Number(invested)) * 100;
      setResult(roi);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <div className="space-y-4">
        <div>
          <Label>Amount Invested ($)</Label>
          <Input type="number" placeholder="1000" value={invested} onChange={(e) => setInvested(Number(e.target.value))} />
        </div>
        <div>
          <Label>Amount Returned ($)</Label>
          <Input type="number" placeholder="1500" value={returned} onChange={(e) => setReturned(Number(e.target.value))} />
        </div>
        <Button onClick={calculate}>Calculate ROI</Button>
        {result !== null && (
          <div className={`mt-6 p-4 rounded-xl text-center ${result >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className="block text-sm font-medium opacity-70">Return on Investment</span>
            <span className="block text-4xl font-bold mt-1">{result.toFixed(2)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

/* --- Tool: Word Counter --- */
export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  
  const stats = {
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <textarea 
          className="w-full h-64 p-4 rounded-2xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none font-mono text-sm leading-relaxed"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpace },
          { label: 'Sentences', value: stats.sentences },
        ].map(stat => (
          <Card key={stat.label} className="text-center py-4">
             <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
             <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* --- Tool: AI Keyword Generator --- */
export const KeywordGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!topic) return;
    setLoading(true);
    setCopied(false);
    const results = await generateKeywords(topic);
    setKeywords(results);
    setLoading(false);
  }, [topic]);

  const handleCopyAll = () => {
    if (keywords.length === 0) return;
    navigator.clipboard.writeText(keywords.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <div className="space-y-4">
          <Label>Enter a topic or niche</Label>
          <div className="flex gap-2">
            <Input 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              placeholder="e.g. Vegan protein powder" 
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <div className="w-32">
              <Button onClick={handleGenerate} loading={loading}>
                Generate
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {keywords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-fade-in">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Results</h3>
            <button 
                className={`text-sm font-bold flex items-center gap-1 transition-colors ${copied ? 'text-green-600' : 'text-primary-600 hover:text-primary-700'}`} 
                onClick={handleCopyAll}
            >
                {copied ? (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        Copy All
                    </>
                )}
            </button>
          </div>
          <ul className="divide-y divide-slate-100">
            {keywords.map((kw, i) => (
              <li key={i} className="px-6 py-3 text-slate-700 hover:bg-slate-50 flex justify-between group">
                <span>{kw}</span>
                <button 
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary-600 transition-opacity"
                  onClick={() => navigator.clipboard.writeText(kw)}
                  title="Copy"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* --- Tool: Password Generator --- */
export const PasswordGenerator: React.FC = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    
    const generate = useCallback(() => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(retVal);
    }, [length]);

    React.useEffect(() => { generate() }, []);

    return (
        <Card className="max-w-xl mx-auto">
            <div className="bg-slate-100 p-4 rounded-lg mb-6 flex justify-between items-center">
                <code className="text-lg font-mono text-slate-800 break-all">{password}</code>
                <button onClick={() => navigator.clipboard.writeText(password)} className="ml-4 text-primary-600 font-bold hover:text-primary-700">COPY</button>
            </div>
            <div className="mb-6">
                <Label>Length: {length}</Label>
                <input 
                    type="range" 
                    min="8" 
                    max="64" 
                    value={length} 
                    onChange={(e) => setLength(Number(e.target.value))} 
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
            </div>
            <Button onClick={generate}>Generate New Password</Button>
        </Card>
    )
}

/* --- Tool: Key Checker (Keyboard Tester) --- */
const KEYS_LAYOUT = [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Control", "Alt", "Space", "Alt", "Control"]
];

const KEY_TOOLTIPS: Record<string, string> = {
    "Esc": "Cancel operation / Exit",
    "Tab": "Indent / Navigate Focus",
    "CapsLock": "Toggle Uppercase",
    "Shift": "Modifier / Uppercase",
    "Control": "Command Modifier",
    "Alt": "Alternative Function",
    "Space": "Insert Space",
    "Enter": "Execute / New Line",
    "Backspace": "Delete Backward"
};

export const KeyChecker: React.FC = () => {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [lastPressed, setLastPressed] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            setLastPressed(e.key);
            setPressedKeys(prev => new Set(prev).add(e.key.toUpperCase()));
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const isPressed = (keyLabel: string) => {
        // Simple mapping for display labels to event keys
        const k = keyLabel.toUpperCase();
        if (k === 'SPACE') return pressedKeys.has(' ');
        if (k === 'CONTROL') return pressedKeys.has('CONTROL');
        if (k === 'SHIFT') return pressedKeys.has('SHIFT');
        if (k === 'ALT') return pressedKeys.has('ALT');
        if (k === 'ENTER') return pressedKeys.has('ENTER');
        if (k === 'BACKSPACE') return pressedKeys.has('BACKSPACE');
        if (k === 'TAB') return pressedKeys.has('TAB');
        if (k === 'CAPSLOCK') return pressedKeys.has('CAPSLOCK');
        if (k === 'ESC') return pressedKeys.has('ESCAPE');
        return pressedKeys.has(k);
    };

    return (
        <div className="flex flex-col gap-8 items-center">
            <div className="w-full h-32 bg-slate-900 rounded-2xl flex items-center justify-center border-b-4 border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-indigo-900/50"></div>
                 <div className="text-center z-10">
                    <span className="text-slate-400 text-sm uppercase tracking-widest font-bold block mb-1">Last Key Pressed</span>
                    <span className="text-5xl font-mono font-bold text-primary-400 drop-shadow-lg">
                        {lastPressed === ' ' ? 'SPACE' : (lastPressed || '...')}
                    </span>
                 </div>
            </div>

            <div className="bg-slate-100 p-6 rounded-3xl shadow-inner w-full overflow-x-auto">
                <div className="min-w-[800px] flex flex-col gap-2">
                    {KEYS_LAYOUT.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2 justify-center">
                            {row.map((key, colIndex) => {
                                const active = isPressed(key);
                                let width = "w-14";
                                if (key === "Space") width = "w-96";
                                if (["Backspace", "Enter", "Shift", "CapsLock", "Tab", "Control"].includes(key)) width = "w-24";

                                const tooltip = KEY_TOOLTIPS[key];

                                return (
                                    <div 
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`
                                            h-14 ${width} rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-sm border-b-2 relative group cursor-help
                                            ${active 
                                                ? 'bg-green-500 text-white border-green-700 shadow-green-200 scale-95' 
                                                : 'bg-white text-slate-600 border-slate-200'
                                            }
                                        `}
                                    >
                                        {key}
                                        {tooltip && (
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                                                {tooltip}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
            
            <button 
                onClick={() => { setPressedKeys(new Set()); setLastPressed(null); }}
                className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
            >
                Reset Keyboard History
            </button>
        </div>
    );
};

/* --- Tool: CPS Tester --- */
export const CPSTester: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [duration, setDuration] = useState(5);
    const [clicks, setClicks] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleClick = () => {
        if (isFinished) return;
        if (!isActive && timeLeft === duration) {
            setIsActive(true);
        }
        setClicks(c => c + 1);
    };

    const reset = () => {
        setIsActive(false);
        setIsFinished(false);
        setClicks(0);
        setTimeLeft(duration);
    };

    const cps = duration > 0 ? (clicks / duration).toFixed(2) : 0;

    return (
        <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="flex justify-center gap-4 mb-8">
                {[1, 5, 10, 30].map(d => (
                    <button 
                        key={d}
                        onClick={() => { setDuration(d); setTimeLeft(d); setIsFinished(false); setClicks(0); setIsActive(false); }}
                        className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${duration === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        {d}s
                    </button>
                ))}
            </div>

            {!isFinished ? (
                <div className="space-y-6">
                    <div className="text-6xl font-black text-slate-200 select-none">
                        {timeLeft.toFixed(1)}s
                    </div>
                    <button 
                        onMouseDown={handleClick}
                        className="w-64 h-64 bg-primary-600 hover:bg-primary-500 active:scale-95 rounded-full mx-auto flex items-center justify-center flex-col text-white shadow-2xl transition-all select-none border-8 border-primary-700"
                    >
                        <span className="text-lg font-medium opacity-80 uppercase tracking-widest">{isActive ? 'Keep Clicking!' : 'Start'}</span>
                        <span className="text-6xl font-bold mt-2">{clicks}</span>
                    </button>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl animate-fade-in-up">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Time's Up!</h3>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 mb-4">
                        {cps} <span className="text-2xl text-slate-400 font-medium">CPS</span>
                    </div>
                    <p className="text-slate-500 mb-8">
                        You clicked {clicks} times in {duration} seconds.
                        <br/>
                        Rank: <strong className="text-slate-800">{Number(cps) > 8 ? 'Pro Gamer 🏆' : Number(cps) > 5 ? 'Average Clicker ⚡' : 'Turtle 🐢'}</strong>
                    </p>
                    <Button onClick={reset} className="w-auto px-12">Try Again</Button>
                </div>
            )}
        </div>
    )
}

/* --- Tool: Binary Converter --- */
export const BinaryConverter: React.FC = () => {
    const [text, setText] = useState('');
    const [binary, setBinary] = useState('');

    const toBinary = (input: string) => {
        setText(input);
        setBinary(input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
    };

    const toText = (input: string) => {
        setBinary(input);
        const binArray = input.trim().split(/\s+/);
        setText(binArray.map(bin => String.fromCharCode(parseInt(bin, 2))).join(''));
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <Label>Text Input</Label>
                <textarea 
                    value={text}
                    onChange={(e) => toBinary(e.target.value)}
                    placeholder="Hello World"
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 font-mono text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                ></textarea>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <Label><span className="text-slate-300">Binary Output</span></Label>
                <textarea 
                    value={binary}
                    onChange={(e) => toText(e.target.value)}
                    placeholder="01001000 01100101 01101100 01101100 01101111"
                    className="w-full h-64 p-4 rounded-xl bg-slate-800 border border-slate-700 text-green-400 font-mono text-sm focus:border-green-500 focus:ring-2 focus:ring-green-900 outline-none resize-none"
                ></textarea>
            </Card>
        </div>
    )
}

/* --- Tool: Case Converter --- */
export const CaseConverter: React.FC = () => {
    const [text, setText] = useState('');

    const convert = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
        let res = '';
        switch (type) {
            case 'upper': res = text.toUpperCase(); break;
            case 'lower': res = text.toLowerCase(); break;
            case 'title': res = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); break;
            case 'sentence': res = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
        }
        setText(res);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
                <Button onClick={() => convert('upper')} className="w-auto px-4 py-2 text-sm">UPPERCASE</Button>
                <Button onClick={() => convert('lower')} className="w-auto px-4 py-2 text-sm">lowercase</Button>
                <Button onClick={() => convert('title')} className="w-auto px-4 py-2 text-sm">Title Case</Button>
                <Button onClick={() => convert('sentence')} className="w-auto px-4 py-2 text-sm">Sentence case</Button>
                <Button onClick={() => setText('')} className="w-auto px-4 py-2 text-sm bg-slate-200 text-slate-700 hover:bg-slate-300">Clear</Button>
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none font-mono text-sm"
                placeholder="Type or paste text here..."
            />
             <div className="text-right text-xs text-slate-400">
                {text.length} characters
            </div>
        </div>
    );
};

/* --- Tool: Lorem Ipsum Generator --- */
export const LoremIpsumGenerator: React.FC = () => {
    const [paragraphs, setParagraphs] = useState(3);
    const [text, setText] = useState('');

    const generate = useCallback(() => {
        const sentences = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "Curabitur pretium tincidunt lacus.",
            "Nulla gravida orci a odio.",
            "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
            "Integer in mauris eu nibh euismod gravida.",
            "Duis ac tellus et risus vulputate vehicula.",
            "Donec lobortis risus a elit.",
            "Etiam tempor.",
            "Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
            "Maecenas fermentum consequat mi.",
            "Donec fermentum."
        ];
        
        const generated = Array.from({ length: paragraphs }, () => {
             // Random number of sentences per paragraph (3-7)
             const numSentences = Math.floor(Math.random() * 5) + 3;
             let paragraph = [];
             for(let i=0; i<numSentences; i++) {
                 paragraph.push(sentences[Math.floor(Math.random() * sentences.length)]);
             }
             return paragraph.join(' ');
        }).join('\n\n');

        setText(generated);
    }, [paragraphs]);

    useEffect(() => { generate() }, [generate]);

    return (
        <div className="space-y-6">
            <Card className="flex items-center gap-4 py-4">
                <Label>Paragraphs:</Label>
                <input 
                    type="number" 
                    min="1" 
                    max="20" 
                    value={paragraphs} 
                    onChange={(e) => setParagraphs(Math.min(20, Math.max(1, Number(e.target.value))))} 
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none"
                />
                <Button onClick={generate} className="w-auto px-6">Regenerate</Button>
                <Button onClick={() => navigator.clipboard.writeText(text)} className="w-auto px-6 bg-slate-800 hover:bg-slate-900">Copy</Button>
            </Card>
            <textarea 
                readOnly
                value={text}
                className="w-full h-96 p-6 rounded-xl border border-slate-200 bg-slate-50 resize-none outline-none text-slate-600 leading-relaxed font-serif text-lg"
            />
        </div>
    );
};

/* --- Tool: JSON Formatter --- */
export const JsonFormatter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const process = (action: 'format' | 'minify') => {
        try {
            if (!input.trim()) {
                setOutput('');
                return;
            }
            const obj = JSON.parse(input);
            if (action === 'format') {
                setOutput(JSON.stringify(obj, null, 2));
            } else {
                setOutput(JSON.stringify(obj));
            }
            setError(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 h-[600px]">
             <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                    <Label>Input JSON</Label>
                    <button onClick={() => setInput('')} className="text-xs text-red-500 font-medium hover:underline">Clear</button>
                </div>
                <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-4 rounded-xl border border-slate-200 font-mono text-xs resize-none focus:ring-2 focus:ring-primary-200 outline-none shadow-inner"
                    placeholder='{"id": 1, "name": "LuminaTools"}'
                />
            </div>
             <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                    <Label>Output</Label>
                    <div className="flex gap-2">
                         <button onClick={() => process('format')} className="px-3 py-1 bg-primary-100 text-primary-700 rounded text-xs font-bold hover:bg-primary-200 transition-colors">Beautify</button>
                         <button onClick={() => process('minify')} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold hover:bg-slate-200 transition-colors">Minify</button>
                         <button onClick={() => navigator.clipboard.writeText(output)} className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-900 transition-colors">Copy</button>
                    </div>
                </div>
                <div className="relative flex-grow">
                     <textarea 
                        readOnly
                        value={output}
                        className={`w-full h-full p-4 rounded-xl border font-mono text-xs resize-none outline-none shadow-inner transition-colors ${error ? 'border-red-300 bg-red-50 text-red-900' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                    />
                    {error && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-100 text-red-700 p-3 rounded-lg text-xs font-mono border border-red-200 shadow-lg">
                            <strong>Syntax Error:</strong> {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* --- Tool: Color Converter --- */
export const ColorConverter: React.FC = () => {
    const [hex, setHex] = useState('#3b82f6');
    const [rgb, setRgb] = useState('59, 130, 246');
    
    // Convert Hex to RGB
    const hexToRgb = (h: string) => {
        let r = 0, g = 0, b = 0;
        h = h.replace('#', '');
        if (h.length === 3) {
            r = parseInt(h[0] + h[0], 16);
            g = parseInt(h[1] + h[1], 16);
            b = parseInt(h[2] + h[2], 16);
        } else if (h.length === 6) {
            r = parseInt(h.substring(0, 2), 16);
            g = parseInt(h.substring(2, 4), 16);
            b = parseInt(h.substring(4, 6), 16);
        }
        return `${r}, ${g}, ${b}`;
    }

    // Convert RGB to Hex
    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    const handleHexChange = (val: string) => {
        setHex(val);
        if (/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val)) {
            const h = val.startsWith('#') ? val : '#' + val;
            setRgb(hexToRgb(h));
        }
    };

    const handleRgbChange = (val: string) => {
        setRgb(val);
        const parts = val.split(',').map(p => parseInt(p.trim()));
        if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
            setHex(rgbToHex(parts[0], parts[1], parts[2]));
        }
    };

    return (
        <Card className="max-w-xl mx-auto">
             <div className="flex gap-6 items-center mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div 
                    className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white ring-1 ring-slate-200 transition-colors duration-300" 
                    style={{ backgroundColor: hex.startsWith('#') ? hex : '#' + hex }}
                ></div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900">Color Preview</h3>
                    <p className="text-slate-500 text-sm mb-2">Visual representation of your color.</p>
                </div>
             </div>
             
             <div className="space-y-6">
                <div>
                    <Label>HEX Code</Label>
                    <div className="relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">#</div>
                         <Input 
                            value={hex.replace('#', '')} 
                            onChange={(e) => handleHexChange('#' + e.target.value)} 
                            className="pl-8 font-mono tracking-widest uppercase"
                            maxLength={7}
                        />
                    </div>
                </div>
                <div>
                    <Label>RGB Values (r, g, b)</Label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">rgb(</div>
                        <Input 
                            value={rgb} 
                            onChange={(e) => handleRgbChange(e.target.value)}
                            className="pl-12 font-mono tracking-widest"
                            placeholder="255, 255, 255"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">)</div>
                    </div>
                </div>
             </div>
        </Card>
    );
};