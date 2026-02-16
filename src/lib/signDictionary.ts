/**
 * Sign language dictionary with individual finger control for fingerspelling.
 * fingers: [thumb, index, middle, ring, pinky] — 0 = open, 1 = closed
 */

export interface FingerState {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface SignPose {
  description: string;
  leftShoulder: [number, number, number];
  rightShoulder: [number, number, number];
  leftElbow: [number, number, number];
  rightElbow: [number, number, number];
  leftWrist: [number, number, number];
  rightWrist: [number, number, number];
  leftFingers: FingerState;
  rightFingers: FingerState;
  facial: 'neutral' | 'smile' | 'sad' | 'questioning';
  method: 'dictionary' | 'ml_prediction' | 'fingerspelling';
  confidence: number;
}

const OPEN: FingerState = { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
const CLOSED: FingerState = { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 1 };
const POINT: FingerState = { thumb: 1, index: 0, middle: 1, ring: 1, pinky: 1 };
const PEACE: FingerState = { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 };
const THUMBS_UP: FingerState = { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 };
const ILY: FingerState = { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 0 }; // I love you
const THREE_F: FingerState = { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 };
const FOUR_F: FingerState = { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 0 };
const PINKY: FingerState = { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 0 };

export const DEFAULT_POSE: SignPose = {
  description: 'Idle',
  leftShoulder: [0, 0, 0.4],
  rightShoulder: [0, 0, -0.4],
  leftElbow: [0, 0, 0],
  rightElbow: [0, 0, 0],
  leftWrist: [0, 0, 0],
  rightWrist: [0, 0, 0],
  leftFingers: OPEN,
  rightFingers: OPEN,
  facial: 'neutral',
  method: 'dictionary',
  confidence: 1,
};

// ============ ASL FINGERSPELLING ALPHABET ============
const FINGERSPELL_POSE: Omit<SignPose, 'description' | 'method' | 'confidence' | 'rightFingers'> = {
  leftShoulder: [0, 0, 0.4],
  rightShoulder: [-0.6, 0.1, -0.4],
  leftElbow: [0, 0, 0],
  rightElbow: [-0.8, 0, 0],
  leftWrist: [0, 0, 0],
  rightWrist: [0.3, 0, 0],
  leftFingers: OPEN,
  facial: 'neutral',
};

const ASL_LETTERS: Record<string, FingerState> = {
  a: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 1 },     // fist, thumb beside
  b: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 0 },     // flat hand, thumb tucked
  c: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }, // curved C
  d: { thumb: 0.5, index: 0, middle: 1, ring: 1, pinky: 1 },   // index up, others closed
  e: { thumb: 0.7, index: 0.7, middle: 0.7, ring: 0.7, pinky: 0.7 }, // curled fingers
  f: { thumb: 0.5, index: 0.5, middle: 0, ring: 0, pinky: 0 }, // OK-ish shape
  g: { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 1 },     // pointing sideways
  h: { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 },     // H shape
  i: { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 0 },     // pinky up
  j: { thumb: 1, index: 1, middle: 1, ring: 1, pinky: 0 },     // pinky up + motion
  k: { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 },     // peace + thumb
  l: { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 1 },     // L shape
  m: { thumb: 0.5, index: 1, middle: 1, ring: 1, pinky: 1 },   // thumb under 3 fingers
  n: { thumb: 0.5, index: 1, middle: 1, ring: 1, pinky: 1 },   // thumb under 2 fingers
  o: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }, // O shape
  p: { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 },     // downward K
  q: { thumb: 0, index: 0, middle: 1, ring: 1, pinky: 1 },     // downward G
  r: { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 },     // crossed fingers
  s: { thumb: 0.5, index: 1, middle: 1, ring: 1, pinky: 1 },   // fist, thumb over
  t: { thumb: 0.5, index: 1, middle: 1, ring: 1, pinky: 1 },   // thumb between index/middle
  u: { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 },     // U shape
  v: { thumb: 1, index: 0, middle: 0, ring: 1, pinky: 1 },     // V shape (peace)
  w: { thumb: 1, index: 0, middle: 0, ring: 0, pinky: 1 },     // W shape
  x: { thumb: 1, index: 0.5, middle: 1, ring: 1, pinky: 1 },   // hooked index
  y: { thumb: 0, index: 1, middle: 1, ring: 1, pinky: 0 },     // hang loose
  z: { thumb: 1, index: 0, middle: 1, ring: 1, pinky: 1 },     // trace Z with index
};

export function getLetterPose(letter: string): SignPose {
  const l = letter.toLowerCase();
  const fingers = ASL_LETTERS[l] || OPEN;
  return {
    ...FINGERSPELL_POSE,
    description: `Letter: ${letter.toUpperCase()}`,
    rightFingers: fingers,
    method: 'fingerspelling',
    confidence: 1,
  };
}

// ============ SIGN DICTIONARY ============
type DictEntry = Omit<SignPose, 'method' | 'confidence'>;

const SIGN_DICTIONARY: Record<string, DictEntry> = {
  // --- Greetings ---
  hello: {
    description: 'Hello', leftShoulder: [0, 0, 0.4], rightShoulder: [-1.2, 0.3, -0.8],
    leftElbow: [0, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0.5],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  hi: {
    description: 'Hi', leftShoulder: [0, 0, 0.4], rightShoulder: [-1.4, 0.2, -0.6],
    leftElbow: [0, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  goodbye: {
    description: 'Goodbye', leftShoulder: [0, 0, 0.4], rightShoulder: [-1.3, 0.4, -0.7],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0.6], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  bye: {
    description: 'Bye', leftShoulder: [0, 0, 0.4], rightShoulder: [-1.3, 0.4, -0.7],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0.6], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  welcome: {
    description: 'Welcome', leftShoulder: [-0.4, 0, 0.5], rightShoulder: [-0.4, 0, -0.5],
    leftElbow: [-0.3, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },

  // --- Politeness ---
  thank: {
    description: 'Thank You', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0.4, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  thanks: {
    description: 'Thanks', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0.4, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  please: {
    description: 'Please', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.2, 0, -0.1],
    leftElbow: [0, 0, 0], rightElbow: [-1.0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0.3, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  sorry: {
    description: 'Sorry', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.2, 0, -0.1],
    leftElbow: [0, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: CLOSED, facial: 'sad',
  },
  excuse: {
    description: 'Excuse me', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.2, 0, 0],
    leftFingers: OPEN, rightFingers: FOUR_F, facial: 'neutral',
  },

  // --- Yes / No / Maybe ---
  yes: {
    description: 'Yes', leftShoulder: [0, 0, 0.4], rightShoulder: [0, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.4, 0, 0],
    leftFingers: OPEN, rightFingers: CLOSED, facial: 'smile',
  },
  no: {
    description: 'No', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: PEACE, facial: 'neutral',
  },
  maybe: {
    description: 'Maybe', leftShoulder: [-0.4, 0, 0.5], rightShoulder: [-0.4, 0, -0.5],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0.2, 0, 0], rightWrist: [0.2, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'questioning',
  },
  ok: {
    description: 'OK', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: { thumb: 0.5, index: 0.5, middle: 0, ring: 0, pinky: 0 }, facial: 'smile',
  },

  // --- Emotions ---
  good: {
    description: 'Good', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.7, 0, 0], leftWrist: [0.3, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  bad: {
    description: 'Bad', leftShoulder: [0, 0, 0.4], rightShoulder: [0.2, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [-0.3, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'sad',
  },
  happy: {
    description: 'Happy', leftShoulder: [-0.6, 0, 0.6], rightShoulder: [-0.6, 0, -0.6],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  sad: {
    description: 'Sad', leftShoulder: [0.2, 0, 0.2], rightShoulder: [0.2, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'sad',
  },
  angry: {
    description: 'Angry', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.9, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
    rightFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }, facial: 'sad',
  },
  love: {
    description: 'Love', leftShoulder: [-0.3, 0.3, 0.5], rightShoulder: [-0.3, -0.3, -0.5],
    leftElbow: [-1.2, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: CLOSED, rightFingers: CLOSED, facial: 'smile',
  },
  hate: {
    description: 'Hate', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'sad',
  },
  scared: {
    description: 'Scared', leftShoulder: [-0.5, 0, 0.6], rightShoulder: [-0.5, 0, -0.6],
    leftElbow: [-0.7, 0, 0], rightElbow: [-0.7, 0, 0], leftWrist: [0, 0, 0.3], rightWrist: [0, 0, -0.3],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'sad',
  },
  excited: {
    description: 'Excited', leftShoulder: [-0.8, 0, 0.7], rightShoulder: [-0.8, 0, -0.7],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  tired: {
    description: 'Tired', leftShoulder: [0.1, 0, 0.3], rightShoulder: [0.1, 0, -0.3],
    leftElbow: [-0.2, 0, 0], rightElbow: [-0.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'sad',
  },
  beautiful: {
    description: 'Beautiful', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.2, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-1.0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0.3, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },

  // --- Pronouns ---
  i: {
    description: 'I / Me', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.1, 0, -0.1],
    leftElbow: [0, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  me: {
    description: 'Me', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.1, 0, -0.1],
    leftElbow: [0, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  you: {
    description: 'You', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.6, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  he: {
    description: 'He', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.3, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  she: {
    description: 'She', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, -0.3, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  we: {
    description: 'We', leftShoulder: [-0.4, 0, 0.5], rightShoulder: [-0.4, 0, -0.5],
    leftElbow: [-0.3, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  they: {
    description: 'They', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.4],
    leftElbow: [0, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0.3, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  my: {
    description: 'My', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.2, 0, -0.1],
    leftElbow: [0, 0, 0], rightElbow: [-1.1, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  your: {
    description: 'Your', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },

  // --- Questions ---
  what: {
    description: 'What?', leftShoulder: [-0.5, 0, 0.7], rightShoulder: [-0.5, 0, -0.7],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0.3], rightWrist: [0, 0, -0.3],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'questioning',
  },
  where: {
    description: 'Where?', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.7, 0.2, -0.5],
    leftElbow: [0, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0.4],
    leftFingers: OPEN, rightFingers: POINT, facial: 'questioning',
  },
  who: {
    description: 'Who?', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0.3, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'questioning',
  },
  when: {
    description: 'When?', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.6, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0.3],
    leftFingers: OPEN, rightFingers: POINT, facial: 'questioning',
  },
  why: {
    description: 'Why?', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.7, 0, -0.4],
    leftElbow: [0, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 }, facial: 'questioning',
  },
  how: {
    description: 'How?', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0.3, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: CLOSED, rightFingers: CLOSED, facial: 'questioning',
  },

  // --- Actions ---
  eat: {
    description: 'Eat', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: CLOSED, facial: 'neutral',
  },
  drink: {
    description: 'Drink', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.5, 0, 0], leftWrist: [0.5, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }, facial: 'neutral',
  },
  sleep: {
    description: 'Sleep', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.3, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.3, 0, 0], leftWrist: [0.4, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  work: {
    description: 'Work', leftShoulder: [-0.3, 0, 0.3], rightShoulder: [-0.3, 0, -0.3],
    leftElbow: [-0.8, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: CLOSED, rightFingers: CLOSED, facial: 'neutral',
  },
  play: {
    description: 'Play', leftShoulder: [-0.5, 0, 0.5], rightShoulder: [-0.5, 0, -0.5],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0.3], rightWrist: [0, 0, -0.3],
    leftFingers: ILY, rightFingers: ILY, facial: 'smile',
  },
  run: {
    description: 'Run', leftShoulder: [-0.6, 0, 0.4], rightShoulder: [-0.2, 0, -0.4],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: POINT, rightFingers: POINT, facial: 'neutral',
  },
  walk: {
    description: 'Walk', leftShoulder: [-0.3, 0, 0.3], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: PEACE, rightFingers: PEACE, facial: 'neutral',
  },
  stop: {
    description: 'Stop', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.6, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.5, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  go: {
    description: 'Go', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.4],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  come: {
    description: 'Come', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.7, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  give: {
    description: 'Give', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  take: {
    description: 'Take', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: CLOSED, facial: 'neutral',
  },
  want: {
    description: 'Want', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0.3, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: { thumb: 0, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
    rightFingers: { thumb: 0, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }, facial: 'neutral',
  },
  need: {
    description: 'Need', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.4, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  like: {
    description: 'Like', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: THUMBS_UP, facial: 'smile',
  },
  know: {
    description: 'Know', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  think: {
    description: 'Think', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  see: {
    description: 'See', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.7, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: PEACE, facial: 'neutral',
  },
  hear: {
    description: 'Hear', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.3, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  speak: {
    description: 'Speak', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.1, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.1, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.2, 0, 0],
    leftFingers: OPEN, rightFingers: FOUR_F, facial: 'neutral',
  },
  learn: {
    description: 'Learn', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.2, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  teach: {
    description: 'Teach', leftShoulder: [-0.4, 0, 0.4], rightShoulder: [-0.4, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0.3, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  read: {
    description: 'Read', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: PEACE, facial: 'neutral',
  },
  write: {
    description: 'Write', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  wait: {
    description: 'Wait', leftShoulder: [-0.4, 0, 0.5], rightShoulder: [-0.4, 0, -0.5],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0.2], rightWrist: [0, 0, -0.2],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  sit: {
    description: 'Sit', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: PEACE, facial: 'neutral',
  },
  stand: {
    description: 'Stand', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.4, 0, -0.3],
    leftElbow: [-0.3, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: PEACE, facial: 'neutral',
  },

  // --- People ---
  friend: {
    description: 'Friend', leftShoulder: [-0.4, 0.2, 0.4], rightShoulder: [-0.4, -0.2, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: POINT, rightFingers: POINT, facial: 'smile',
  },
  mother: {
    description: 'Mother', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.1, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: THUMBS_UP, facial: 'smile',
  },
  father: {
    description: 'Father', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.1, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.1, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: THUMBS_UP, facial: 'smile',
  },
  sister: {
    description: 'Sister', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.2, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'smile',
  },
  brother: {
    description: 'Brother', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.2, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'smile',
  },
  baby: {
    description: 'Baby', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.2, 0, -0.3],
    leftElbow: [-0.8, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  man: {
    description: 'Man', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.1, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  woman: {
    description: 'Woman', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.1, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  teacher: {
    description: 'Teacher', leftShoulder: [-0.4, 0, 0.4], rightShoulder: [-0.4, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0.3, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  doctor: {
    description: 'Doctor', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.7, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },

  // --- Things / Places ---
  water: {
    description: 'Water', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0.4, 0],
    leftFingers: OPEN, rightFingers: { thumb: 0, index: 0, middle: 0, ring: 1, pinky: 1 }, facial: 'neutral',
  },
  food: {
    description: 'Food', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0.2, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: CLOSED, facial: 'neutral',
  },
  home: {
    description: 'Home', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.8, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0.2, 0, 0.3], rightWrist: [0.2, 0, -0.3],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  school: {
    description: 'School', leftShoulder: [-0.5, 0, 0.5], rightShoulder: [-0.5, 0, -0.5],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  help: {
    description: 'Help', leftShoulder: [-0.5, 0, 0.5], rightShoulder: [-0.8, 0, -0.3],
    leftElbow: [-0.3, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0.3, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: THUMBS_UP, facial: 'neutral',
  },
  book: {
    description: 'Book', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  phone: {
    description: 'Phone', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0.3, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: ILY, facial: 'neutral',
  },
  car: {
    description: 'Car', leftShoulder: [-0.3, 0, 0.3], rightShoulder: [-0.3, 0, -0.3],
    leftElbow: [-0.7, 0, 0], rightElbow: [-0.7, 0, 0], leftWrist: [0, 0, 0.2], rightWrist: [0, 0, -0.2],
    leftFingers: CLOSED, rightFingers: CLOSED, facial: 'neutral',
  },
  money: {
    description: 'Money', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.3, 0, -0.3],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },

  // --- Numbers ---
  one: {
    description: '1', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  two: {
    description: '2', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: PEACE, facial: 'neutral',
  },
  three: {
    description: '3', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: THREE_F, facial: 'neutral',
  },
  four: {
    description: '4', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: FOUR_F, facial: 'neutral',
  },
  five: {
    description: '5', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },

  // --- Time ---
  today: {
    description: 'Today', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  tomorrow: {
    description: 'Tomorrow', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: THUMBS_UP, facial: 'neutral',
  },
  yesterday: {
    description: 'Yesterday', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0.3, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [-0.3, 0, 0],
    leftFingers: OPEN, rightFingers: THUMBS_UP, facial: 'neutral',
  },
  now: {
    description: 'Now', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0.2, 0, 0], rightWrist: [0.2, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  later: {
    description: 'Later', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.4, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  morning: {
    description: 'Morning', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.6, 0, -0.4],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.4, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'smile',
  },
  night: {
    description: 'Night', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.4, 0, -0.3],
    leftElbow: [-0.4, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [-0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },

  // --- Misc ---
  more: {
    description: 'More', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: CLOSED, rightFingers: CLOSED, facial: 'neutral',
  },
  again: {
    description: 'Again', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.4, 0, -0.3],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  same: {
    description: 'Same', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.4, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  different: {
    description: 'Different', leftShoulder: [-0.3, 0, 0.4], rightShoulder: [-0.3, 0, -0.4],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0.3], rightWrist: [0, 0, -0.3],
    leftFingers: POINT, rightFingers: POINT, facial: 'neutral',
  },
  big: {
    description: 'Big', leftShoulder: [-0.5, 0, 0.7], rightShoulder: [-0.5, 0, -0.7],
    leftElbow: [-0.3, 0, 0], rightElbow: [-0.3, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  small: {
    description: 'Small', leftShoulder: [-0.3, 0, 0.3], rightShoulder: [-0.3, 0, -0.3],
    leftElbow: [-0.6, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  hot: {
    description: 'Hot', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-1.0, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.4, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  cold: {
    description: 'Cold', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.2, 0, -0.3],
    leftElbow: [-0.9, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: CLOSED, rightFingers: CLOSED, facial: 'sad',
  },
  new: {
    description: 'New', leftShoulder: [-0.2, 0, 0.3], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [-0.5, 0, 0], rightElbow: [-0.6, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0.3, 0, 0],
    leftFingers: OPEN, rightFingers: OPEN, facial: 'neutral',
  },
  old: {
    description: 'Old', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.9, 0, 0], leftWrist: [0, 0, 0], rightWrist: [-0.3, 0, 0],
    leftFingers: OPEN, rightFingers: CLOSED, facial: 'neutral',
  },
  true: {
    description: 'True', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.5, 0, -0.3],
    leftElbow: [0, 0, 0], rightElbow: [-0.5, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: POINT, facial: 'neutral',
  },
  wrong: {
    description: 'Wrong', leftShoulder: [0, 0, 0.4], rightShoulder: [-0.3, 0, -0.2],
    leftElbow: [0, 0, 0], rightElbow: [-0.8, 0, 0], leftWrist: [0, 0, 0], rightWrist: [0, 0, 0],
    leftFingers: OPEN, rightFingers: ILY, facial: 'sad',
  },
};

// ============ LOOKUP FUNCTIONS ============

function predictSign(word: string): SignPose | null {
  const emotionWords = ['happy', 'sad', 'angry', 'love', 'hate', 'excited', 'scared'];
  const actionWords = ['eat', 'drink', 'sleep', 'work', 'play', 'run', 'walk', 'jump'];
  const greetingWords = ['hello', 'hi', 'hey', 'greetings', 'welcome'];
  const questionWords = ['what', 'where', 'who', 'when', 'why', 'how'];

  const w = word.toLowerCase();

  if (greetingWords.some(g => w.includes(g))) {
    return { ...SIGN_DICTIONARY['hello'], description: `${word} (ML)`, method: 'ml_prediction', confidence: 0.75 };
  }
  if (emotionWords.some(e => w.includes(e))) {
    const base = w.includes('sad') || w.includes('angry') || w.includes('hate') || w.includes('scared')
      ? SIGN_DICTIONARY['sad'] : SIGN_DICTIONARY['happy'];
    return { ...base, description: `${word} (ML)`, method: 'ml_prediction', confidence: 0.7 };
  }
  if (actionWords.some(a => w.includes(a))) {
    return { ...SIGN_DICTIONARY['work'], description: `${word} (ML)`, method: 'ml_prediction', confidence: 0.65 };
  }
  if (questionWords.some(q => w.includes(q))) {
    return { ...SIGN_DICTIONARY['what'], description: `${word} (ML)`, method: 'ml_prediction', confidence: 0.7 };
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

  // 3. Single letter → fingerspell that letter
  if (w.length === 1 && ASL_LETTERS[w]) {
    return getLetterPose(w);
  }

  // 4. Fingerspelling fallback — return first letter pose
  return {
    ...FINGERSPELL_POSE,
    description: `Spell: ${word.toUpperCase()}`,
    rightFingers: ASL_LETTERS[w[0]] || OPEN,
    method: 'fingerspelling',
    confidence: 1,
  };
}

export function getKnownWords(): string[] {
  return Object.keys(SIGN_DICTIONARY);
}

export function getLetterKeys(): string[] {
  return Object.keys(ASL_LETTERS);
}
