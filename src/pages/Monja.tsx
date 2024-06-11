import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import '../css/Monja.css';
import RadioButton from '../components/radio';

const Monja: React.FC = () => {
  const location = useLocation();
  const { players = [], images = [] } = location.state as { players?: { id: number, name: string }[], images?: string[] };

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageCounts, setImageCounts] = useState<{ [key: string]: number }>({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<{ [key: string]: number }>({});
  const [playerCards, setPlayerCards] = useState<{ [key: string]: string[] }>({});
  const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0].name);

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

  const drawCard = () => {
    const availableImages = images.filter((image) => imageCounts[image] < 4);

    if (availableImages.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];

    // 選択されたカードにアニメーションを適用するための一時的な状態
    setCurrentImage(null);

    setTimeout(() => {
      setImageCounts({
        ...imageCounts,
        [selectedImage]: imageCounts[selectedImage] + 1,
      });

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
    setImageCounts(prev => ({
      ...prev,
      [currentImage]: prev[currentImage] + 1,
    }));
    setCurrentImage(null);
  };

  const gameFinished = Object.values(imageCounts).every(count => count >= 4);

  return (
    <div className="monja-game">
      <h1>オリジナルモンジャ</h1>
      {!gameFinished && (
        <>
          <p>現在のプレイヤー: {players[currentPlayerIndex]?.name}</p>
          {currentImage && (
            <>
              <img src={currentImage} alt="Card" className="card" />
              {imageCounts[currentImage] > 1 && (
                <div>
                  <RadioButton options={players.map(player => ({ label: player.name, value: player.name }))} onSelect={setSelectedPlayer} />
                  <button className='assign-button' onClick={() => handlePlayerSelection(selectedPlayer)}>
                    {selectedPlayer}にこのカードを割り当てる
                  </button>
                </div>
              )}
            </>
          )}
          <button onClick={drawCard} disabled={gameFinished}>カードを引く</button>
        </>
      )}
      {gameFinished && (
        <>
          <h2>結果発表</h2>
          {players.map((player) => (
            <div key={player.id}>
              <h3>{player.name}の得点: {playerScores[player.name]}点</h3>
              <div className="cards">
                {playerCards[player.name]?.map((card, index) => (
                  <img key={index} src={card} alt="Card" className="small-card" />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      <div className="players-container">
        {players.map((player) => (
          <div key={player.id} className="player-area">
            <h2>{player.name}</h2>
            <p>得点: {playerScores[player.name]}</p>
            <div className="cards">
              {playerCards[player.name]?.map((card, index) => (
                <img key={index} src={card} alt="Card" className="small-card" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monja;
