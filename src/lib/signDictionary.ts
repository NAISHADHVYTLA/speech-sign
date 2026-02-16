/**
 * Sign language dictionary mapping words to arm/hand poses.
 * Each pose defines rotation angles for shoulders, elbows, wrists, and finger states.
 */

export interface SignPose {
  description: string;
  leftShoulder: [number, number, number]; // rotation xyz
  rightShoulder: [number, number, number];
  leftElbow: [number, number, number];
  rightElbow: [number, number, number];
  leftWrist: [number, number, number];
  rightWrist: [number, number, number];
  fingersClosed: { left: boolean; right: boolean };
  facial: 'neutral' | 'smile' | 'sad' | 'questioning';
  method: 'dictionary' | 'ml_prediction' | 'fingerspelling';
  confidence: number;
}

export const DEFAULT_POSE: SignPose = {
  description: 'Idle',
  leftShoulder: [0, 0, 0.4],
  rightShoulder: [0, 0, -0.4],
  leftElbow: [0, 0, 0],
  rightElbow: [0, 0, 0],
  leftWrist: [0, 0, 0],
  rightWrist: [0, 0, 0],
  fingersClosed: { left: false, right: false },
  facial: 'neutral',
  method: 'dictionary',
  confidence: 1,
};

const SIGN_DICTIONARY: Record<string, Omit<SignPose, 'method' | 'confidence'>> = {
  hello: {
    description: 'Hello',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-1.2, 0.3, -0.8],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.8, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0.5],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  hi: {
    description: 'Hi',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-1.4, 0.2, -0.6],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.6, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0.3, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  goodbye: {
    description: 'Goodbye',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-1.3, 0.4, -0.7],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.5, 0, 0],
    leftWrist: [0, 0, 0.6],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  bye: {
    description: 'Bye',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-1.3, 0.4, -0.7],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.5, 0, 0],
    leftWrist: [0, 0, 0.6],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  thank: {
    description: 'Thank You',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.8, 0, 0],
    leftWrist: [0.4, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  thanks: {
    description: 'Thanks',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.8, 0, 0],
    leftWrist: [0.4, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  please: {
    description: 'Please',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.2, 0, -0.1],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.0, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0.3, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  sorry: {
    description: 'Sorry',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.2, 0, -0.1],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.2, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: true },
    facial: 'sad',
  },
  yes: {
    description: 'Yes',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [0, 0, -0.3],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.6, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0.4, 0, 0],
    fingersClosed: { left: false, right: true },
    facial: 'smile',
  },
  no: {
    description: 'No',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.4, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  good: {
    description: 'Good',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.4, 0, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.7, 0, 0],
    leftWrist: [0.3, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  bad: {
    description: 'Bad',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [0.2, 0, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.5, 0, 0],
    leftWrist: [-0.3, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'sad',
  },
  happy: {
    description: 'Happy',
    leftShoulder: [-0.6, 0, 0.6],
    rightShoulder: [-0.6, 0, -0.6],
    leftElbow: [-0.5, 0, 0],
    rightElbow: [-0.5, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  sad: {
    description: 'Sad',
    leftShoulder: [0.2, 0, 0.2],
    rightShoulder: [0.2, 0, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [0, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'sad',
  },
  love: {
    description: 'Love',
    leftShoulder: [-0.3, 0.3, 0.5],
    rightShoulder: [-0.3, -0.3, -0.5],
    leftElbow: [-1.2, 0, 0],
    rightElbow: [-1.2, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: true, right: true },
    facial: 'smile',
  },
  help: {
    description: 'Help',
    leftShoulder: [-0.5, 0, 0.5],
    rightShoulder: [-0.8, 0, -0.3],
    leftElbow: [-0.3, 0, 0],
    rightElbow: [-0.6, 0, 0],
    leftWrist: [0.3, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: true },
    facial: 'neutral',
  },
  i: {
    description: 'I / Me',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.1, 0, -0.1],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.2, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  me: {
    description: 'Me',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.1, 0, -0.1],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.2, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  you: {
    description: 'You',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.6, 0, -0.3],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.3, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  we: {
    description: 'We',
    leftShoulder: [-0.4, 0, 0.5],
    rightShoulder: [-0.4, 0, -0.5],
    leftElbow: [-0.3, 0, 0],
    rightElbow: [-0.3, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  what: {
    description: 'What?',
    leftShoulder: [-0.5, 0, 0.7],
    rightShoulder: [-0.5, 0, -0.7],
    leftElbow: [-0.5, 0, 0],
    rightElbow: [-0.5, 0, 0],
    leftWrist: [0, 0, 0.3],
    rightWrist: [0, 0, -0.3],
    fingersClosed: { left: false, right: false },
    facial: 'questioning',
  },
  where: {
    description: 'Where?',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.7, 0.2, -0.5],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.4, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0.4],
    fingersClosed: { left: false, right: false },
    facial: 'questioning',
  },
  who: {
    description: 'Who?',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.6, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0.3, 0],
    fingersClosed: { left: false, right: false },
    facial: 'questioning',
  },
  eat: {
    description: 'Eat',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.3, 0.2, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.4, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0.3, 0, 0],
    fingersClosed: { left: false, right: true },
    facial: 'neutral',
  },
  drink: {
    description: 'Drink',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.4, 0.2, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.5, 0, 0],
    leftWrist: [0.5, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: true },
    facial: 'neutral',
  },
  sleep: {
    description: 'Sleep',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.5, 0.3, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.3, 0, 0],
    leftWrist: [0.4, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  work: {
    description: 'Work',
    leftShoulder: [-0.3, 0, 0.3],
    rightShoulder: [-0.3, 0, -0.3],
    leftElbow: [-0.8, 0, 0],
    rightElbow: [-0.8, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: true, right: true },
    facial: 'neutral',
  },
  friend: {
    description: 'Friend',
    leftShoulder: [-0.4, 0.2, 0.4],
    rightShoulder: [-0.4, -0.2, -0.4],
    leftElbow: [-0.6, 0, 0],
    rightElbow: [-0.6, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  water: {
    description: 'Water',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.0, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0.4, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
  food: {
    description: 'Food',
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.3, 0.2, -0.2],
    leftElbow: [0, 0, 0],
    rightElbow: [-1.3, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0.3, 0, 0],
    fingersClosed: { left: false, right: true },
    facial: 'neutral',
  },
  home: {
    description: 'Home',
    leftShoulder: [-0.3, 0, 0.4],
    rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.8, 0, 0],
    rightElbow: [-0.8, 0, 0],
    leftWrist: [0.2, 0, 0.3],
    rightWrist: [0.2, 0, -0.3],
    fingersClosed: { left: false, right: false },
    facial: 'smile',
  },
  school: {
    description: 'School',
    leftShoulder: [-0.5, 0, 0.5],
    rightShoulder: [-0.5, 0, -0.5],
    leftElbow: [-0.4, 0, 0],
    rightElbow: [-0.4, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
  },
};

// Simple ML-like prediction based on word features
function predictSign(word: string): SignPose | null {
  const emotionWords = ['happy', 'sad', 'angry', 'love', 'hate', 'excited', 'scared'];
  const actionWords = ['eat', 'drink', 'sleep', 'work', 'play', 'run', 'walk', 'jump'];
  const greetingWords = ['hello', 'hi', 'hey', 'greetings', 'welcome'];
  const questionWords = ['what', 'where', 'who', 'when', 'why', 'how'];

  const w = word.toLowerCase();

  if (greetingWords.some(g => w.includes(g))) {
    return {
      ...SIGN_DICTIONARY['hello'],
      description: `${word} (ML)`,
      method: 'ml_prediction',
      confidence: 0.75,
    };
  }
  if (emotionWords.some(e => w.includes(e))) {
    return {
      ...(w.includes('sad') || w.includes('angry') || w.includes('hate') || w.includes('scared')
        ? SIGN_DICTIONARY['sad']
        : SIGN_DICTIONARY['happy']),
      description: `${word} (ML)`,
      method: 'ml_prediction',
      confidence: 0.7,
    };
  }
  if (actionWords.some(a => w.includes(a))) {
    return {
      ...SIGN_DICTIONARY['work'],
      description: `${word} (ML)`,
      method: 'ml_prediction',
      confidence: 0.65,
    };
  }
  if (questionWords.some(q => w.includes(q))) {
    return {
      ...SIGN_DICTIONARY['what'],
      description: `${word} (ML)`,
      method: 'ml_prediction',
      confidence: 0.7,
    };
  }

  return null;
}

export function getSign(word: string): SignPose {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');

  // 1. Dictionary lookup
  if (SIGN_DICTIONARY[w]) {
    return { ...SIGN_DICTIONARY[w], method: 'dictionary', confidence: 1 };
  }

  // 2. ML prediction
  const mlResult = predictSign(w);
  if (mlResult) return mlResult;

  // 3. Fingerspelling fallback
  return {
    description: `Spell: ${word.toUpperCase()}`,
    leftShoulder: [0, 0, 0.4],
    rightShoulder: [-0.7, 0, -0.4],
    leftElbow: [0, 0, 0],
    rightElbow: [-0.6, 0, 0],
    leftWrist: [0, 0, 0],
    rightWrist: [0, 0, 0],
    fingersClosed: { left: false, right: false },
    facial: 'neutral',
    method: 'fingerspelling',
    confidence: 1,
  };
}

export function getKnownWords(): string[] {
  return Object.keys(SIGN_DICTIONARY);
}
