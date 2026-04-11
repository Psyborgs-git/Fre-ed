import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollProvider } from './lib/ScrollContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

// Static pages
import Home from './routes/index.jsx';
import Blog from './routes/blog/index.jsx';
import About from './routes/about/index.jsx';
import AiMl from './routes/ai-ml/index.jsx';

// Blog articles
import IntroToLinearAlgebra from './routes/intro-to-linear-algebra/index.jsx';
import Perceptron from './routes/ai-ml/perceptron/index.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-ml" element={<AiMl />} />
          <Route path="/intro-to-linear-algebra" element={<IntroToLinearAlgebra />} />
          <Route path="/ai-ml/perceptron" element={<Perceptron />} />
        </Routes>
        <Footer />
      </ScrollProvider>
    </BrowserRouter>
  );
}
