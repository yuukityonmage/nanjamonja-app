import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Player.css';

interface Player {
    id: number;
    name: string;
}

const Player: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const maxPlayers = 5;
    const maxImages = 10;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (players.length < maxPlayers && name.trim() !== '') {
            setPlayers([...players, { id: players.length + 1, name }]);
            setName('');
        } else if (players.length >= maxPlayers) {
            alert('5人までしか登録できません。');
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

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/Monja', { state: { players, images } });
    };

    return (
        <div>
            <div className="player-container">
                <h2 className="player-title">プレイヤー登録</h2>
                <form onSubmit={handleSubmit} className="player-form">
                    <label className="player-label">
                        名前:
                        <input
                            type="text"
                            value={name}
                            onChange={handleInputChange}
                            className="player-input"
                        />
                    </label>
                    <button type="submit" className="player-button">登録</button>
                </form>
                <h3 className="player-subtitle">登録済みのプレイヤー</h3>
                <ul className="player-list">
                    {players.map(player => (
                        <li key={player.id} className="player-item">{player.id}. {player.name}</li>
                    ))}
                </ul>
            </div>
            <div className="player-container">
                <h3 className="player-subtitle">カード作成</h3>
                <div className="file-input">
                    <label>
                        ファイル選択:
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
            <button className="file-button" onClick={handleButtonClick}>
                    ゲームスタート
            </button>
        </div>
    );
};

export default Player;
