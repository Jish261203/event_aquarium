"use client";
import React, { useState, useEffect } from "react";

interface TypewriterProps {
	words: string[];
}

const Typewriter: React.FC<TypewriterProps> = ({ words }) => {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [currentWord, setCurrentWord] = useState("");
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			if (displayedText === words[currentWordIndex]) {
				setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
				setDisplayedText("");
			} else {
				// Otherwise, display the next letter of the current word
				setDisplayedText(
					(prevText) => prevText + words[currentWordIndex][prevText.length]
				);
			}
		}, 380);

		return () => clearInterval(interval);
	}, [currentWordIndex, displayedText, words]);

	useEffect(() => {
		setDisplayedText("");
	}, [currentWord]);

	return <span className="text-gray-800">{displayedText}</span>;
};

export default Typewriter;
