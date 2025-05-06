import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const parseQuestion = (raw) => {
    let pergunta = '';
    let opcoes = [];
    let resposta = '';
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    
    for (let line of lines) {
      if (line.toLowerCase().startsWith('pergunta:')) {
        pergunta = line.replace(/pergunta:/i, '').trim();
      } else if (/^[A-D]\)/i.test(line)) {
        opcoes.push(line.replace(/^[A-D]\)\s*/i, ''));
      } else if (line.toLowerCase().startsWith('resposta correta:')) {
        resposta = line.replace(/resposta correta:/i, '').trim();
      }
    }
    
    let idx = -1;
    let letra = resposta.match(/[A-Da-d]/);
    if (letra) {
      idx = letra[0].toUpperCase().charCodeAt(0) - 65;
    } else {
      for (let i = 0; i < opcoes.length; i++) {
        if (opcoes[i].toLowerCase().trim() === resposta.toLowerCase().trim()) {
          idx = i;
          break;
        }
      }
      if (idx === -1) {
        idx = opcoes.findIndex(opt => opt.toLowerCase().includes(resposta.toLowerCase()));
      }
    }
    
    return {
      pergunta,
      opcoes,
      correta: idx
    };
  };

  const loadNewQuestion = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    
    try {
      const prompt = `Gere uma questão de múltipla escolha para o ${currentLevel}º ano do ensino fundamental brasileiro, com 4 alternativas e apenas uma correta. Responda neste formato: Pergunta: ... A) ... B) ... C) ... D) ... Resposta correta: ...`;
      
      const response = await fetch('/api/pergunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Resposta inválida da IA.');
      }
      
      const raw = data.choices[0].message.content;
      const parsed = parseQuestion(raw);
      
      if (!parsed.pergunta || parsed.opcoes.length !== 4 || parsed.correta === -1) {
        throw new Error('Pergunta inválida gerada pela IA.');
      }
      
      setQuestion(parsed.pergunta);
      setOptions(parsed.opcoes);
      setCorrectAnswer(parsed.correta);
    } catch (error) {
      console.error('Erro ao carregar pergunta:', error);
      setQuestion('Erro ao carregar pergunta. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (idx) => {
    if (isLoading) return;
    
    setSelectedOption(idx);
    
    setTimeout(() => {
      if (idx === correctAnswer) {
        if (currentLevel < 10) {
          setCurrentLevel(prev => prev + 1);
        }
      } else {
        if (currentLevel > 1) {
          setCurrentLevel(prev => prev - 1);
        }
      }
      
      loadNewQuestion();
    }, 1800);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Quiz Educacional</title>
        <meta name="description" content="Quiz educacional para estudantes" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Language" content="pt-BR" />
        <html lang="pt-BR" />
      </Head>

      <header className={styles.header}>
        <h2>Nível <span>{currentLevel}</span></h2>
      </header>

      <main className={styles.main}>
        <div className={styles.questionContainer}>
          <p className={styles.questionText}>
            {isLoading ? 'Carregando pergunta...' : question}
          </p>
          
          <div className={styles.optionsContainer}>
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isLoading || selectedOption !== null}
                className={`${styles.optionBtn} ${
                  selectedOption === idx 
                    ? idx === correctAnswer 
                      ? styles.correct 
                      : styles.incorrect
                    : selectedOption !== null && idx === correctAnswer 
                      ? styles.correct 
                      : ''
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </main>

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.schoolLoading}>
            <div className={styles.pencilBody}>
              <div className={styles.pencilEraser}></div>
              <div className={styles.pencilWood}></div>
              <div className={styles.pencilLead}></div>
            </div>
            <span className={styles.loadingText}>Buscando pergunta...</span>
          </div>
        </div>
      )}
    </div>
  );
}
