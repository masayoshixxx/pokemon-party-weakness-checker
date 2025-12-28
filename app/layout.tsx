import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'パーティ耐性チェッカー',
  description: 'ポケモンのパーティを入力して、タイプ耐性を視覚的に確認できます',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window === 'undefined' || typeof document === 'undefined') return;
                  if (!document.documentElement) return;
                  
                  const theme = localStorage.getItem('theme') || 'system';
                  const html = document.documentElement;
                  
                  if (theme === 'dark') {
                    html.classList.add('dark');
                  } else if (theme === 'light') {
                    html.classList.remove('dark');
                  } else {
                    if (typeof window.matchMedia !== 'undefined') {
                      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      if (isDark) {
                        html.classList.add('dark');
                      } else {
                        html.classList.remove('dark');
                      }
                    }
                  }
                } catch (e) {
                  try {
                    if (typeof document !== 'undefined' && document.documentElement) {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e2) {
                  }
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}

