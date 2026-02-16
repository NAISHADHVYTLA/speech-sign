import { useState, useCallback, useRef, useEffect } from 'react';
import AvatarViewer from '@/components/AvatarViewer';
import { getSign, getSpellingPoses, DEFAULT_POSE, type SignPose } from '@/lib/signDictionary';
import { Mic, MicOff, Trash2, Play, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVATAR_COLORS = [
  { label: 'Cyan', hex: '#00b4d8' },
  { label: 'Coral', hex: '#e76f51' },
  { label: 'Emerald', hex: '#2ec4b6' },
  { label: 'Violet', hex: '#7c3aed' },
];

export default function ConvertPage() {
  const [currentPose, setCurrentPose] = useState<SignPose>(DEFAULT_POSE);
  const [textInput, setTextInput] = useState('');
  const [speechText, setSpeechText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [processedWords, setProcessedWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [avatarColor, setAvatarColor] = useState('#00b4d8');
  const [animSpeed, setAnimSpeed] = useState(1);
  const [pauseTime, setPauseTime] = useState(800);
  const [transcript, setTranscript] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const animatingRef = useRef(false);

  // Speech recognition setup
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const text = result[0].transcript.trim();
        setSpeechText(text);
        const ts = new Date().toLocaleTimeString();
        setTranscript((prev) => [...prev, `[${ts}] ${text}`]);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Animate words one by one
  const animateWords = useCallback(
    async (words: string[]) => {
      if (animatingRef.current) return;
      animatingRef.current = true;
      setProcessedWords(words);

      for (let i = 0; i < words.length; i++) {
        if (!animatingRef.current) break;
        setCurrentWordIdx(i);

        const sign = getSign(words[i]);

        // If it's a fingerspelling word (multi-letter), animate each letter
        if (sign.method === 'fingerspelling' && words[i].replace(/[^a-zA-Z]/g, '').length > 1) {
          const letterPoses = getSpellingPoses(words[i]);
          for (let j = 0; j < letterPoses.length; j++) {
            if (!animatingRef.current) break;
            setCurrentPose({
              ...letterPoses[j],
              description: `Spell: ${words[i].toUpperCase()} → ${words[i][j]?.toUpperCase()}`,
            });
            await new Promise((r) => setTimeout(r, (pauseTime * 0.6) / animSpeed + 300));
          }
        } else {
          setCurrentPose(sign);
          await new Promise((r) => setTimeout(r, pauseTime / animSpeed + 600));
        }
      }

      animatingRef.current = false;
      setCurrentWordIdx(-1);
    },
    [animSpeed, pauseTime]
  );

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    const ts = new Date().toLocaleTimeString();
    setTranscript((prev) => [...prev, `[${ts}] ${textInput}`]);
    const words = textInput.trim().split(/\s+/);
    animateWords(words);
    setTextInput('');
  };

  const handleSpeechAnimate = () => {
    if (!speechText.trim()) return;
    const words = speechText.trim().split(/\s+/);
    animateWords(words);
  };

  const clearAll = () => {
    setSpeechText('');
    setProcessedWords([]);
    setCurrentWordIdx(-1);
    setCurrentPose(DEFAULT_POSE);
    animatingRef.current = false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 glass-panel">
        <Link to="/" className="flex items-center gap-2 text-primary font-display font-bold text-lg">
          <ChevronLeft className="w-5 h-5" />
          Sign Speech
        </Link>
        <span className="text-sm text-muted-foreground">Speech → Sign Language Converter</span>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        {/* Left panel - Controls */}
        <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
          {/* Processed text */}
          <div className="glass-panel rounded-lg p-4">
            <h3 className="text-sm font-display font-semibold text-foreground mb-2">Processed Text</h3>
            <div className="min-h-[48px] bg-muted rounded p-2 text-sm text-foreground">
              {processedWords.length > 0
                ? processedWords.map((w, i) => (
                    <span
                      key={i}
                      className={`inline-block mr-1 px-1 rounded ${
                        i === currentWordIdx
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {w}
                    </span>
                  ))
                : <span className="text-muted-foreground">No text processed yet</span>}
            </div>
          </div>

          {/* Speech recognition */}
          <div className="glass-panel rounded-lg p-4">
            <h3 className="text-sm font-display font-semibold text-foreground mb-2">
              Speech Recognition: {isListening ? 'ON' : 'OFF'}
            </h3>
            <div className="flex gap-2 mb-3">
              <button
                onClick={startListening}
                disabled={isListening}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition"
              >
                <Mic className="w-4 h-4" /> Mic On
              </button>
              <button
                onClick={stopListening}
                disabled={!isListening}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-destructive text-destructive-foreground font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition"
              >
                <MicOff className="w-4 h-4" /> Mic Off
              </button>
              <button
                onClick={clearAll}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-semibold text-sm hover:opacity-90 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              className="w-full bg-muted rounded p-2 text-sm text-foreground resize-none border-0 focus:ring-1 focus:ring-primary outline-none"
              rows={2}
              placeholder="Speech input ..."
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
            />
            <button
              onClick={handleSpeechAnimate}
              className="w-full mt-2 py-2 rounded-md bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition"
            >
              <Play className="w-4 h-4 inline mr-1" />
              Start Animations
            </button>
          </div>

          {/* Text input */}
          <div className="glass-panel rounded-lg p-4">
            <h3 className="text-sm font-display font-semibold text-foreground mb-2">Text Input</h3>
            <textarea
              className="w-full bg-muted rounded p-2 text-sm text-foreground resize-none border-0 focus:ring-1 focus:ring-primary outline-none"
              rows={3}
              placeholder="Type text here ..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleTextSubmit())}
            />
            <button
              onClick={handleTextSubmit}
              className="w-full mt-2 py-2 rounded-md bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition"
            >
              <Play className="w-4 h-4 inline mr-1" />
              Start Animations
            </button>
          </div>

          {/* Sign info */}
          {currentPose.description !== 'Idle' && (
            <div className="glass-panel rounded-lg p-4">
              <div className="text-center">
                <p className="text-lg font-display font-bold text-foreground">{currentPose.description}</p>
                <p className={`text-sm font-semibold mt-1 ${
                  currentPose.method === 'dictionary' ? 'text-accent' :
                  currentPose.method === 'ml_prediction' ? 'text-primary' :
                  'text-muted-foreground'
                }`}>
                  {currentPose.method === 'dictionary' ? '📚 Dictionary' :
                   currentPose.method === 'ml_prediction' ? `🤖 ML (${(currentPose.confidence * 100).toFixed(0)}%)` :
                   '✋ Fingerspelling'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center - 3D Avatar */}
        <div className="flex-1 min-h-[400px] lg:min-h-0 rounded-lg overflow-hidden glow-border">
          <AvatarViewer pose={currentPose} avatarColor={avatarColor} />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-56 flex flex-col gap-4 shrink-0">
          {/* Avatar selector */}
          <div className="glass-panel rounded-lg p-4">
            <h3 className="text-sm font-display font-semibold text-foreground mb-3 text-center">Select Avatar</h3>
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_COLORS.map((ac) => (
                <button
                  key={ac.hex}
                  onClick={() => setAvatarColor(ac.hex)}
                  className={`rounded-lg p-2 text-xs font-semibold text-foreground transition border-2 ${
                    avatarColor === ac.hex ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{ background: `${ac.hex}22` }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-1"
                    style={{ background: ac.hex }}
                  />
                  {ac.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speed controls */}
          <div className="glass-panel rounded-lg p-4">
            <h3 className="text-sm font-display font-semibold text-foreground mb-3">
              Animation Speed: {animSpeed.toFixed(1)}
            </h3>
            <input
              type="range"
              min="0.3"
              max="3"
              step="0.1"
              value={animSpeed}
              onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />

            <h3 className="text-sm font-display font-semibold text-foreground mt-4 mb-2">
              Pause time: {pauseTime} ms
            </h3>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={pauseTime}
              onChange={(e) => setPauseTime(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Transcript */}
          <div className="glass-panel rounded-lg p-4 flex-1">
            <h3 className="text-sm font-display font-semibold text-foreground mb-2">Transcript</h3>
            <div className="max-h-40 overflow-y-auto text-xs text-muted-foreground space-y-1">
              {transcript.length === 0 ? (
                <p>No transcript yet...</p>
              ) : (
                transcript.map((t, i) => <p key={i}>{t}</p>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
