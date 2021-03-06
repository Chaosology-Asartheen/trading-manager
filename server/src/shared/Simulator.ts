import { CryptoHistory } from '@entities/CryptoHistory';
import { strategies } from './strategies';
import { backtest, analyze } from 'grademark';
import {
  Simulation,
  SimulationAnalysis,
  SimulationTrade,
} from '@entities/Simulation';

export class Simulator {
  private _datas: CryptoHistory[];

  constructor(history: CryptoHistory[]) {
    this._datas = history;
  }

  public simulate(params?: {
    capital: number;
    leverage: number;
  }): Simulation[] {
    const leverage = params?.leverage ? params.leverage : 1;
    const startingCapital = params?.capital ? params.capital : 20;

    const simulations = strategies.map((strategy) => {
      const datas = strategy.historicToDataframe(this._datas);

      // Backtest each strategy
      const trades = backtest(strategy, datas as any, {});
      const analysis = analyze(startingCapital * leverage, trades);

      return {
        analysis: analysis as SimulationAnalysis,
        history: this._datas,
        id: strategy.id,
        name: strategy.name,
        trades: trades as SimulationTrade[],
      };
    });

    return simulations;
  }
}
