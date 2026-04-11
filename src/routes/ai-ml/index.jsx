import { Link } from 'react-router-dom';

/**
 * AI/ML segment hub — as described in 11-ai-ml-segment.md.
 * Shows available model "worlds" and links to each route.
 */
const ML_ROUTES = [
  {
    path: '/ai-ml/perceptron',
    title: 'Perceptron',
    desc: 'A single neuron: inputs, weights, bias, and activation. The atom of every neural network.',
    status: 'live',
    tags: ['fundamentals', 'neural-networks'],
  },
  {
    path: '/ai-ml/mlp',
    title: 'Multi-Layer Perceptron',
    desc: 'Stack perceptrons to create nonlinear decision boundaries. Layers, activations, and forward pass.',
    status: 'coming-soon',
    tags: ['neural-networks', 'deep-learning'],
  },
  {
    path: '/ai-ml/backprop',
    title: 'Backpropagation',
    desc: 'How gradients flow backward through a network. Chain rule visualised as a reverse colour pulse.',
    status: 'coming-soon',
    tags: ['training', 'gradients'],
  },
  {
    path: '/ai-ml/cnn-from-scratch',
    title: 'CNN from Scratch',
    desc: '3D image volumes, sliding kernels, and stacked feature maps — convolutional intuition.',
    status: 'coming-soon',
    tags: ['computer-vision', 'convolution'],
  },
  {
    path: '/ai-ml/attention',
    title: 'Self-Attention',
    desc: 'Token spheres, Query–Key dot products, and softmax heatmaps. The core of transformers.',
    status: 'coming-soon',
    tags: ['transformers', 'nlp'],
  },
  {
    path: '/ai-ml/transformer',
    title: 'Transformer Block',
    desc: 'Stacked attention + feedforward layers with residual connections — the full block in 3D.',
    status: 'live',
    tags: ['transformers', 'architecture'],
  },
  {
    path: '/ai-ml/moe',
    title: 'Mixture of Experts',
    desc: 'A gating network routes each token to just 2 of 8 experts. Sparse activation scales models to trillions of parameters.',
    status: 'live',
    tags: ['transformers', 'scaling'],
  },
  {
    path: '/ai-ml/rag',
    title: 'Retrieval-Augmented Generation',
    desc: 'Query embeddings, cosine similarity, and vector databases — how LLMs retrieve facts before generating answers.',
    status: 'live',
    tags: ['rag', 'nlp', 'retrieval'],
  },
  {
    path: '/ai-ml/lora',
    title: 'LoRA — Low-Rank Adaptation',
    desc: 'Freeze the base model and learn two tiny adapter matrices. Train < 0.1% of parameters to adapt a 70B model.',
    status: 'live',
    tags: ['fine-tuning', 'peft', 'lora'],
  },
  {
    path: '/ai-ml/fine-tuning',
    title: 'Fine-Tuning',
    desc: 'Walk the loss landscape from pre-trained plateau to task-specific valley. SFT, RLHF, and DPO explained.',
    status: 'live',
    tags: ['fine-tuning', 'rlhf', 'sft'],
  },
];

const STATUS_BADGE = {
  live: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
  'coming-soon': 'bg-bg-base text-ink-lo border-line',
};

export default function AiMl() {
  return (
    <div className="min-h-screen bg-bg-base pt-14">
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-20">
        {/* Header */}
        <header className="mb-14 max-w-2xl">
          <p className="text-sm font-mono text-accent-violet tracking-widest uppercase mb-3">
            AI / ML Segment
          </p>
          <h1 className="text-4xl font-display font-bold leading-display mb-5 text-ink-hi">
            Neural networks,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-cyan">
              made walkable
            </span>
          </h1>
          <p className="text-ink-lo leading-prose text-lg">
            Every model is a world. Walk through weights, activations, attention, and gradients as
            spatial 3D objects — not static diagrams.
          </p>
        </header>

        {/* Model grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ML_ROUTES.map(({ path, title, desc, status, tags }) => {
            const isLive = status === 'live';
            const Wrapper = isLive ? Link : 'div';
            const wrapperProps = isLive ? { to: path } : {};

            return (
              <Wrapper
                key={path}
                {...wrapperProps}
                className={[
                  'group relative bg-bg-elev border border-line rounded-xl p-6 no-underline',
                  isLive
                    ? 'hover:border-accent-violet/50 cursor-pointer transition-all duration-200'
                    : 'opacity-60 cursor-default',
                ].join(' ')}
              >
                {/* Status badge */}
                <span
                  className={`absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[status]}`}
                >
                  {isLive ? 'Live' : 'Soon'}
                </span>

                <h2
                  className={`font-display font-semibold mb-2 leading-snug ${
                    isLive ? 'text-ink-hi group-hover:text-accent-violet transition-colors' : 'text-ink-lo'
                  }`}
                >
                  {title}
                </h2>

                <p className="text-ink-lo text-sm leading-relaxed mb-4">{desc}</p>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border border-line text-ink-lo bg-bg-base"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Shared primitives note */}
        <aside className="mt-14 border border-line rounded-xl p-6 bg-bg-elev">
          <h2 className="font-display font-semibold mb-2 text-ink-hi">Shared 3D primitives</h2>
          <p className="text-ink-lo text-sm leading-relaxed mb-3">
            All ML scenes share a library of reusable Three.js components in{' '}
            <code className="text-accent-cyan bg-bg-base px-1 rounded">/src/three/ml/</code>:
          </p>
          <ul className="grid sm:grid-cols-2 gap-1 text-sm text-ink-lo list-none m-0 p-0">
            {[
              '<Neuron> — sphere + glow by activation',
              '<Weight> — line coloured by sign + magnitude',
              '<Layer> — grid of neurons with layout helpers',
              '<ActivationWave> — propagation animation',
              '<Matrix> — instanced cell grid, value → color',
              '<Tensor3D> — volumetric box with slice viewer',
              '<AttentionLines> — QK connection bundle',
              '<GradientField> — vector arrows for backprop',
            ].map((p) => (
              <li key={p} className="font-mono text-xs">
                {p}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
