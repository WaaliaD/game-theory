import React, { useState } from 'react';
import styled from 'styled-components';

const Table = styled(({ cols, ...props }) => (
  <div {...props}>{props.children}</div>
))`
  display: grid;
  overflow: auto;
  max-width: 100%;
  grid-template-columns: repeat(${(props) => props.cols}, min-content);
`

const Cell = styled.div`
  width: 70px;
  display: flex;
  height: 40px;
  text-align: center;
  justify-content: center;
  position: sticky;
  white-space: nowrap;
  background-color:rgb(71, 70, 70);
  padding: 1px 3px;
  border: 1px solid #9c9c9c;
  align-items: center;

  input {
    width: 65px;
    margin: 5px;
    height: 30px;
    background:rgb(60, 60, 60);
    color: white;
    border-radius: 4px;
    border-style: solid;
    border-width: 1px;
    padding: 2px 8px;

    &[type=number] {
      -moz-appearance: textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:hover {
      box-shadow: 0 0 0 1px white, 0 0 0 2px #3a3c3f;
    }
  }
`

const Button = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 6px;
  color: white;
  transition: .2s linear;
  margin: 10px 5px;
  background:rgb(79, 81, 83);
  &:hover {
    box-shadow: 0 0 0 1px white, 0 0 0 2px #3a3c3f;
  }
`

const Xbutton = styled.button`
  padding: 3px 7px;
  border-radius: 6px;
  border: none;
  color: white;
  transition: .2s linear;
  background:rgb(112, 113, 113);
  margin-left: 7px;
`

const EditableTable = ({ initialData, onChange }) => {
  // Инициализация данных таблицы
  const [data, setData] = useState(initialData);

  // Добавление строки
  const handleAddRow = () => {
    const newRow = Array(data[0].length).fill(0);
    const newData = [...data, newRow];
    setData(newData);
    onChange(newData);
  };

  // Добавление столбца
  const handleAddColumn = () => {
    const newData = data.map((row) => [...row, 0]);
    setData(newData);
    onChange(newData);
  };

  // Удаление конкретной строки
  const handleRemoveRow = (rowIndex) => {
    if (data.length > 1) {
      const newData = data.filter((_, index) => index !== rowIndex);
      setData(newData);
      onChange(newData);
    }
  };

  // Удаление конкретного столбца
  const handleRemoveColumn = (colIndex) => {
    if (data[0].length > 1) {
      const newData = data.map((row) => row.filter((_, index) => index !== colIndex));
      setData(newData);
      onChange(newData);
    }
  };

  // Изменение значения ячейки
  const handleCellChange = (rowIndex, colIndex, value) =>
    setData(data.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    ));

  // Валидация значения ячейки
  const valiadteChange = (rowIndex, colIndex, value) => {
    const newData = data.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? Number(value) : cell)) : row
    );
    setData(newData);
    onChange(newData);
  };

  return (
    <>
      <Table cols={data[0].length+1}>
        <Cell></Cell>
        {data[0].map((_, colIndex) => (
          <Cell key={colIndex}>
            B{colIndex + 1}
            <Xbutton onClick={() => handleRemoveColumn(colIndex)} disabled={data[0].length <= 1}>
              X
            </Xbutton>
          </Cell>
        ))}
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <Cell>
              A{rowIndex + 1}
              <Xbutton onClick={() => handleRemoveRow(rowIndex)} disabled={data.length <= 1}>
                X
              </Xbutton>
            </Cell>
            {row.map((cell, colIndex) => (
              <Cell key={colIndex}>
                <input
                  type="number"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  onBlur={(e) => valiadteChange(rowIndex, colIndex, e.target.value)}
                />
              </Cell>
            ))}
          </React.Fragment>
        ))}
      </Table>

      <div>
          <Button onClick={handleAddRow}>Добавить строку</Button>
          <Button onClick={handleAddColumn}>Добавить столбец</Button>
      </div>
    </>
  );
};

export default EditableTable;