import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const DetectiveMathGame = () => {
  const [gameState, setGameState] = useState('intro');
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [cluesFound, setCluesFound] = useState({});
  const [attemptsPerSuspect, setAttemptsPerSuspect] = useState({});

  const suspects = [
    { id: 1, name: 'Marina Schneider', role: 'Museumsdirektorin', icon: '👩‍💼' },
    { id: 2, name: 'Thomas Weber', role: 'Sicherheitschef', icon: '👨‍✈️' },
    { id: 3, name: 'Lisa Hoffmann', role: 'Kunstrestauratorin', icon: '👩‍🎨' },
    { id: 4, name: 'Karl Becker', role: 'Nachtwächter', icon: '👨‍🦳' },
    { id: 5, name: 'Michael Klein', role: 'Hausmeister', icon: '👨‍🔧' },
    { id: 6, name: 'David Fischer', role: 'IT-Techniker', icon: '👨‍💻' },
    { id: 7, name: 'Sophie Müller', role: 'Kuratorin', icon: '👩‍🏫' },
    { id: 8, name: 'Anna Schmidt', role: 'Reinigungskraft', icon: '👩‍🔧' }
  ];

  const statements = {
    1: [
      "Ich habe das Museum um 22:45 Uhr verlassen, nachdem die Besprechung beendet war.",
      "Thomas Weber war zu diesem Zeitpunkt noch im Sicherheitsbüro.",
      "Ich habe Lisa Hoffmann kurz vor meinem Aufbruch im Restaurierungsraum gesehen.",
      "Ich bin sicher, dass der Alarm erst nach meiner Abfahrt ausgelöst wurde."
    ],
    2: [
      "Ich war die ganze Zeit im Sicherheitsbüro und habe die Kameras überwacht.",
      "Um 23:10 Uhr hat mich David Fischer angerufen und gesagt, er rufe aus dem Serverraum an, weil es ein Problem mit dem Netzwerk gäbe.",
      "Das Gespräch dauerte etwa fünf Minuten.",
      "Kaum hatte ich aufgelegt, ging der Alarm los."
    ],
    3: [
      "Ich habe bis etwa 23:00 Uhr im Restaurierungsraum gearbeitet.",
      "Sophie Müller kam kurz vorbei, um über die Ausstellung zu sprechen.",
      "Danach bin ich ins Café gegangen, wo ich Anna Schmidt getroffen habe.",
      "Ich habe das Museum erst nach dem Alarm verlassen."
    ],
    4: [
      "Ich habe meine Runde um 22:30 Uhr begonnen und war um 22:50 Uhr im Ostflügel, um eine defekte Tür zu flicken.",
      "Kurz danach kam Michael Klein dazu, wir haben uns unterhalten und sind dann beide weitergegangen.",
      "Um 23:10 Uhr bin ich wieder in den Ostflügel zurückgekehrt, um die Arbeit an der Tür fortzusetzen.",
      "Fünf Minuten später ging der Alarm los, und ich bin sofort zur Sicherheitszentrale gerannt."
    ],
    5: [
      "Ich bin um 22:45 Uhr kurz im Serverraum vorbeigegangen, um ein Werkzeug zu holen.",
      "Dort habe ich David Fischer gesehen, wie er an den Geräten gearbeitet hat.",
      "Danach bin ich direkt in den Ostflügel gegangen, das hat etwa zehn Minuten gedauert.",
      "Dort habe ich Karl Becker gesehen, wie er die Türen flickte. Wir haben kurz gesprochen und sind dann beide weitergegangen."
    ],
    6: [
      "Ich habe Thomas Weber um 23:10 Uhr angerufen, um ihn über die Störung zu informieren.",
      "Vorher habe ich Michael Klein im Serverraum gesehen, wie er kurz etwas überprüfte.",
      "Später habe ich Karl Becker im Ostflügel gesehen, wie er die Türen flickte.",
      "Ich habe den Alarm gehört, als ich gerade auf dem Weg nach draußen war."
    ],
    7: [
      "Ich war von 22:00 bis 23:00 Uhr im Ostflügel, um die neue Ausstellung zu prüfen.",
      "Ich habe Lisa Hoffmann tatsächlich kurz gesehen, bevor ich zurück ins Büro ging.",
      "Der Ostflügel grenzt direkt an den Ausstellungsraum mit dem Gemälde – ich bin froh, dass ich dort nichts Verdächtiges bemerkt habe.",
      "Ich habe den Alarm gehört, als ich gerade meine Unterlagen sortiert habe."
    ],
    8: [
      "Ich habe gegen 22:50 Uhr im Café eine Pause gemacht.",
      "Lisa Hoffmann kam kurz danach dazu und wir haben uns unterhalten.",
      "Ich bin danach direkt in den Westflügel gegangen, um dort zu reinigen.",
      "Ich habe den Alarm gehört, als ich gerade den Boden gewischt habe."
    ]
  };

  const generateQuestion = (suspectId, attemptNumber) => {
    const types = ['slope', 'equation', 'intersection', 'point'];
    const typeIndex = (suspectId + attemptNumber) % types.length;
    const type = types[typeIndex];

    switch(type) {
      case 'slope':
        const x1 = Math.floor(Math.random() * 10) - 5;
        const y1 = Math.floor(Math.random() * 10) - 5;
        const x2 = x1 + Math.floor(Math.random() * 5) + 1;
        const y2 = y1 + Math.floor(Math.random() * 10) - 5;
        return {
          type: 'slope',
          question: `Berechne die Steigung m der Geraden durch die Punkte P(${x1}|${y1}) und Q(${x2}|${y2}).`,
          answer: ((y2 - y1) / (x2 - x1)).toFixed(2),
          hint: 'Steigung m = (y₂ - y₁) / (x₂ - x₁)'
        };
      
      case 'equation':
        const m = Math.floor(Math.random() * 6) - 3;
        const b = Math.floor(Math.random() * 10) - 5;
        const xPoint = Math.floor(Math.random() * 5);
        const yPoint = m * xPoint + b;
        return {
          type: 'equation',
          question: `Eine Gerade hat die Steigung m = ${m} und verläuft durch den Punkt P(${xPoint}|${yPoint}). Wie lautet der y-Achsenabschnitt b?`,
          answer: b.toString(),
          hint: 'Nutze y = mx + b und setze die Werte ein'
        };
      
      case 'intersection':
        const m1 = Math.floor(Math.random() * 4) + 1;
        const b1 = Math.floor(Math.random() * 6) - 3;
        const m2 = -Math.floor(Math.random() * 4) - 1;
        const b2 = Math.floor(Math.random() * 6) + 3;
        const xIntersect = ((b2 - b1) / (m1 - m2)).toFixed(2);
        return {
          type: 'intersection',
          question: `Berechne die x-Koordinate des Schnittpunkts der Geraden f(x) = ${m1}x + ${b1} und g(x) = ${m2}x + ${b2}.`,
          answer: xIntersect,
          hint: 'Setze f(x) = g(x) und löse nach x auf'
        };
      
      case 'point':
        const mFunc = Math.floor(Math.random() * 5) - 2;
        const bFunc = Math.floor(Math.random() * 8) - 4;
        const xTest = Math.floor(Math.random() * 6) - 3;
        const yCalc = mFunc * xTest + bFunc;
        return {
          type: 'point',
          question: `Berechne den y-Wert der Funktion f(x) = ${mFunc}x + ${bFunc} an der Stelle x = ${xTest}.`,
          answer: yCalc.toString(),
          hint: 'Setze x in die Funktion ein: f(x) = mx + b'
        };
    }
  };

  const initGame = () => {
    setCluesFound({});
    setAttemptsPerSuspect({});
    setGameState('playing');
    setSelectedSuspect(null);
    setFeedback(null);
  };

  const selectSuspect = (suspect) => {
    const collectedStatements = cluesFound[suspect.id] || [];
    if (collectedStatements.length >= 4) {
      return;
    }
    
    setSelectedSuspect(suspect);
    const attempts = attemptsPerSuspect[suspect.id] || 0;
    const question = generateQuestion(suspect.id, attempts);
    setCurrentQuestion(question);
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const correctAnswer = parseFloat(currentQuestion.answer);
    const userAns = parseFloat(userAnswer);
    
    if (Math.abs(correctAnswer - userAns) < 0.01) {
      setFeedback({ type: 'success', message: 'Richtig! Die Person macht eine Aussage...' });
      
      setTimeout(() => {
        const currentStatements = cluesFound[selectedSuspect.id] || [];
        const nextStatementIndex = currentStatements.length;
        const nextStatement = statements[selectedSuspect.id][nextStatementIndex];
        
        setCluesFound(prev => ({
          ...prev,
          [selectedSuspect.id]: [...(prev[selectedSuspect.id] || []), nextStatement]
        }));
        
        setAttemptsPerSuspect(prev => ({
          ...prev,
          [selectedSuspect.id]: (prev[selectedSuspect.id] || 0) + 1
        }));
        
        setSelectedSuspect(null);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Falsch! Die richtige Antwort wäre ${currentQuestion.answer} gewesen. Die Person schweigt.` 
      });
      
      setTimeout(() => {
        setSelectedSuspect(null);
        setFeedback(null);
      }, 3000);
    }
  };

  const makeAccusation = (suspect) => {
    if (suspect.id === 6) {
      setGameState('won');
    } else {
      setGameState('lost');
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
            <h1 className="text-4xl font-bold text-center mb-6 text-amber-400">🕵️ Der Kunstraub im Stadtmuseum</h1>
            <div className="space-y-4 text-lg leading-relaxed">
              <p className="text-gray-300">
                In der Nacht vom 9. auf den 10. Dezember wurde das wertvolle Gemälde „Die goldene Stadt" aus dem Stadtmuseum gestohlen. Der Alarm wurde um 23:15 Uhr ausgelöst, doch als die Polizei eintraf, war das Gemälde bereits verschwunden. Acht Personen, die sich zur Tatzeit im Museum befanden, werden nun befragt.
              </p>
              <div className="bg-gray-700 p-4 rounded border-l-4 border-amber-500 my-6">
                <h3 className="font-bold text-amber-400 mb-2">Deine Aufgabe:</h3>
                <p className="text-gray-300 mb-2">
                  Löse mathematische Aufgaben, um an die vollständigen Aussagen der acht Personen zu kommen. Jede Person hat vier Sätze zu Protokoll gegeben.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li>• Befrage die Verdächtigen durch das Lösen mathematischer Aufgaben</li>
                  <li>• Sammle alle vier Aussagen jeder Person</li>
                  <li>• Finde Widersprüche und Alibis</li>
                  <li>• Identifiziere den Täter und klage ihn an</li>
                </ul>
              </div>
              <p className="text-gray-400 italic text-center">
                Tipp: Notiere dir die Aussagen und die Zeitangaben, um die Hinweise zu kombinieren!
              </p>
            </div>
            <button 
              onClick={initGame}
              className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
            >
              Fall übernehmen
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-900 rounded-lg shadow-2xl p-8 border-2 border-green-500">
            <div className="text-center">
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4 text-green-400">Fall gelöst!</h1>
              <p className="text-xl mb-6">
                Glückwunsch! Du hast David Fischer erfolgreich überführt!
              </p>
              <div className="bg-gray-800 p-6 rounded mb-6">
                <p className="text-gray-300 italic text-lg leading-relaxed mb-4">
                  „Ja, ich habe das Gemälde genommen. Ich wollte es verkaufen – ich kenne jemanden, der dafür Millionen zahlen würde. Das Telefonat war meine Ablenkung: Ich habe extra kurz vor dem Diebstahl angerufen, damit alle glauben, ich sei im Serverraum. Danach bin ich direkt in den Ostflügel gegangen und habe zugeschlagen."
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded mb-6 text-left">
                <h3 className="text-xl font-bold text-amber-400 mb-3">🔍 Die Logik dahinter:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Thomas Weber bestätigt, dass David um 23:10 Uhr aus dem Serverraum angerufen hat und das Gespräch fünf Minuten dauerte.</li>
                  <li>• David behauptet, er habe Karl Becker im Ostflügel gesehen, wie er die Türen flickte.</li>
                  <li>• Aber Karl Becker war um 23:10 Uhr im Ostflügel – genau während des Telefonats.</li>
                  <li>• David hätte Karl nur sehen können, wenn er selbst im Ostflügel war – nicht im Serverraum, wie er behauptet.</li>
                  <li>• Damit ist klar: David lügt und ist der Täter.</li>
                </ul>
              </div>
              
              <p className="text-green-400 font-bold text-xl">
                Fall abgeschlossen! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900 rounded-lg shadow-2xl p-8 border-2 border-red-500">
            <div className="text-center">
              <XCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4 text-red-400">Falsche Anklage!</h1>
              <p className="text-xl mb-6">
                Leider lag deine Vermutung falsch. Diese Person ist nicht der Täter.
              </p>
              <div className="bg-gray-800 p-4 rounded mb-6">
                <p className="text-gray-300">
                  Analysiere die Aussagen noch einmal genau. Achte besonders auf die Zeitangaben und prüfe, wer zur Tatzeit (23:15 Uhr) wirklich wo war. Manchmal lügt jemand über seinen Aufenthaltsort...
                </p>
              </div>
              <button 
                onClick={initGame}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                Neuen Versuch starten
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSuspect) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{selectedSuspect.icon}</div>
              <h2 className="text-3xl font-bold text-amber-400">{selectedSuspect.name}</h2>
              <p className="text-gray-400">{selectedSuspect.role}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-amber-400">Mathematische Aufgabe:</h3>
              <p className="text-lg mb-4">{currentQuestion.question}</p>
              <p className="text-sm text-gray-400 italic">Hinweis: {currentQuestion.hint}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-gray-300">Deine Antwort:</label>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg focus:outline-none focus:border-amber-500"
                placeholder="Gib deine Antwort ein..."
                autoFocus
              />
            </div>

            {feedback && (
              <div className={`p-4 rounded-lg mb-6 ${feedback.type === 'success' ? 'bg-green-900 border border-green-500' : 'bg-red-900 border border-red-500'}`}>
                <p className="text-white">{feedback.message}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={checkAnswer}
                disabled={!userAnswer || feedback}
                className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Antwort prüfen
              </button>
              <button
                onClick={() => setSelectedSuspect(null)}
                disabled={feedback}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Zurück
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-400">🕵️ Der Kunstraub - Ermittlungen</h1>
        
        <h2 className="text-2xl font-bold mb-4 text-blue-400">👥 Verdächtige befragen</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {suspects.map(suspect => {
            const collectedStatements = cluesFound[suspect.id] || [];
            const isComplete = collectedStatements.length >= 4;
            
            return (
              <div 
                key={suspect.id} 
                className={`bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-700 ${isComplete ? 'opacity-60' : ''}`}
              >
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{suspect.icon}</div>
                  <h3 className="text-lg font-bold text-amber-400">{suspect.name}</h3>
                  <p className="text-sm text-gray-400">{suspect.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {collectedStatements.length}/4 Aussagen
                  </p>
                </div>

                {collectedStatements.length > 0 && (
                  <div className="bg-gray-700 rounded p-2 mb-3 space-y-1 max-h-40 overflow-y-auto">
                    <p className="text-xs font-bold text-amber-400">Aussagen:</p>
                    {collectedStatements.map((statement, idx) => (
                      <p key={idx} className="text-xs text-gray-300">
                        {idx + 1}. {statement}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => selectSuspect(suspect)}
                  disabled={isComplete}
                  className={`w-full ${isComplete ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-3 rounded transition-colors`}
                >
                  {isComplete ? 'Vollständig befragt' : 'Befragen'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-red-900 border-2 border-red-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-red-400 text-center">⚖️ Anklage erheben</h2>
          <p className="text-gray-300 text-center mb-4">Wähle den Verdächtigen, den du für schuldig hältst. Dies beendet das Spiel!</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {suspects.map(suspect => (
              <button
                key={suspect.id}
                onClick={() => makeAccusation(suspect)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-2 rounded-lg transition-colors flex flex-col items-center gap-1"
              >
                <span className="text-3xl">{suspect.icon}</span>
                <span className="text-xs text-center">{suspect.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-amber-500">
          <h3 className="text-xl font-bold mb-3 text-amber-400 flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            Ermittlungshinweise
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Befrage alle Verdächtigen und sammle ihre vier Aussagen</li>
            <li>• Richtige Antworten liefern die nächste Aussage</li>
            <li>• Bei falschen Antworten kannst du es später erneut versuchen</li>
            <li>• Achte auf Zeitangaben und Alibis</li>
            <li>• Finde heraus, wer zur Tatzeit (23:15 Uhr) wo war</li>
            <li>• Klage den Täter an, wenn du dir sicher bist!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetectiveMathGame;
