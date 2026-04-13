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

// Blog articles
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

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ScrollProvider>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-ml" element={<AiMl />} />
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
          </Routes>
          <Footer />
        </ScrollProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
