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
import { meta as embeddingsMeta } from './embeddings/meta.js';
import { meta as normalizationMeta } from './normalization/meta.js';
import { meta as optimizersMeta } from './optimizers/meta.js';
import { meta as regularizationMeta } from './regularization/meta.js';
import { meta as rnnLstmMeta } from './rnn-lstm/meta.js';
import { meta as diffusionMeta } from './diffusion/meta.js';

export const LIVE_AI_ML_LESSONS = [
  { path: '/ai-ml/perceptron', meta: perceptronMeta },
  { path: '/ai-ml/mlp', meta: mlpMeta },
  { path: '/ai-ml/backprop', meta: backpropMeta },
  { path: '/ai-ml/cnn-from-scratch', meta: cnnMeta },
  { path: '/ai-ml/embeddings', meta: embeddingsMeta },
  { path: '/ai-ml/attention', meta: attentionMeta },
  { path: '/ai-ml/transformer', meta: transformerMeta },
  { path: '/ai-ml/normalization', meta: normalizationMeta },
  { path: '/ai-ml/optimizers', meta: optimizersMeta },
  { path: '/ai-ml/regularization', meta: regularizationMeta },
  { path: '/ai-ml/rnn-lstm', meta: rnnLstmMeta },
  { path: '/ai-ml/moe', meta: moeMeta },
  { path: '/ai-ml/rag', meta: ragMeta },
  { path: '/ai-ml/lora', meta: loraMeta },
  { path: '/ai-ml/fine-tuning', meta: fineTuningMeta },
  { path: '/ai-ml/diffusion', meta: diffusionMeta },
];

export const COMING_SOON_AI_ML_LESSONS = [
  {
    path: '/ai-ml/gans',
    title: 'Generative Adversarial Networks',
    desc: 'A generator and discriminator locked in a minimax game. How GANs learn to produce photorealistic images through adversarial training.',
    status: 'coming-soon',
    tags: ['gans', 'generative-ai', 'deep-learning'],
  },
  {
    path: '/ai-ml/graph-neural-networks',
    title: 'Graph Neural Networks',
    desc: 'Extend deep learning to graph-structured data. Message passing, GCN, GAT, and applications in molecules, social networks, and knowledge graphs.',
    status: 'coming-soon',
    tags: ['gnn', 'graph-learning', 'deep-learning'],
  },
  {
    path: '/ai-ml/reinforcement-learning',
    title: 'Reinforcement Learning',
    desc: 'An agent learns by trial and error — maximising cumulative reward. Q-learning, policy gradients, and PPO from the ground up.',
    status: 'coming-soon',
    tags: ['rl', 'reinforcement-learning', 'deep-learning'],
  },
];

export const LIVE_BLOG_POSTS = [
  { path: '/intro-to-linear-algebra', meta: linearAlgebraMeta },
  ...LIVE_AI_ML_LESSONS,
];
