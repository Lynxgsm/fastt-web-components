export type ScopeEvent = {
  scope: 'leaf' | 'global' | 'fallback_global';
  node_id: number | null;
  path: string[];
  notice_key: string | null;
};

export type DecisionNode = {
  id: number;
  slug: string;
  label: string;
  description: string | null;
  intro_message: string | null;
  is_leaf: boolean;
  children: DecisionNode[];
};

type ParseCallbacks = {
  onChunk: (chunk: string) => void;
  onComplete?: (messageId?: string) => void;
  onScope?: (scope: ScopeEvent) => void;
};

/**
 * Traite une ligne `data: {json}` du flux.
 * Renvoie true quand le flux est terminé et que l'appelant doit s'arrêter.
 */
function handleStreamLine(line: string, cb: ParseCallbacks): boolean {
  if (!line.startsWith('data: ')) return false;
  const data = line.slice(6);

  if (data === '[DONE]') {
    cb.onComplete?.();
    return true;
  }

  try {
    const parsed = JSON.parse(data);
    if (parsed.type === 'scope') {
      cb.onScope?.(parsed as ScopeEvent);
    } else if (parsed.content) {
      cb.onChunk(parsed.content);
    } else if (parsed.type === 'done') {
      cb.onComplete?.(parsed.message_id);
      return true;
    }
  } catch (e) {
    if (data.trim()) {
      cb.onChunk(data);
    }
  }
  return false;
}

export async function callAIStream(
  message: string,
  apiEndpoint: string,
  conversationId: string,
  onChunk: (chunk: string) => void,
  onComplete?: (messageId?: string) => void,
  onError?: (error: Error) => void,
  contextNodeId: number | null = null,
  onScope?: (scope: ScopeEvent) => void,
): Promise<void> {
  const cb: ParseCallbacks = { onChunk, onComplete, onScope };
  try {
    const response = await fetch(`${apiEndpoint}/conversation/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        prompt: message,
        conversation_id: conversationId,
        context_node_id: contextNodeId,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let partial = '';

    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        partial += decoder.decode();
        for (const line of partial.split('\n')) {
          if (handleStreamLine(line, cb)) return;
        }
        onComplete?.();
        break;
      }

      partial += decoder.decode(value, { stream: true });
      const lines = partial.split('\n');
      // Keep the last line in 'partial' in case it's incomplete
      partial = lines.pop() || '';
      for (const line of lines) {
        if (handleStreamLine(line, cb)) return;
      }
    }
  } catch (error) {
    onError?.(error as Error);
  }
}

export async function fetchDecisionTree(apiEndpoint: string): Promise<DecisionNode[]> {
  const response = await fetch(`${apiEndpoint}/decision-tree/`);
  if (!response.ok) {
    throw new Error(`Impossible de charger l'arbre: ${response.status}`);
  }
  const data = await response.json();
  return data.nodes || [];
}

export async function handleFeedback(isSatisfied: number, apiEndpoint: string, conversationId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void> {
  try {
    const response = await fetch(`${apiEndpoint}/conversation/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        is_satisfied: isSatisfied,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    onComplete?.();
  } catch (error) {
    onError?.(error as Error);
  }
}

export async function handleMessageFeedback(isSatisfied: number, apiEndpoint: string, messageId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void> {
  try {
    const response = await fetch(`${apiEndpoint}/conversation/message/${messageId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message_id: messageId,
        is_satisfied: isSatisfied,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    onComplete?.();
  } catch (error) {
    onError?.(error as Error);
  }
}
