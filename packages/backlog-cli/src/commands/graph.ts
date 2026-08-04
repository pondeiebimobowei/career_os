import { parseBacklog } from '../parser/catalog.js';
import { generateDependencyGraph } from '../reports/graph.js';

export async function graphCommand(options: { mermaid?: boolean; cwd?: string } = {}) {
  const startDir = options.cwd || process.cwd();
  const model = parseBacklog(startDir);
  const graphText = generateDependencyGraph(model, !!options.mermaid);
  console.log(graphText);
}
