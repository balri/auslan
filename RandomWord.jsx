import React, { useState, useEffect } from 'react';

function getRandomWord(words) {
	if (!words || words.length === 0) return '';
	return words[Math.floor(Math.random() * words.length)];
}


export default function RandomWord() {
	const [words, setWords] = useState([]);
	const [word, setWord] = useState('Loading...');
	const [countdown, setCountdown] = useState(5);
	const [paused, setPaused] = useState(false);

	// Load words on mount
	useEffect(() => {
		fetch('/words.txt')
			.then(res => res.text())
			.then(text => {
				const wordList = text.split('\n').map(w => w.trim()).filter(Boolean);
				setWords(wordList);
				setWord(getRandomWord(wordList));
				setCountdown(5);
			});
	}, []);

	// Timer for countdown and word change
	useEffect(() => {
		if (words.length === 0 || paused) return;
		setCountdown(5);
		const interval = setInterval(() => {
			setCountdown(prev => {
				if (prev === 1) {
					setWord(getRandomWord(words));
					return 5;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [word, words, paused]);




	const handlePause = () => {
		setPaused(p => !p);
	};

	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			background: '#f0f0f0',
			fontFamily: 'Arial, sans-serif',
		}}>
			<div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>{word}</div>
			{word && word !== 'Loading...' && (
				<a
					href={`https://auslan.org.au/dictionary/search/?query=${encodeURIComponent(word.toLowerCase())}&category=all`}
					target="_blank"
					rel="noopener noreferrer"
					style={{ fontSize: '1rem', marginBottom: '1rem', color: '#0077cc', textDecoration: 'underline' }}
				>
					View in Signbank
				</a>
			)}
			<div style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#666' }}>Next word in: {countdown}s</div>
			<div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
				<button
					onClick={handlePause}
					style={{
						fontSize: '2rem',
						padding: '1.5rem 3rem',
						border: 'none',
						borderRadius: '1rem',
						background: paused ? '#aaa' : '#ff9800',
						color: 'white',
						cursor: 'pointer',
						transition: 'background 0.2s',
					}}
					onMouseOver={e => (e.currentTarget.style.background = paused ? '#888' : '#e65100')}
					onMouseOut={e => (e.currentTarget.style.background = paused ? '#aaa' : '#ff9800')}
					disabled={words.length === 0}
				>
					{paused ? 'Resume' : 'Pause'}
				</button>
			</div>
		</div>
	);
}
