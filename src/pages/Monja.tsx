import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import '../css/Monja.css';
import RadioButton from '../components/radio';
import Confetti from '../components/confetti';

const Monja: React.FC = () => {
  const location = useLocation();
  const { players = [], images = [], countPerCard = 3 } = location.state as { players?: { id: number, name: string }[], images?: string[], countPerCard?: number };

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageCounts, setImageCounts] = useState<{ [key: string]: number }>({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [drawCardCount, setDrawCardCount] = useState(0);
  const [playerScores, setPlayerScores] = useState<{ [key: string]: number }>({});
  const [playerCards, setPlayerCards] = useState<{ [key: string]: string[] }>({});
  const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0].name);
  const [isSoundPlayed, setIsSoundPlayed] = useState(false);

  // レンダリングの後にuseEffectの中身が実行される
  // 第二引数でuseEffectの中身を実行するタイミングを指定できる
  // 第二引数はからの配列だとリロード時の1回のみ、変数を入れると変数の値が変わったタイミングでuseEffectの中身が実行される
  useEffect(() => {
    setImageCounts(images.reduce((acc: { [key: string]: number }, image: string) => {
      acc[image] = 0;
      return acc;
    }, {}));

    const initialScores = players.reduce((acc: { [key: string]: number }, player) => {
      acc[player.name] = 0;
      return acc;
    }, {});

    setPlayerScores(initialScores);

    const initialPlayerCards = players.reduce((acc: { [key: string]: string[] }, player) => {
      acc[player.name] = [];
      return acc;
    }, {});

    setPlayerCards(initialPlayerCards);
  }, [players, images]);

  useEffect(() => {
    if (drawCardCount > images.length * countPerCard && !isSoundPlayed) {
      const audio = new Audio('/sounds/celebration.mp3');
      audio.play();
      setIsSoundPlayed(true);
    }
  }, [drawCardCount, images.length, isSoundPlayed]);


  const drawCard = () => {
    setDrawCardCount(drawCardCount + 1);
    const availableImages = images.filter((image) => imageCounts[image] < countPerCard);

    if (availableImages.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];

    // 選択されたカードにアニメーションを適用するための一時的な状態
    setCurrentImage(null);

    setImageCounts({
      ...imageCounts,
      [selectedImage]: imageCounts[selectedImage] + 1,
    });

    setTimeout(() => {
      setCurrentImage(selectedImage);
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }, 500); // 少しの遅延を追加してアニメーションをトリガー
  };

  const handlePlayerSelection = (playerName: string) => {
    if (!currentImage) return;

    setPlayerCards(prev => ({
      ...prev,
      [playerName]: [...prev[playerName], currentImage],
    }));
    setPlayerScores(prev => ({
      ...prev,
      [playerName]: prev[playerName] + 1,
    }));
    setCurrentImage(null);
    setSelectedPlayer(players[0].name);
  };

  const gameFinished = drawCardCount > images.length * countPerCard;

  return (
    <div className="monja-game">
      <h1>MuccyaMonja</h1>
      {!gameFinished && (
        <>
          <p>Current Player: {players[currentPlayerIndex]?.name}</p>
          {currentImage && (
            <>
              <img src={currentImage} alt="Card" className="card" />
              {imageCounts[currentImage] > 1 && (
                <div>
                  <h2>Call the card name!</h2>
                  <RadioButton options={players.map(player => ({ label: player.name, value: player.name }))} onSelect={setSelectedPlayer} />
                  <button className='assign-button' onClick={() => handlePlayerSelection(selectedPlayer)}>
                    Assign the card to {selectedPlayer}
                  </button>
                </div>
              )}
              {imageCounts[currentImage] < 1 && (
                <h2>Name the card! </h2>
              )}
            </>
          )}
          <button onClick={drawCard} disabled={gameFinished}>Draw a card</button>
        </>
      )}
      {gameFinished && (
        <div>
          <Confetti></Confetti>
          <div className="results-container">
            {players.map((player) => (
              <div key={player.id} className="results-player">
                <h3>{player.name} Score: {playerScores[player.name]}</h3>
                <div className="results-cards">
                  {playerCards[player.name]?.map((card, index) => (
                    <img key={index} src={card} alt="Card" className="results-card" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!gameFinished && (
        <div className="players-container">
          {players.map((player) => (
            <div key={player.id} className="player-area">
              <h2>{player.name}</h2>
              <p>Score: {playerScores[player.name]}</p>
              <div className="cards">
                {playerCards[player.name]?.map((card, index) => (
                  <img key={index} src={card} alt="Card" className="small-card" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Monja;
