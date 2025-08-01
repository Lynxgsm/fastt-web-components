export async function callAIStream(
  message: string,
  apiEndpoint: string,
  conversationId: string,
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  try {
    const response = await fetch(`${apiEndpoint}/stream-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        message: message,
        conversation_id: conversationId,
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

        const lines = partial.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              // Handle different response types from your backend
              if (parsed.type === 'end' && parsed.status === 'completed') {
                onComplete?.();
                return;
              } else if (parsed.type === 'error') {
                onError?.(new Error(parsed.error || 'Unknown error'));
                return;
              } else if (parsed.content) {
                onChunk(parsed.content);
              } else if (parsed.message) {
                onChunk(parsed.message);
              } else if (parsed.text) {
                onChunk(parsed.text);
              }
            } catch (e) {
              if (data.trim()) {
                onChunk(data);
              }
            }
          }
        }
        onComplete?.();
        break;
      }

      partial += decoder.decode(value, { stream: true });
      let lines = partial.split('\n');
      // Keep the last line in 'partial' in case it's incomplete
      partial = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);

            // Handle different response types from your backend
            if (parsed.type === 'end' && parsed.status === 'completed') {
              onComplete?.();
              return;
            } else if (parsed.type === 'error') {
              onError?.(new Error(parsed.error || 'Unknown error'));
              return;
            } else if (parsed.content) {
              onChunk(parsed.content);
            } else if (parsed.message) {
              onChunk(parsed.message);
            } else if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch (e) {
            if (data.trim()) {
              onChunk(data);
            }
          }
        }
      }
    }
  } catch (error) {
    onError?.(error as Error);
  }
}
