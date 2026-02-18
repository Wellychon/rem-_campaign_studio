import VariantNode from './VariantNode';
import { Sparkles } from 'lucide-react';
import type { VariantNodeData } from './types';

interface VariantTreeProps {
  nodes: VariantNodeData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  freshNodeIds?: string[];
  highlightedNodeId?: string | null;
  animatingGeneration?: number | null;
  isGenerating?: boolean;
}

export default function VariantTree({
  nodes,
  selectedId,
  onSelect,
  freshNodeIds = [],
  highlightedNodeId = null,
  animatingGeneration = null,
  isGenerating = false,
}: VariantTreeProps) {
  const generationMap = nodes.reduce<Record<number, VariantNodeData[]>>((acc, node) => {
    if (!acc[node.generation]) acc[node.generation] = [];
    acc[node.generation].push(node);
    return acc;
  }, {});

  const generations = Object.keys(generationMap)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6 max-w-[860px]">
      {generations.map((generation) => {
        const generationNodes = generationMap[generation];
        const isLast = generation === generations[generations.length - 1];
        return (
          <div key={generation} className="space-y-2">
            <p className="text-xs font-medium text-textSecondary uppercase tracking-wide">
              {generation === 0 ? 'Origem' : `Rodada ${generation}`}
            </p>

            {generation === 0 ? (
              <div className="max-w-[300px]">
                <VariantNode
                  node={generationNodes[0]}
                  selected={selectedId === generationNodes[0].id}
                  onClick={onSelect}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generationNodes.map((node) => (
                  <VariantNode
                    key={node.id}
                    node={node}
                    selected={selectedId === node.id}
                    onClick={onSelect}
                    showConnector
                    animateConnector={animatingGeneration === generation}
                    isFresh={freshNodeIds.includes(node.id)}
                    isHighlighted={highlightedNodeId === node.id}
                  />
                ))}
              </div>
            )}

            {!isLast ? (
              <div className="pt-2">
                <div className="relative h-6 flex items-center justify-center">
                  <div className="absolute h-px w-[84%] bg-border" />
                  <div className={`absolute h-px w-[84%] bg-brand/40 ${isGenerating ? 'animate-light-travel' : ''}`} />
                  <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-brand/30 bg-card">
                    <Sparkles className={`w-3.5 h-3.5 text-brand ${isGenerating ? 'animate-ai-work' : ''}`} />
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
