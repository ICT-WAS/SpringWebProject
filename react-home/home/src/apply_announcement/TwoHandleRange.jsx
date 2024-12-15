import { Range } from "react-range";
import React, { useState } from 'react';

export default function TwoHandleRange({ onChangeValue }) {
  
    const [values, setValues] = useState([0, 150000]); // 초기 값 [최소, 최대]
  
    function onChangeVal(newValues) {
      setValues(newValues);
  
      if (onChangeValue) {
        onChangeValue(newValues);
      }
    }
  
    return (
        <div style={{ margin: "2rem", width: "300px" }}>
          <Range
            step={1000} // 핸들 이동 간격
            min={0} // 최소값
            max={150000} // 최대값
            values={values}
            onChange={onChangeVal}
            renderTrack={({ props, children }) => (
              <div
                {...props} // 여기에서 key가 포함된 props는 제외
                style={{
                  height: "6px",
                  width: "100%",
                  background: "lightgray",
                  borderRadius: "3px",
                  position: "relative",
                }}
              >
                {/* 선택된 구간 강조 */}
                <div
                  style={{
                    position: "absolute",
                    height: "6px",
                    background: "blue",
                    borderRadius: "3px",
                    left: `${((values[0] - props.min) / (props.max - props.min)) * 100}%`,
                    right: `${100 - ((values[1] - props.min) / (props.max - props.min)) * 100}%`,
                  }}
                />
                {React.Children.map(children, (child, index) => 
                  React.cloneElement(child, { key: index })
                )}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props} // key를 여기서도 스프레드하지 않고 직접 전달
                key={index} // 여기서 key를 명시적으로 전달
                style={{
                  height: "30px", // 핸들러 크기 증가
                  width: "60px",
                  background: "black", // 핸들 색상 강조
                  borderRadius: "15px",
                  outline: "none",
                  border: "2px solid white", // 테두리 추가
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)", // 그림자 효과
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {index === 0 ? "최저" : "최고"}
              </div>
            )}
          />
        </div>
      );
  }