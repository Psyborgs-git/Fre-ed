import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollProvider } from './lib/ScrollContext.jsx';
import { ThemeProvider } from './lib/ThemeContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

// Static pages
import Home from './routes/index.jsx';
import Blog from './routes/blog/index.jsx';
import About from './routes/about/index.jsx';
import AiMl from './routes/ai-ml/index.jsx';
import QuantTrading from './routes/quant-trading/index.jsx';

// Quant Trading lessons
import CandlestickCharts from './routes/quant-trading/candlestick-charts/index.jsx';
import MovingAverages from './routes/quant-trading/moving-averages/index.jsx';
import TrendVsNoise from './routes/quant-trading/trend-vs-noise/index.jsx';
import PositionSizing from './routes/quant-trading/position-sizing/index.jsx';
import MeanReversion from './routes/quant-trading/mean-reversion/index.jsx';
import SharpeRatio from './routes/quant-trading/sharpe-ratio/index.jsx';
import Backtesting from './routes/quant-trading/backtesting/index.jsx';
import BollingerBands from './routes/quant-trading/bollinger-bands/index.jsx';
import CorrelationHeatmap from './routes/quant-trading/correlation-heatmap/index.jsx';
import RegimeDetection from './routes/quant-trading/regime-detection/index.jsx';
import VolatilitySurface from './routes/quant-trading/volatility-surface/index.jsx';
import EfficientFrontier from './routes/quant-trading/efficient-frontier/index.jsx';

// AI/ML blog articles
import IntroToLinearAlgebra from './routes/ai-ml/intro-to-linear-algebra/index.jsx';
import Perceptron from './routes/ai-ml/perceptron/index.jsx';
import Transformer from './routes/ai-ml/transformer/index.jsx';
import Moe from './routes/ai-ml/moe/index.jsx';
import Rag from './routes/ai-ml/rag/index.jsx';
import Lora from './routes/ai-ml/lora/index.jsx';
import FineTuning from './routes/ai-ml/fine-tuning/index.jsx';
import Attention from './routes/ai-ml/attention/index.jsx';
import Mlp from './routes/ai-ml/mlp/index.jsx';
import Backprop from './routes/ai-ml/backprop/index.jsx';
import Cnn from './routes/ai-ml/cnn-from-scratch/index.jsx';
import Embeddings from './routes/ai-ml/embeddings/index.jsx';
import Normalization from './routes/ai-ml/normalization/index.jsx';
import Optimizers from './routes/ai-ml/optimizers/index.jsx';
import Regularization from './routes/ai-ml/regularization/index.jsx';
import RnnLstm from './routes/ai-ml/rnn-lstm/index.jsx';
import Diffusion from './routes/ai-ml/diffusion/index.jsx';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <ScrollProvider>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-ml" element={<AiMl />} />
            <Route path="/quant-trading" element={<QuantTrading />} />
            <Route path="/quant-trading/candlestick-charts" element={<CandlestickCharts />} />
            <Route path="/quant-trading/moving-averages" element={<MovingAverages />} />
            <Route path="/quant-trading/trend-vs-noise" element={<TrendVsNoise />} />
            <Route path="/quant-trading/position-sizing" element={<PositionSizing />} />
            <Route path="/quant-trading/mean-reversion" element={<MeanReversion />} />
            <Route path="/quant-trading/sharpe-ratio" element={<SharpeRatio />} />
            <Route path="/quant-trading/backtesting" element={<Backtesting />} />
            <Route path="/quant-trading/bollinger-bands" element={<BollingerBands />} />
            <Route path="/quant-trading/correlation-heatmap" element={<CorrelationHeatmap />} />
            <Route path="/quant-trading/regime-detection" element={<RegimeDetection />} />
            <Route path="/quant-trading/volatility-surface" element={<VolatilitySurface />} />
            <Route path="/quant-trading/efficient-frontier" element={<EfficientFrontier />} />
            <Route path="/intro-to-linear-algebra" element={<IntroToLinearAlgebra />} />
            <Route path="/ai-ml/perceptron" element={<Perceptron />} />
            <Route path="/ai-ml/transformer" element={<Transformer />} />
            <Route path="/ai-ml/moe" element={<Moe />} />
            <Route path="/ai-ml/rag" element={<Rag />} />
            <Route path="/ai-ml/lora" element={<Lora />} />
            <Route path="/ai-ml/fine-tuning" element={<FineTuning />} />
            <Route path="/ai-ml/mlp" element={<Mlp />} />
            <Route path="/ai-ml/attention" element={<Attention />} />
            <Route path="/ai-ml/backprop" element={<Backprop />} />
            <Route path="/ai-ml/cnn-from-scratch" element={<Cnn />} />
            <Route path="/ai-ml/embeddings" element={<Embeddings />} />
            <Route path="/ai-ml/normalization" element={<Normalization />} />
            <Route path="/ai-ml/optimizers" element={<Optimizers />} />
            <Route path="/ai-ml/regularization" element={<Regularization />} />
            <Route path="/ai-ml/rnn-lstm" element={<RnnLstm />} />
            <Route path="/ai-ml/diffusion" element={<Diffusion />} />
          </Routes>
          <Footer />
        </ScrollProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
