import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import '../css/Monja.css';

const ItemType = {
  CARD: 'card',
};

const Monja: React.FC = () => {
  const location = useLocation();
  const { players = [], images = [] } = location.state as { players?: { id: number, name: string }[], images?: string[] };

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageCounts, setImageCounts] = useState<{ [key: string]: number }>({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<{ [key: string]: number }>({});
  const [playerCards, setPlayerCards] = useState<{ [key: string]: string[] }>({});
  const [isSelectingPlayer, setIsSelectingPlayer] = useState(false);

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

  const getCard = () => {

  };

  const handleDrop = (player: string, item: { image: string }) => {
    setPlayerCards({
      ...playerCards,
      [player]: [...playerCards[player], item.image],
    });
    setPlayerScores({
      ...playerScores,
      [player]: (playerScores[player] || 0) + 1,
    });
    setCurrentImage(null);
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
    setIsSelectingPlayer(false);
  };

  const initiatePlayerSelection = () => {
    if (!currentImage) return;
    setIsSelectingPlayer(true);
  };

  const gameFinished = Object.values(imageCounts).every(count => count >= 4);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="monja-game">
        <h1>オリジナルモンジャ</h1>
        {!gameFinished && (
          <>
            <p>現在のプレイヤー: {players[currentPlayerIndex]?.name}</p>
            {currentImage && (
            <>
              <img src={currentImage} alt="Card" className="card"/>
              <button onClick={initiatePlayerSelection}>カードを取得</button>
              {isSelectingPlayer && (
                <div>
                  {players.map(player => (
                    <button className='assign-button' key={player.id} onClick={() => handlePlayerSelection(player.name)}>
                      {player.name}にこのカードを割り当てる
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          <button onClick={drawCard} disabled={gameFinished || isSelectingPlayer}>カードを引く</button>
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
            <PlayerArea key={player.id} player={player.name} score={playerScores[player.name]} cards={playerCards[player.name] || []} onDrop={(item) => handleDrop(player.name, item)} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

const DraggableCard: React.FC<{ image: string, isDraggable: boolean }> = ({ image, isDraggable }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: { image },
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <img ref={drag} src={image} alt="Card" className={`card ${isDragging ? 'dragging' : ''}`} />
  );
};

const PlayerArea: React.FC<{ player: string, score: number, cards: string[], onDrop: (item: { image: string }) => void }> = ({ player, score, cards, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.CARD,
    drop: (item: { image: string }) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`player-area ${isOver ? 'hover' : ''}`}>
      <h2>{player}</h2>
      <p>得点: {score}</p>
      <div className="cards">
        {cards.map((card, index) => (
          <img key={index} src={card} alt="Card" className="small-card" />
        ))}
      </div>
    </div>
  );
};

export default Monja;
