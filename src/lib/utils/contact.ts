export function openFeedbackWidget(): void {
	if (typeof window === 'undefined' || !window.uj) return;
	window.uj.showWidget({ section: 'feedback' });
}
