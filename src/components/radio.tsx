import React, { useState } from "react";

interface Radio {
    label: string;
    value: string;
}

interface RadioButtonProps {
    options: Radio[];
    onSelect: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ options, onSelect }) => {
    // 選択中のラジオボタンvalue
    const [selected, setSelected] = useState(options[0].value); // 初期選択をoptionsの最初の値に設定
    

    // ラジオボタン切り替えイベント
    const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(event.target.value);
        onSelect(event.target.value);
    };

    return (
        <div className="container form-check">
            <div className="row">
                {options.map(radio => (
                    <div className="col-4" key={radio.value}>
                        <input className="form-check-input" type="radio" name="sweets" 
                            value={radio.value} checked={radio.value === selected} onChange={changeValue} />
                        <label className="form-check-label">
                            <span className="fs-6">{radio.label}</span>
                        </label>
                    </div>
                ))}
            </div>
            {/* <div>{selected}が選択されました！</div> */}
        </div>
    );
};

export default RadioButton;
