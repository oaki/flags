import {
  CheckCircle2,
  Flag,
  Brush,
  Award,
  CalendarDays,
  Globe2,
  Lock,
  Map,
  MapPin,
  BookOpen,
  BarChart3,
  Eye,
  Undo2,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import packageInfo from '../package.json';
import { countries } from './data/countries';
import { Level, levels, maxLevelId } from './data/levels';
import { getCountryStory, getKidFact } from './data/countryFacts';
import { createQuestions, Difficulty, europeMapPoints, GameMode, getFlagPalette, Question } from './game';
import { AnswerRecord, useProgress } from './hooks/useProgress';

type Screen = 'levels' | 'quiz' | 'result' | 'album' | 'parent';

const regionNames: Record<string, string> = {
  Africa: 'Afrika',
  Americas: 'Amerika',
  Antarctic: 'Antarktida',
  Asia: 'Ázia',
  Europe: 'Európa',
  Oceania: 'Oceánia',
};

const levelIcons = ['⭐', '🏰', '🌎', '🧭', '☀️', '🌊', '🔎', '🌍'];
const levelThemes = ['sunny', 'forest', 'coral', 'jade', 'gold', 'ocean', 'violet', 'rainbow'];
const soundStorageKey = 'flag-world-kids-sound-v1';
const voiceStorageKey = 'flag-world-kids-voice-v1';
const difficultyStorageKey = 'flag-world-kids-difficulty-v1';
const modeStorageKey = 'flag-world-kids-mode-v1';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const difficultyLabels = {
  baby: {
    title: 'Baby Explorer',
    subtitle: '2 možnosti, veľké víťazstvá',
  },
  junior: {
    title: 'Junior Quiz',
    subtitle: '3 možnosti, dobrý tréning',
  },
  master: {
    title: 'Flag Master',
    subtitle: '4 možnosti a viac detailov',
  },
} satisfies Record<Difficulty, { title: string; subtitle: string }>;

const modeLabels = {
  journey: {
    title: 'Cesta Európou',
    subtitle: 'Nové a slabšie krajiny sa vracajú častejšie',
  },
  country: {
    title: 'Guess the Country',
    subtitle: 'Pozri názov krajiny a vyber správnu vlajku',
  },
  map: {
    title: 'Find on Map',
    subtitle: 'Nájdi krajinu na mape Európy',
  },
  similar: {
    title: 'Podobné vlajky',
    subtitle: 'Slovensko/Slovinsko, Monako/Indonézia a ďalšie pasce',
  },
  paint: {
    title: 'Flag Painter',
    subtitle: 'Vyskladaj farby vlajky v správnom poradí',
  },
} satisfies Record<GameMode, { title: string; subtitle: string }>;

const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

const buildQuestionSpeech = (question: Question) => {
  if (question.mode === 'paint') {
    const palette = getFlagPalette(question.answer.code);
    const slots = palette?.colors.length || 0;

    return `Flag Painter. Skladáme vlajku krajiny ${question.answer.name}. Vyber ${slots} farby v správnom poradí.`;
  }

  if (question.mode === 'country') {
    return `Nájdi vlajku krajiny ${question.answer.name}. Vyber správny obrázok vlajky.`;
  }

  if (question.mode === 'map') {
    return `Nájdi na mape krajinu ${question.answer.name}. Ťukni na správny bod.`;
  }

  const options = question.options
    .map((option, index) => `Po ${getOptionLabel(index)}: ${option.name}.`)
    .join(' ');

  return `Máme novú vlajku. Pozri sa na ňu a vyber správnu krajinu. ${options}`;
};

const scoreVoice = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();

  if (lang === 'sk-sk') return 100;
  if (lang.startsWith('sk')) return 92;
  if (name.includes('slovak') || name.includes('sloven')) return 88;
  if (lang === 'cs-cz') return 72;
  if (lang.startsWith('cs')) return 66;
  if (name.includes('czech') || name.includes('česk')) return 62;
  if (lang.startsWith('pl') || lang.startsWith('hu')) return 32;
  return 0;
};

const findBestVoice = (voices: SpeechSynthesisVoice[]) =>
  [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];

const App = () => {
  const { progress, saveScore, chooseLevel, resetProgress } = useProgress();
  const [screen, setScreen] = useState<Screen>('levels');
  const [activeLevel, setActiveLevel] = useState<Level>(levels[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [sessionDiscovered, setSessionDiscovered] = useState<string[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<AnswerRecord[]>([]);
  const [paintColors, setPaintColors] = useState<string[]>([]);
  const [activeDailyDate, setActiveDailyDate] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    if (typeof window === 'undefined') return 'junior';
    return (localStorage.getItem(difficultyStorageKey) as Difficulty) || 'junior';
  });
  const [mode, setMode] = useState<GameMode>(() => {
    if (typeof window === 'undefined') return 'journey';
    return (localStorage.getItem(modeStorageKey) as GameMode) || 'journey';
  });
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(soundStorageKey) === 'true';
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(voiceStorageKey) || '';
  });

  const currentQuestion = questions[questionIndex];
  const discoveredSet = useMemo(() => new Set(progress.discoveredCountries), [progress.discoveredCountries]);
  const totalAccuracy = progress.totalAnswered
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : 0;

  const discoveredFlags = progress.discoveredCountries.length;
  const activeBest = progress.bestScores[activeLevel.id] || 0;
  const passed = score >= activeLevel.targetScore;
  const newSessionDiscoveries = sessionDiscovered.filter((code) => !discoveredSet.has(code));
  const selectedVoice = voices.find((voice) => voice.voiceURI === selectedVoiceURI) || findBestVoice(voices);
  const currentPalette = currentQuestion ? getFlagPalette(currentQuestion.answer.code) : undefined;
  const mapChoices = useMemo(() => {
    if (!currentQuestion) return [];
    const optionCodes = new Set(currentQuestion.options.map((option) => option.code));
    return europeMapPoints.filter((point) => optionCodes.has(point.code));
  }, [currentQuestion]);
  const paintChoices = useMemo(() => {
    if (!currentQuestion) return [];
    const colors = currentQuestion.options.flatMap((option) => getFlagPalette(option.code)?.colors || []);
    return Array.from(new Set(colors));
  }, [currentQuestion]);
  const paintComplete = Boolean(currentPalette && paintColors.length >= currentPalette.colors.length);
  const todayKey = getTodayKey();
  const dailyDone = progress.dailyChallengeDates.includes(todayKey);
  const weakCountryCodes = useMemo(
    () =>
      Object.entries(progress.countryMistakes)
        .filter(([code, mistakes]) => mistakes > (progress.countryCorrect[code] || 0))
        .map(([code]) => code),
    [progress.countryCorrect, progress.countryMistakes],
  );
  const weakestCountries = useMemo(
    () =>
      weakCountryCodes
        .map((code) => countries.find((country) => country.code === code))
        .filter((country): country is (typeof countries)[number] => Boolean(country))
        .slice(0, 6),
    [weakCountryCodes],
  );

  const continentAccuracy = useMemo(() => {
    return Object.entries(regionNames).map(([region, label]) => {
      const regionCountries = countries.filter((country) => country.region === region);
      const answeredCount = regionCountries.reduce((sum, country) => sum + (progress.countryAttempts[country.code] || 0), 0);
      const correctCount = regionCountries.reduce((sum, country) => sum + (progress.countryCorrect[country.code] || 0), 0);
      return {
        label,
        answeredCount,
        accuracy: answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0,
      };
    });
  }, [progress.countryAttempts, progress.countryCorrect]);
  const achievements = useMemo(
    () => [
      {
        title: 'Európsky objaviteľ',
        detail: 'Objav 10 európskych krajín',
        unlocked: levels[1].countryCodes.filter((code) => discoveredSet.has(code)).length >= 10,
      },
      {
        title: 'Bezchybná séria',
        detail: 'Daj aspoň 5 správnych v jednej výprave',
        unlocked: Object.values(progress.bestScores).some((best) => best >= 5),
      },
      {
        title: 'Malý geograf',
        detail: 'Odohraté 3 výpravy',
        unlocked: progress.sessionsPlayed >= 3,
      },
      {
        title: 'Denný cestovateľ',
        detail: 'Dokonči dennú výzvu',
        unlocked: progress.dailyChallengeDates.length > 0,
      },
    ],
    [discoveredSet, progress.bestScores, progress.dailyChallengeDates.length, progress.sessionsPlayed],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (!selectedVoiceURI && availableVoices.length) {
        const bestVoice = findBestVoice(availableVoices);
        if (bestVoice) {
          setSelectedVoiceURI(bestVoice.voiceURI);
          localStorage.setItem(voiceStorageKey, bestVoice.voiceURI);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoiceURI]);

  const speakText = (text: string, force = false) => {
    if (!force && !soundOn) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = selectedVoice?.lang || 'sk-SK';
    utterance.rate = selectedVoice?.lang.toLowerCase().startsWith('sk') ? 0.9 : 0.84;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSound = () => {
    const nextSound = !soundOn;
    setSoundOn(nextSound);
    localStorage.setItem(soundStorageKey, String(nextSound));

    if (!nextSound) {
      window.speechSynthesis?.cancel();
      return;
    }

    if (currentQuestion && screen === 'quiz' && !answered) {
      speakText(buildQuestionSpeech(currentQuestion), true);
      return;
    }

    speakText('Zvuk je zapnutý. Pri novej vlajke ti prečítam otázku aj možnosti.', true);
  };

  const changeVoice = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    localStorage.setItem(voiceStorageKey, voiceURI);

    const nextVoice = voices.find((voice) => voice.voiceURI === voiceURI);
    if (nextVoice && soundOn) {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance('Toto je hlas, ktorý bude čítať otázky vo Vlajkovom svete.');
      utterance.voice = nextVoice;
      utterance.lang = nextVoice.lang;
      utterance.rate = nextVoice.lang.toLowerCase().startsWith('sk') ? 0.9 : 0.84;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const changeDifficulty = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    localStorage.setItem(difficultyStorageKey, nextDifficulty);
  };

  const changeMode = (nextMode: GameMode) => {
    setMode(nextMode);
    localStorage.setItem(modeStorageKey, nextMode);
  };

  const startLevel = (level: Level) => {
    const nextQuestions = createQuestions(level, {
      difficulty,
      mode,
      weakCountryCodes,
      discoveredCountryCodes: progress.discoveredCountries,
    });

    chooseLevel(level.id);
    setActiveLevel(level);
    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelectedCode(null);
    setAnswered(false);
    setSessionDiscovered([]);
    setSessionAnswers([]);
    setPaintColors([]);
    setActiveDailyDate(null);
    setScreen('quiz');
    if (nextQuestions[0]) speakText(buildQuestionSpeech(nextQuestions[0]));
  };

  const startDailyChallenge = () => {
    const dailyLevel: Level = {
      ...levels[1],
      title: 'Denná výzva',
      subtitle: 'Krátka európska misia na dnes',
      targetScore: 4,
      questionCount: 5,
    };

    const nextQuestions = createQuestions(dailyLevel, {
      difficulty,
      mode,
      weakCountryCodes,
      discoveredCountryCodes: progress.discoveredCountries,
    });

    chooseLevel(levels[1].id);
    setActiveLevel(dailyLevel);
    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelectedCode(null);
    setAnswered(false);
    setSessionDiscovered([]);
    setSessionAnswers([]);
    setPaintColors([]);
    setActiveDailyDate(todayKey);
    setScreen('quiz');
    if (nextQuestions[0]) speakText(buildQuestionSpeech(nextQuestions[0]));
  };

  const recordAnswer = (correct: boolean) => {
    if (!currentQuestion) return;

    const newDiscovery = isNewDiscovery(currentQuestion.answer.code);
    setAnswered(true);
    setSessionDiscovered((current) => Array.from(new Set([...current, currentQuestion.answer.code])));
    setSessionAnswers((current) => [
      ...current,
      {
        countryCode: currentQuestion.answer.code,
        correct,
      },
    ]);
    if (correct) {
      setScore((current) => current + 1);
      speakText(getCorrectVoiceText(currentQuestion, newDiscovery));
      return;
    }

    speakText(getWrongVoiceText(currentQuestion));
  };

  const handleAnswer = (code: string) => {
    if (answered || !currentQuestion) return;

    setSelectedCode(code);
    recordAnswer(code === currentQuestion.answer.code);
  };

  const choosePaintColor = (color: string) => {
    if (answered || !currentPalette || paintComplete) return;
    setPaintColors((current) => [...current, color]);
  };

  const undoPaintColor = () => {
    if (answered) return;
    setPaintColors((current) => current.slice(0, -1));
  };

  const submitPainting = () => {
    if (answered || !currentQuestion || !currentPalette || !paintComplete) return;

    const correct = currentPalette.colors.every((color, index) => color === paintColors[index]);
    setSelectedCode(correct ? currentQuestion.answer.code : 'paint-wrong');
    recordAnswer(correct);
  };

  const isNewDiscovery = (code: string) => !discoveredSet.has(code) && !sessionDiscovered.includes(code);

  const getCorrectVoiceText = (question: Question, newDiscovery: boolean) => {
    if (question.mode === 'paint') {
      return newDiscovery
        ? `Výborne. Farby sedia a ${question.answer.name} pribúda do albumu. ${getCountryStory(question.answer)}`
        : `Výborne. Farby vlajky krajiny ${question.answer.name} sedia. ${getCountryStory(question.answer)}`;
    }

    if (question.mode === 'country') {
      return newDiscovery
        ? `Správne. Toto je vlajka krajiny ${question.answer.name} a pribúda do albumu. ${getCountryStory(question.answer)}`
        : `Správne. Toto je vlajka krajiny ${question.answer.name}. ${getCountryStory(question.answer)}`;
    }

    if (question.mode === 'map') {
      return newDiscovery
        ? `Správne. Našiel si krajinu ${question.answer.name} na mape a pribúda do albumu. ${getCountryStory(question.answer)}`
        : `Správne. Našiel si krajinu ${question.answer.name} na mape. ${getCountryStory(question.answer)}`;
    }

    return newDiscovery
      ? `Správne. ${question.answer.name} pribúda do albumu. ${getCountryStory(question.answer)}`
      : `Správne. Toto je ${question.answer.name}. ${getCountryStory(question.answer)}`;
  };

  const getWrongVoiceText = (question: Question) => {
    if (question.mode === 'paint') {
      return `Ešte nie. Vlajka krajiny ${question.answer.name} má iné poradie farieb. ${question.hint}`;
    }

    if (question.mode === 'map') {
      return `Ešte nie. Správna krajina je ${question.answer.name}. ${question.hint}`;
    }

    return `Ešte nie. Správna odpoveď je ${question.answer.name}. ${question.hint}`;
  };

  const getFeedbackTitle = (question: Question, correct: boolean, newDiscovery: boolean) => {
    if (!correct) {
      if (question.mode === 'paint') return `Ešte nie. Toto bola vlajka krajiny ${question.answer.name}.`;
      return `Takmer. Správne je ${question.answer.name}.`;
    }

    if (question.mode === 'paint') {
      return newDiscovery ? 'Farby sedia, krajina pribudla do albumu.' : 'Farby sedia.';
    }

    if (question.mode === 'map') {
      return newDiscovery ? 'Správne miesto, krajina pribudla do albumu.' : 'Správne miesto na mape.';
    }

    return newDiscovery ? 'Správne, krajina pribudla do albumu.' : 'Správne.';
  };

  const getFeedbackDetail = (question: Question, correct: boolean) => {
    if (correct) return getCountryStory(question.answer);
    if (question.mode === 'paint') {
      const palette = getFlagPalette(question.answer.code);
      return palette
        ? `Správne poradie je: ${palette.labels.join(' · ')}. ${question.hint}`
        : `Skús si všimnúť poradie farieb. ${question.hint}`;
    }
    return `${getKidFact(question.answer)} Tip: ${question.hint}`;
  };

  const getQuestionTitle = (question: Question) => {
    if (question.mode === 'paint') return 'Vyskladaj farby vlajky.';
    if (question.mode === 'country') return `Ktorá vlajka patrí krajine ${question.answer.name}?`;
    if (question.mode === 'map') return `Kde na mape je ${question.answer.name}?`;
    return 'Ktorej krajine patrí táto vlajka?';
  };

  const nextQuestion = () => {
    if (!currentQuestion) return;

    const finalScore = score;
    if (questionIndex + 1 >= questions.length) {
      const passedLevel = finalScore >= activeLevel.targetScore;
      saveScore(activeLevel.id, finalScore, activeLevel.questionCount, passedLevel, sessionDiscovered, sessionAnswers, activeDailyDate || undefined);
      setScore(finalScore);
      setScreen('result');
      return;
    }

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setSelectedCode(null);
    setAnswered(false);
    setPaintColors([]);
    speakText(buildQuestionSpeech(questions[nextIndex]));
  };

  return (
    <main className="app-shell">
      <div className="sky-shape shape-one" />
      <div className="sky-shape shape-two" />

      <section className="topbar" aria-label="Prehľad hry">
        <button className="brand" type="button" onClick={() => setScreen('levels')}>
          <span className="brand-mark">
            <Flag size={26} />
          </span>
          <div>
            <p>Vlajkový svet</p>
            <span>{countries.length} vlajok z celého sveta</span>
          </div>
        </button>

        <nav className="nav-tabs" aria-label="Navigácia">
          <button className={screen === 'levels' ? 'active' : ''} type="button" onClick={() => setScreen('levels')}>
            <Map size={18} />
            Mapa
          </button>
          <button className={screen === 'album' ? 'active' : ''} type="button" onClick={() => setScreen('album')}>
            <BookOpen size={18} />
            Album
          </button>
          <button className={screen === 'parent' ? 'active' : ''} type="button" onClick={() => setScreen('parent')}>
            <BarChart3 size={18} />
            Rodič
          </button>
        </nav>

        <div className="stats">
          <div>
            <strong>{progress.unlockedLevel}</strong>
            <span>level</span>
          </div>
          <div>
            <strong>{totalAccuracy}%</strong>
            <span>úspešnosť</span>
          </div>
          <div>
            <strong>{discoveredFlags}</strong>
            <span>vlajky</span>
          </div>
        </div>
      </section>

      {screen === 'levels' && (
        <section className="level-layout">
          <div className="hero-world">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={18} />
                Detská výprava okolo sveta
              </span>
              <h1>Zbieraj vlajky a malé objavy.</h1>
              <p>
                Každá správna odpoveď odomkne novú krajinu v albume a krátky príbeh, ktorý si dieťa ľahko zapamätá.
              </p>
            </div>
            <button className="adventure-button" type="button" onClick={() => startLevel(levels[1])}>
              <Sparkles size={22} />
              Začať dobrodružstvo
            </button>
            <button className={`daily-button ${dailyDone ? 'done' : ''}`} type="button" onClick={startDailyChallenge}>
              <CalendarDays size={20} />
              {dailyDone ? 'Denná výzva hotová' : 'Denná výzva'}
            </button>
            <div className="world-orbit" aria-hidden="true">
              <span>⭐</span>
              <span>🧭</span>
              <span>🏰</span>
              <span>🌊</span>
              <Globe2 size={118} />
            </div>
            <div className="europe-progress" aria-label="Postup v Európe">
              <div>
                <strong>{levels[1].countryCodes.filter((code) => discoveredSet.has(code)).length}</strong>
                <span>európskych krajín objavených</span>
              </div>
              <div className="mini-europe-map">
                <span className="map-land land-west" />
                <span className="map-land land-north" />
                <span className="map-land land-east" />
                <span className="map-land land-south" />
                {europeMapPoints.map((point) => {
                  const country = countries.find((item) => item.code === point.code);

                  return (
                    <span
                      className={`map-point ${discoveredSet.has(point.code) ? 'found' : ''}`}
                      key={point.code}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      title={country?.name || point.code}
                    >
                      {point.code}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="achievement-strip" aria-label="Odznaky">
              {achievements.map((achievement) => (
                <span className={achievement.unlocked ? 'unlocked' : ''} key={achievement.title}>
                  <Award size={15} />
                  {achievement.title}
                </span>
              ))}
            </div>
            <button className="reset-button" type="button" onClick={resetProgress}>
              <RotateCcw size={18} />
              Začať odznova
            </button>
          </div>

          <div className="level-trail" aria-label="Levely">
            <div className="play-settings">
              <div>
                <span className="eyebrow">
                  <Target size={18} />
                  Ako dnes hráme
                </span>
                <h2>Vyber tempo výpravy</h2>
              </div>
              <div className="setting-group" aria-label="Obtiažnosť">
                {(Object.keys(difficultyLabels) as Difficulty[]).map((key) => (
                  <button
                    className={difficulty === key ? 'active' : ''}
                    key={key}
                    onClick={() => changeDifficulty(key)}
                    type="button"
                  >
                    <strong>{difficultyLabels[key].title}</strong>
                    <span>{difficultyLabels[key].subtitle}</span>
                  </button>
                ))}
              </div>
              <div className="setting-group modes" aria-label="Herný mód">
                {(Object.keys(modeLabels) as GameMode[]).map((key) => (
                  <button className={mode === key ? 'active' : ''} key={key} onClick={() => changeMode(key)} type="button">
                    {key === 'paint' && <Brush size={18} />}
                    {key === 'map' && <MapPin size={18} />}
                    <strong>{modeLabels[key].title}</strong>
                    <span>{modeLabels[key].subtitle}</span>
                  </button>
                ))}
              </div>
            </div>
            {levels.map((level, index) => {
              const isLocked = level.id > progress.unlockedLevel;
              const best = progress.bestScores[level.id] || 0;
              const isCurrent = level.id === progress.currentLevel;
              const discoveredInLevel = level.countryCodes.filter((code) => discoveredSet.has(code)).length;

              return (
                <button
                  className={`trail-card ${levelThemes[index]} ${isCurrent ? 'current' : ''}`}
                  disabled={isLocked}
                  key={level.id}
                  onClick={() => startLevel(level)}
                  type="button"
                >
                  <span className="trail-animal" aria-hidden="true">
                    {isLocked ? '🔒' : levelIcons[index]}
                  </span>
                  <span className="level-number">Level {level.id}</span>
                  <strong>{level.title}</strong>
                  <small>{level.subtitle}</small>
                  <span className="level-meta">
                    Objavené: {discoveredInLevel}/{level.countryCodes.length} · cieľ {level.targetScore}/
                    {level.questionCount}
                  </span>
                  <span className="best-score">
                    {isLocked ? (
                      <>
                        <Lock size={15} /> Zamknuté
                      </>
                    ) : (
                      `Najlepšie ${best}/${level.questionCount}`
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {screen === 'album' && (
        <section className="album-layout">
          <div className="album-header">
            <div>
              <span className="eyebrow">
                <BookOpen size={18} />
                Album vlajok
              </span>
              <h2>{discoveredFlags} z {countries.length} vlajok</h2>
            </div>
            <button className="next-button" type="button" onClick={() => startLevel(levels[progress.currentLevel - 1] || levels[0])}>
              Pokračovať v hre
            </button>
          </div>
          <div className="album-grid">
            {countries.map((country) => {
              const discovered = discoveredSet.has(country.code);

              return (
                <article className={`sticker-card ${discovered ? 'found' : ''}`} key={country.code}>
                  <img alt="" src={country.flagUrl} />
                  <strong>{discovered ? country.name : 'Tajná krajina'}</strong>
                  <small>{discovered ? regionNames[country.region] : 'Odomkni v kvíze'}</small>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {screen === 'parent' && (
        <section className="parent-layout">
          <div className="parent-header">
            <div>
              <span className="eyebrow">
                <BarChart3 size={18} />
                Rodičovský prehľad
              </span>
              <h2>Čo sa dieťa učí</h2>
            </div>
            <button className="next-button" type="button" onClick={() => startLevel(levels[1])}>
              Spustiť Európu
            </button>
          </div>

          <div className="parent-stats">
            <article>
              <strong>{progress.sessionsPlayed}</strong>
              <span>odohrané výpravy</span>
            </article>
            <article>
              <strong>{totalAccuracy}%</strong>
              <span>celková úspešnosť</span>
            </article>
            <article>
              <strong>{weakCountryCodes.length}</strong>
              <span>krajiny na opakovanie</span>
            </article>
            <article>
              <strong>{achievements.filter((achievement) => achievement.unlocked).length}</strong>
              <span>odomknuté odznaky</span>
            </article>
          </div>

          <div className="parent-columns">
            <section className="insight-panel">
              <h3>Kontinenty</h3>
              <div className="accuracy-list">
                {continentAccuracy.map((item) => (
                  <div className="accuracy-row" key={item.label}>
                    <span>{item.label}</span>
                    <div className="accuracy-bar" aria-label={`${item.label}: ${item.accuracy}%`}>
                      <span style={{ width: `${item.accuracy}%` }} />
                    </div>
                    <strong>{item.answeredCount ? `${item.accuracy}%` : 'nové'}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="insight-panel">
              <h3>Na čo sa vrátiť</h3>
              {weakestCountries.length ? (
                <div className="weak-list">
                  {weakestCountries.map((country) => (
                    <article key={country.code}>
                      <img alt="" src={country.flagUrl} />
                      <div>
                        <strong>{country.name}</strong>
                        <span>
                          Chyby {progress.countryMistakes[country.code] || 0} · správne{' '}
                          {progress.countryCorrect[country.code] || 0}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-insight">Zatiaľ nie je dosť odpovedí. Po pár hrách tu ukážeme slabšie krajiny.</p>
              )}
            </section>

            <section className="insight-panel achievement-panel">
              <h3>Odznaky</h3>
              <div className="achievement-list">
                {achievements.map((achievement) => (
                  <article className={achievement.unlocked ? 'unlocked' : ''} key={achievement.title}>
                    <Award size={20} />
                    <div>
                      <strong>{achievement.title}</strong>
                      <span>{achievement.detail}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}

      {screen === 'quiz' && currentQuestion && (
        <section className="quiz-layout">
          <div className="quiz-header">
            <button className="plain-button" type="button" onClick={() => setScreen('levels')}>
              Mapa
            </button>
            <div className="progress-line" aria-label="Postup v leveli">
              <span style={{ width: `${((questionIndex + 1) / activeLevel.questionCount) * 100}%` }} />
            </div>
            <strong>
              {questionIndex + 1}/{activeLevel.questionCount}
            </strong>
          </div>

          <div className="quiz-card">
            <div className="flag-stage">
              <div className="question-copy">
                <span className="continent">{regionNames[currentQuestion.answer.region]}</span>
                <h2>{getQuestionTitle(currentQuestion)}</h2>
                <p className="quiz-hint">
                  {modeLabels[currentQuestion.mode].title} · {difficultyLabels[difficulty].title}
                </p>
                <p className="smart-hint">
                  <Eye size={18} />
                  {currentQuestion.hint}
                </p>
              </div>
              {currentQuestion.mode === 'paint' ? (
                <div className="paint-stage" aria-label={`Vyskladaj farby vlajky: ${currentQuestion.answer.name}`}>
                  <span>Flag Painter</span>
                  <strong>{currentQuestion.answer.name}</strong>
                  <div className={`paint-canvas ${currentPalette?.orientation || 'horizontal'}`}>
                    {currentPalette?.colors.map((_, index) => (
                      <button
                        aria-label={`Pozícia ${index + 1}`}
                        className={paintColors[index] ? 'filled' : ''}
                        key={`${currentQuestion.answer.code}-slot-${index}`}
                        style={{ background: paintColors[index] || undefined }}
                        type="button"
                        onClick={undoPaintColor}
                      >
                        {!paintColors[index] && index + 1}
                      </button>
                    ))}
                  </div>
                  <small>Ťukaj farby zhora nadol alebo zľava doprava.</small>
                </div>
              ) : currentQuestion.mode === 'country' ? (
                <div className="country-stage" aria-label={`Vyber vlajku: ${currentQuestion.answer.name}`}>
                  <span>Hľadaná krajina</span>
                  <strong>{currentQuestion.answer.name}</strong>
                  <small>{regionNames[currentQuestion.answer.region]}</small>
                </div>
              ) : currentQuestion.mode === 'map' ? (
                <div className="map-question-stage" aria-label={`Nájdi na mape: ${currentQuestion.answer.name}`}>
                  <span>Hľadaná krajina</span>
                  <strong>{currentQuestion.answer.name}</strong>
                  <small>Ťukni na správny bod na mape.</small>
                </div>
              ) : (
                <div className="flag-frame">
                  <img
                    alt="Hádaná vlajka"
                    className="flag-image"
                    draggable="false"
                    src={currentQuestion.answer.flagUrlLarge}
                  />
                </div>
              )}
            </div>

            {currentQuestion.mode === 'paint' ? (
              <div className="painter-workbench" aria-label="Farby vlajky">
                <div className="color-bank">
                  {paintChoices.map((color) => (
                    <button
                      aria-label={`Vybrať farbu ${color}`}
                      disabled={answered || paintComplete}
                      key={color}
                      onClick={() => choosePaintColor(color)}
                      style={{ background: color }}
                      type="button"
                    />
                  ))}
                </div>
                <div className="paint-actions">
                  <button className="plain-button" disabled={answered || paintColors.length === 0} type="button" onClick={undoPaintColor}>
                    <Undo2 size={18} />
                    Späť
                  </button>
                  <button className="next-button" disabled={answered || !paintComplete} type="button" onClick={submitPainting}>
                    Skontrolovať
                  </button>
                </div>
              </div>
            ) : currentQuestion.mode === 'map' ? (
              <div className="find-map" aria-label="Možnosti na mape">
                <span className="map-land land-west" />
                <span className="map-land land-north" />
                <span className="map-land land-east" />
                <span className="map-land land-south" />
                {mapChoices.map((point) => {
                  const country = countries.find((item) => item.code === point.code);
                  const isCorrect = point.code === currentQuestion.answer.code;
                  const isSelected = point.code === selectedCode;
                  const statusClass = answered && isCorrect ? 'correct' : answered && isSelected ? 'wrong' : '';

                  return (
                    <button
                      aria-label={country?.name || point.code}
                      className={`find-map-point ${statusClass}`}
                      disabled={answered}
                      key={point.code}
                      onClick={() => handleAnswer(point.code)}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      type="button"
                    >
                      {point.code}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className={`answers ${currentQuestion.mode === 'country' ? 'flag-answers' : ''}`} aria-label="Možnosti odpovede">
                {currentQuestion.options.map((option) => {
                  const isCorrect = option.code === currentQuestion.answer.code;
                  const isSelected = option.code === selectedCode;
                  const statusClass = answered && isCorrect ? 'correct' : answered && isSelected ? 'wrong' : '';
                  return (
                    <button
                      className={`answer-button ${statusClass}`}
                      disabled={answered}
                      key={option.code}
                      onClick={() => handleAnswer(option.code)}
                      type="button"
                    >
                      <span className="answer-letter" aria-hidden="true">
                        {getOptionLabel(currentQuestion.options.findIndex((item) => item.code === option.code))}
                      </span>
                      {currentQuestion.mode === 'country' ? (
                        <span className="flag-answer-content">
                          <img alt="" src={option.flagUrl} />
                          <span>{option.name}</span>
                        </span>
                      ) : (
                        <span>{option.name}</span>
                      )}
                      {answered && isCorrect && <CheckCircle2 size={24} />}
                      {answered && isSelected && !isCorrect && <XCircle size={24} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {answered &&
            (() => {
              const correct = selectedCode === currentQuestion.answer.code;
              const newDiscovery = !discoveredSet.has(currentQuestion.answer.code);

              return (
                <div className={`feedback ${correct ? 'won-sticker' : ''}`}>
                  {correct ? (
                    <img className="feedback-flag" alt="" src={currentQuestion.answer.flagUrl} />
                  ) : (
                    <div className="try-again-mark" aria-hidden="true">
                      ?
                    </div>
                  )}
                  <div>
                    <strong>{getFeedbackTitle(currentQuestion, correct, newDiscovery)}</strong>
                    <span>{getFeedbackDetail(currentQuestion, correct)}</span>
                  </div>
                  <button className="next-button" type="button" onClick={nextQuestion}>
                    {questionIndex + 1 >= questions.length ? 'Vyhodnotiť' : 'Ďalšia vlajka'}
                  </button>
                </div>
              );
            })()}
        </section>
      )}

      {screen === 'result' && (
        <section className="result-layout">
          <div className="reward-burst" aria-hidden="true">
            <span>⭐</span>
            <span>🎈</span>
            <span>🏆</span>
          </div>
          <Trophy size={58} />
          <h2>{passed ? 'Level splnený' : 'Ešte jedna výprava'}</h2>
          <p>
            Skóre {score}/{activeLevel.questionCount}.{' '}
            {newSessionDiscoveries.length
              ? `Do albumu pribudlo ${newSessionDiscoveries.length} nových vlajok.`
              : 'Precvičili sme vlajky, ktoré už sú v albume.'}
          </p>
          <div className="reward-strip">
            {(newSessionDiscoveries.length ? newSessionDiscoveries : sessionDiscovered).slice(0, 6).map((code) => {
              const country = countries.find((item) => item.code === code);
              return country ? (
                <article className="mini-flag-card" key={code}>
                  <img alt="" src={country.flagUrl} />
                  <strong>{country.name}</strong>
                </article>
              ) : null;
            })}
          </div>
          <p className="best-result">
            Najlepší výsledok v tomto leveli je {Math.max(activeBest, score)}/{activeLevel.questionCount}.
          </p>
          <div className="achievement-strip result-achievements" aria-label="Odznaky po hre">
            {achievements.map((achievement) => (
              <span className={achievement.unlocked ? 'unlocked' : ''} key={achievement.title}>
                <Award size={15} />
                {achievement.title}
              </span>
            ))}
          </div>
          <div className="result-actions">
            <button className="next-button" type="button" onClick={() => startLevel(activeLevel)}>
              Hrať znovu
            </button>
            {passed && activeLevel.id < maxLevelId && (
              <button className="next-button secondary" type="button" onClick={() => startLevel(levels[activeLevel.id])}>
                Ďalší level
              </button>
            )}
            <button className="plain-button" type="button" onClick={() => setScreen('album')}>
              Album
            </button>
          </div>
        </section>
      )}

      <footer className="app-footer">
        <button className={`sound-toggle ${soundOn ? 'enabled' : ''}`} type="button" onClick={toggleSound}>
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          {soundOn ? 'Zvuk zapnutý' : 'Zvuk vypnutý'}
        </button>
        {voices.length > 0 && (
          <label className="voice-select">
            <span>Hlas</span>
            <select value={selectedVoice?.voiceURI || selectedVoiceURI} onChange={(event) => changeVoice(event.target.value)}>
              {voices
                .filter((voice) => scoreVoice(voice) > 0)
                .concat(voices.filter((voice) => scoreVoice(voice) === 0).slice(0, 12))
                .map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </label>
        )}
        <span>Verzia {packageInfo.version}</span>
      </footer>
    </main>
  );
};

export default App;
