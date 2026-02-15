import React, { useState, useEffect } from 'react';

function shuffleArray(array) {
	// Fisher-Yates shuffle
	const arr = array.slice();
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

export default function RandomWord() {
	const [words, setWords] = useState([]); // original list
	const [shuffled, setShuffled] = useState([]); // shuffled list
	const [index, setIndex] = useState(0); // current index in shuffled
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
				const shuffledList = shuffleArray(wordList);
				setShuffled(shuffledList);
				setIndex(0);
				setWord(shuffledList[0] || '');
				setCountdown(5);
			});
	}, []);

	// Timer for countdown and word change
	useEffect(() => {
		if (shuffled.length === 0 || paused) return;
		setCountdown(5);
		const interval = setInterval(() => {
			setCountdown(prev => {
				if (prev === 1) {
					let nextIndex = index + 1;
					let nextShuffled = shuffled;
					if (nextIndex >= shuffled.length) {
						// Reshuffle and start again
						nextShuffled = shuffleArray(words);
						nextIndex = 0;
					}
					setShuffled(nextShuffled);
					setIndex(nextIndex);
					setWord(nextShuffled[nextIndex] || '');
					return 5;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [index, shuffled, words, paused]);

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
			position: 'relative',
		}}>
			<div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>{word}</div>
			{words.length > 0 && (
				<div style={{
					position: 'absolute',
					top: '0.5rem',
					right: '1rem',
					fontSize: '0.85rem',
					color: '#888',
					background: 'rgba(255,255,255,0.7)',
					padding: '0.2rem 0.6rem',
					borderRadius: '0 0 0 1rem',
					zIndex: 10,
					boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
				}}>
					{shuffled.length === 0 ? 0 : index + 1}/{shuffled.length}
				</div>
			)}
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
