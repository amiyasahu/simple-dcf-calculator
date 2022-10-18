import './App.scss';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

const currentYear = new Date().getFullYear();

const initialFormData = {
  ticker : 'AAPL',
  currentRevenue: 100,
  currentMarketCap: 100,
  revenueGrowth: 15,
  netIncomePct: 10,
  peRatio: 20,
  marginOfSafety: 10
}

const initialTableData = {
   topHeader : ["Year ==>", currentYear, currentYear + 1, currentYear + 2, currentYear+3, currentYear+4, currentYear+5],
   sideBar : ['REVENUE', 'NET INCOME', 'Expected MKT CAP', 'UPSIDE'],
   dcfData : []
}

function App() {
  
  const [data, setData] = useState(initialFormData);
  
  const handleChange = (event) => {
    setData({...data, [event.target.name] : event.target.value})
  }

  const revenues = new Array(6).fill(data.currentRevenue);
  const netIncomes = new Array(6).fill(data.currentRevenue);
  const marketCaps = new Array(6).fill(data.currentMarketCap);
  const upsides = new Array(6).fill(0);

  for(let i=1; i<=5;i++){
    const calculatedRevenue = revenues[i-1] * (1 + data.revenueGrowth/100);
    revenues[i] = calculatedRevenue.toFixed(2);
  }

  for(let i=0; i<=5;i++){
    const calculatedNetIncome = revenues[i] * data.netIncomePct/100;
    netIncomes[i] = calculatedNetIncome.toFixed(2);
    const calculatedMarketCap = netIncomes[i] * data.peRatio;
    marketCaps[i] = calculatedMarketCap.toFixed(2);
    upsides[i] = ((marketCaps[i] - data.currentMarketCap) / data.currentMarketCap * 100).toFixed(2);
  }

  const tableData = {...initialTableData, dcfData : [revenues, netIncomes, marketCaps, upsides]};

  return (
    <div className="App">
      <h1>DCF Calculator</h1>
      <div className="AppForm">
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Ticker</Form.Label>
              <Form.Control name={'ticker'} placeholder="Stock Symbol" value={data.ticker} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Revenue</Form.Label>
              <Form.Control name={'currentRevenue'} placeholder="Current Revenue" value={data.currentRevenue} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Market Cap</Form.Label>
              <Form.Control name={'currentMarketCap'} placeholder="Current Market Cap" value={data.currentMarketCap} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Revenue Growth</Form.Label>
              <Form.Control type={'number'} name={'revenueGrowth'} placeholder="Revenue growth" value={data.revenueGrowth} onChange={handleChange} />
            </Form.Group>

          </Col>
          <Col>
            <Form.Group className="mb-3">
                <Form.Label>Netincome Percentage</Form.Label>
                <Form.Control type={'number'} name={'netIncomePct'} placeholder="Net income %" value={data.netIncomePct} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>P/E</Form.Label>
                <Form.Control type={'number'} name={'peRatio'} placeholder="P/E" value={data.peRatio} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Margin Of Safety</Form.Label>
                <Form.Control type={'number'} name={'marginOfSafety'} placeholder="MOS" value={data.marginOfSafety} onChange={handleChange} />
              </Form.Group>
          </Col>
        </Row>
      </div>
      <h1>{data.ticker} DCF</h1>
      <Table striped bordered hover>
      <thead>
        <tr>
          {
            tableData.topHeader.map(header => <th key={header}>{header}</th>)
          }
        </tr>
      </thead>
      <tbody>
          {
            tableData.sideBar.map((tableRow, rowIndex) => <tr key={tableRow}> 
                { 
                  tableData.topHeader.map((header, index) => {
                    return <td key={tableRow+header+index}>
                    {
                      index === 0 
                        ? tableData.sideBar[rowIndex] 
                        : tableData.dcfData[rowIndex] && tableData.dcfData[rowIndex][index-1]
                    }
                    </td>
                }) }
              </tr>
            )
          }
      </tbody>
    </Table>

    </div>
  );
}

export default App;
