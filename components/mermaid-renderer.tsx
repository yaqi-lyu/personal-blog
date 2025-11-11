import { useIntersectionObserver } from 'usehooks-ts';
import mermaid from 'mermaid';
import { useEffect } from 'react';

export default function MermaidElement({ value }: { value: string }) {
  // Initialize Mermaid with dark theme
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#1f2937',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#dc2626',
        secondaryColor: '#374151',
        tertiaryColor: '#4b5563',
        textColor: '#ffffff',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        lineColor: '#dc2626',
        arrowheadColor: '#dc2626',
        clusterBkg: '#1f2937',
        clusterBorder: '#dc2626',
        tertiaryBg: '#1f2937',
        noteBkg: '#7c3aed',
        noteBorderColor: '#dc2626',
        noteTextColor: '#ffffff',
        accentColor: '#dc2626',
        darkMode: true,
      },
    });
  }, []);

  const { ref } = useIntersectionObserver({
    threshold: 0.01,
    freezeOnceVisible: true,
    onChange(isIntersecting, entry) {
      if (isIntersecting) {
        mermaid.run({ nodes: [entry.target as HTMLElement] });
      }
    },
  });

  return (
    <div contentEditable={false} className="overflow-x-auto py-4 px-4 bg-[#1a1a1a] rounded-lg border-2 border-red-900/40">
      <pre ref={ref} suppressHydrationWarning className="mermaid">
        {value}
      </pre>
    </div>
  );
}
