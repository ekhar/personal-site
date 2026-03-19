import type { Metadata } from 'next';
import { ThemeProvider } from '@erickhar/ui/components/theme-provider';
import { Header } from './header';
import './globals.css';

export const metadata: Metadata = {
	title: "Eric's Website",
	description: 'Digital diary — projects, thoughts, and ideas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Header />
					<main className="max-w-[800px] mx-auto px-8 py-8">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
