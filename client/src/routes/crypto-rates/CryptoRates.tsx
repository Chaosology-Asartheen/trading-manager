import React from 'react';
import { TradingCard } from '../../common/components';
import api from '../../utils/api';

interface CryptoRatesProperties {}

interface CryptoRatesState {
  symbols: { [key: string]: string };
}

class CryptoRatesRoute extends React.Component<
  CryptoRatesProperties,
  CryptoRatesState
> {
  ws = new WebSocket('ws://localhost:8080/');

  componentDidMount() {
    this.loadCryptos();
  }

  loadCryptos() {
    api
      .retrieve<{ [key: string]: string }>(`${api.resources.cryptos}/prices`)
      .then((symbols) => this.setState({ symbols }));

    // this.socketHandler();
  }

  socketHandler() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected');
    };

    this.ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      console.log(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  }

  render() {
    const assets = Object.keys(this.state?.symbols || []).map((symbol) => ({
      name: symbol,
      price: Number(this.state.symbols[symbol]),
    }));

    const cards = assets.map((asset, idx) => (
      <TradingCard asset={asset} key={asset.name + idx} />
    ));

    return (
      <div>
        <p>TODO: For each resources Card with: </p>
        <ul>
          <li>Name</li>
          <li>Symbol</li>
          <li>Current rate</li>
          <li>Graph of evolution</li>
          <li>Opportunity indicator</li>
        </ul>
        {cards}
      </div>
    );
  }
}

export default CryptoRatesRoute;
