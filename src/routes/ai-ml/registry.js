import { meta as linearAlgebraMeta } from './intro-to-linear-algebra/meta.js';
import { meta as perceptronMeta } from './perceptron/meta.js';
import { meta as mlpMeta } from './mlp/meta.js';
import { meta as backpropMeta } from './backprop/meta.js';
import { meta as cnnMeta } from './cnn-from-scratch/meta.js';
import { meta as attentionMeta } from './attention/meta.js';
import { meta as transformerMeta } from './transformer/meta.js';
import { meta as moeMeta } from './moe/meta.js';
import { meta as ragMeta } from './rag/meta.js';
import { meta as loraMeta } from './lora/meta.js';
import { meta as fineTuningMeta } from './fine-tuning/meta.js';

export const LIVE_AI_ML_LESSONS = [
  { path: '/ai-ml/perceptron', meta: perceptronMeta },
  { path: '/ai-ml/mlp', meta: mlpMeta },
  { path: '/ai-ml/backprop', meta: backpropMeta },
  { path: '/ai-ml/cnn-from-scratch', meta: cnnMeta },
  { path: '/ai-ml/attention', meta: attentionMeta },
  { path: '/ai-ml/transformer', meta: transformerMeta },
  { path: '/ai-ml/moe', meta: moeMeta },
  { path: '/ai-ml/rag', meta: ragMeta },
  { path: '/ai-ml/lora', meta: loraMeta },
  { path: '/ai-ml/fine-tuning', meta: fineTuningMeta },
];

export const COMING_SOON_AI_ML_LESSONS = [
  {
    path: '/ai-ml/embeddings',
    title: 'Embeddings',
    desc: 'How discrete tokens become continuous vectors. Word2Vec, cosine similarity, king−man+woman=queen, and positional encodings.',
    status: 'coming-soon',
    tags: ['embeddings', 'nlp', 'word2vec'],
  },
  {
    path: '/ai-ml/normalization',
    title: 'Normalization',
    desc: 'BatchNorm, LayerNorm, and RMSNorm — keeping activations well-behaved so deep networks can actually train.',
    status: 'coming-soon',
    tags: ['normalization', 'batch-norm', 'layer-norm'],
  },
  {
    path: '/ai-ml/optimizers',
    title: 'Optimizers',
    desc: 'SGD vs Momentum vs Adam racing through the same loss landscape. Why adaptive learning rates win.',
    status: 'coming-soon',
    tags: ['optimizers', 'adam', 'training'],
  },
  {
    path: '/ai-ml/regularization',
    title: 'Dropout & Regularization',
    desc: 'Randomly silence neurons during training to create an implicit ensemble. Dropout, L2 decay, and early stopping.',
    status: 'coming-soon',
    tags: ['regularization', 'dropout', 'overfitting'],
  },
  {
    path: '/ai-ml/rnn-lstm',
    title: 'RNN & LSTM',
    desc: 'A hidden state that travels through time. How LSTMs use forget, input, and output gates to preserve long-range memory.',
    status: 'coming-soon',
    tags: ['rnn', 'lstm', 'sequences'],
  },
  {
    path: '/ai-ml/diffusion',
    title: 'Diffusion Models',
    desc: 'Add noise until structure vanishes, then learn to reverse the process. DDPM, score matching, and latent diffusion.',
    status: 'coming-soon',
    tags: ['diffusion', 'generative-ai', 'ddpm'],
  },
];

export const LIVE_BLOG_POSTS = [
  { path: '/intro-to-linear-algebra', meta: linearAlgebraMeta },
  ...LIVE_AI_ML_LESSONS,
];
