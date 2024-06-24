import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Player.css';

interface Player {
    id: number;
    name: string;
}

const Player: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([]); // プレイヤーの配列
    const [images, setImages] = useState<string[]>([]); // カードの配列
    const maxPlayers = 6; // 最大プレイ人数
    const maxImages = 10; // 最大カード数
    const [countPerCard, setCountPerCard] = useState<number>(3);

    // プレイヤー名入力フォームの状態管理
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (players.length < maxPlayers && name.trim() !== '') {
            setPlayers([...players, { id: players.length + 1, name }]);
            setName('');
        } else if (players.length >= maxPlayers) {
            alert('You can only register up to' + maxPlayers + 'people');
        }
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileReaders: FileReader[] = [];
            const uploadedImages: string[] = [];

            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target) {
                        uploadedImages.push(e.target.result as string);
                        if (uploadedImages.length === files.length) {
                            if (images.length >= maxImages) {
                                alert('You can only register up to' + maxImages + 'cards');
                            }
                            if (images.length + uploadedImages.length > maxImages) {
                                alert('Removed after' + (maxImages + 1) + 'th');
                            }
                            const newImages = [...images, ...uploadedImages].slice(0, maxImages);
                            setImages(newImages);
                            sessionStorage.setItem('uploadedImages', JSON.stringify(newImages));
                        }
                    }
                };
                reader.readAsDataURL(file);
                fileReaders.push(reader);
            });
        }
    };

    const handleCountPerCardChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCountPerCard(Number(event.target.value));
    };
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (players.length > 0 && images.length > 0) {
            navigate('/Monja', { state: { players, images, countPerCard} });
        } else {
            alert('Regist Player and create cards');
        }
    };

    return (
        <div>
            <div className="player-container">
                <h2 className="player-title">Player Registration</h2>
                <form onSubmit={handleSubmit} className="player-form">
                    <label className="player-label">
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={handleInputChange}
                            className="player-input"
                        />
                    </label>
                    <button type="submit" className="player-button">Regist</button>
                </form>
                <h3 className="player-subtitle">Registered Player</h3>
                <ul className="player-list">
                    {players.map(player => (
                        <li key={player.id} className="player-item">{player.id}. {player.name}</li>
                    ))}
                </ul>
            </div>
            <div className="player-container">
                <h3 className="player-subtitle">Card Making</h3>
                <div className="file-input">
                    <label>
                        Chooce files:
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
                {images.length > 0 && (
                    <div className="image-preview">
                        {images.map((image, index) => (
                            <img key={index} src={image} alt={`uploaded ${index}`} className="uploaded-image" />
                        ))}
                    </div>
                )}
            </div>
            <div className="player-container">
                <h3 className="player-subtitle">Card amount</h3>

                <div className='card-amount-row'>
                    <p>Count per card</p>
                    <select value={countPerCard} onChange={handleCountPerCardChange}>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <p>Total number of cards: {images.length * countPerCard}</p>

            </div>
            <button className="file-button" onClick={handleButtonClick}>
                Game Start
            </button>
        </div>
    );
};

export default Player;
