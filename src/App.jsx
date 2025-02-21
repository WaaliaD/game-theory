import { useState, useMemo, Fragment } from 'react'
import EditableTable from './Table'
import styled from 'styled-components';

const Wraper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Input = styled.input`
  margin: 10px 5px;
  width: 100px;
  height: 30px;
  background:rgb(79, 81, 83);
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
`

const LogTable = styled(({ cols, ...props }) => (
  <div {...props}>{props.children}</div>
))`
  margin: 10px;
  font-size: 16px;
  display: grid;
  overflow: auto;
  max-width: 100%;
  grid-template-columns: repeat(${(props) => props.cols}, min-content);
`

const HeadCell = styled.div`
  padding: 5px;
  width: 45px;
  display: flex;
  justify-content: center;
  white-space: nowrap;
  background-color:rgb(33, 33, 33);
  border: 1px solid #9c9c9c;
`

const Cell = styled.div`
  width: 40px;
  display: flex;
  justify-content: center;
  white-space: nowrap;
  padding: 5px;
  width: 45px;
  border: 1px solid rgb(160, 160, 160);
`

const PersentTable = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 15px;

  ul {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
  }

  li {
    list-style: none;
  }
`

const Button = styled.button`
  user-select: none;
  padding: 7px;
  width: 80px;
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

function App() {
  const [tableData, setTableData] = useState([[3, 6, 8],[9, 4, 2],[7, 5, 4]]);
  const [iterCount, setIterCount] = useState(10);
  const [solveData, setSolveData] = useState([]);
  const [usesStat, setUsesStat] = useState([]);
  const [isTableShown, setIsTableShow] = useState(true);

  const colsCount = useMemo(() => 6+tableData[0]?.length + tableData?.length, [tableData])

  const OptimalFirstMove = () => {
    const minPayoffs = tableData.map((row) => Math.min(...row));
    const index = minPayoffs.indexOf(Math.max(...minPayoffs));
    const bCumulativePayoffs = tableData[index];

    return [`A${index+1}`, bCumulativePayoffs, Math.min(...bCumulativePayoffs) ];
  }
  
  const OptimalAMove = (aCumulativePayoffs, bCumulativePayoffs) => {
    const index = aCumulativePayoffs.indexOf(Math.max(...aCumulativePayoffs));
    const newbCumulativePayoffs = bCumulativePayoffs.map((item, i) => item + tableData[index][i]);

    return [`A${index+1}`, newbCumulativePayoffs, Math.min(...newbCumulativePayoffs) ];
  }

  const OptimalBMove = (aCumulativePayoffs, bCumulativePayoffs) => {
    const index = bCumulativePayoffs.indexOf(Math.min(...bCumulativePayoffs));
    const newaCumulativePayoffs = aCumulativePayoffs.map((item, i) => item + tableData[i][index]);

    return [`B${index+1}`, newaCumulativePayoffs, Math.max(...newaCumulativePayoffs) ];
  }

  const solve = () => {
    const arr = [];
    let aCumulativePayoffs = new Array(tableData.length).fill(0);
    let bCumulativePayoffs = [];
    const aUses = {};
    const bUses = {};
  
    // Функция для добавления данных в массив
    const addToArray = (aChoice, bCumulative, bChoice, aCumulative, vMin, vMax) => {
      aUses[aChoice] = ++aUses[aChoice] || 1;
      bUses[bChoice] = ++bUses[bChoice] || 1;

      arr.push([
        aChoice,
        ...bCumulative,
        bChoice,
        ...aCumulative,
        Math.round(vMin * 100) / 100,
        Math.round(vMax * 100) / 100,
        Math.round(((vMin + vMax) / 2) * 100) / 100,
      ]);
    };
  
    // Первая итерация
    const [aChoice1, bCumulative1, vMin1] = OptimalFirstMove();
    bCumulativePayoffs = bCumulative1;
    const [bChoice1, aCumulative1, vMax1] = OptimalBMove(aCumulativePayoffs, bCumulativePayoffs);
    aCumulativePayoffs = aCumulative1;
    addToArray(aChoice1, bCumulativePayoffs, bChoice1, aCumulativePayoffs, vMin1, vMax1);
  
    // Последующие итерации
    for (let i = 1; i < iterCount; i++) {
      const [aChoice, bCumulative, vMin] = OptimalAMove(aCumulativePayoffs, bCumulativePayoffs);
      bCumulativePayoffs = bCumulative;
      const [bChoice, aCumulative, vMax] = OptimalBMove(aCumulativePayoffs, bCumulativePayoffs);
      aCumulativePayoffs = aCumulative;
  
      addToArray(aChoice, bCumulativePayoffs, bChoice, aCumulativePayoffs, vMin / (i + 1), vMax / (i + 1));
    }
    
    setUsesStat({A: aUses, B: bUses})
    setSolveData(arr);
  };

  const renderUses = () => {
    const root = Object.entries(usesStat);
    const aUse = root?.[0]?.[1]
    const bUse = root?.[1]?.[1]

    if (!aUse && !bUse) 
      return;

    const aTotal = Object?.values(aUse)?.reduce((sum, value) => sum + value, 0);
    const aPercentages = {};
    for (const key in aUse) {
      aPercentages[key] = ((aUse[key] / aTotal) * 100).toFixed(2) + "%";
    }

    const total = Object?.values(bUse)?.reduce((sum, value) => sum + value, 0);
    const bPercentages = {};
    for (const key in bUse) {
      bPercentages[key] = ((bUse[key] / total) * 100).toFixed(2) + "%";
    }

    return (
      <PersentTable>
        <ul>
          {Object.entries(aPercentages).map(([key, value]) => (
            <li key={key}>
              {key}: {value} ({aUse[key]})
            </li>
          ))}
        </ul>
        <ul>
          {Object.entries(bPercentages).map(([key, value]) => (
            <li key={key}>
              {key}: {value} ({bUse[key]})
            </li>
          ))}
        </ul>
      </PersentTable>
    )
  }

  const renderTable = () => {
    if (solveData.length && isTableShown)
      return (
        <LogTable cols={colsCount} >
          <HeadCell>k</HeadCell>
          <HeadCell>Ai</HeadCell>
          {tableData[0]?.map((_, idx) => <HeadCell key={idx+'B'}>B{idx+1}</HeadCell>)}
          <HeadCell>Bj</HeadCell>
          {tableData?.map((_, idx) => <HeadCell key={idx+'A'}>A{idx+1}</HeadCell>)}
          <HeadCell>Vmin</HeadCell>
          <HeadCell>Vmax</HeadCell>
          <HeadCell>Vs</HeadCell>

          {Array.from({ length: colsCount }).map((_, idx) => <HeadCell key={idx + 'SequenceNumber'}>{idx + 1}</HeadCell>)}


          {solveData.map((item, index) => {
            return (
              <Fragment key={index + 'FragmentResult'}>
                <Cell>{index+1}</Cell>
                {item.map((sub, subindex) => <Cell key={index + 'ResultItem' + subindex + sub}>{sub}</Cell>)}
              </Fragment>
            )
          })}
        </LogTable>
      )
  }

  return (
    <Wraper>
      <div>
        <Input type='number' value={iterCount} onInput={(e) => setIterCount(e.target.value)}/>
        <Button onClick={solve}>Расчитать</Button>
        <Button onClick={() => setIsTableShow(prev => !prev)}>{isTableShown ? 'Скрыть' : 'Показать'}</Button>
      </div>

      <EditableTable initialData={tableData} onChange={(newData) => setTableData(newData)} />

      {renderUses()}

      {renderTable()}
    </Wraper>
  );
}

export default App;
