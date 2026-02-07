import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TopicsBar from './TopicsBar.svelte';
import { mockEntities } from '$lib/mocks/fixtures/entities';

describe('TopicsBar', () => {
	const defaultProps = {
		topics: mockEntities,
		onTopicClick: vi.fn()
	};

	it('should render 5 topic badges', () => {
		// Given: the component receives 5 topics
		render(TopicsBar, { props: defaultProps });

		// When: the page loads

		// Then: should render 5 badges
		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(5);
	});

	it('should display entity names as badge text', () => {
		// Given: the component receives topics
		render(TopicsBar, { props: defaultProps });

		// When: the page loads

		// Then: should display each entity name
		expect(screen.getByText('CMU')).toBeInTheDocument();
		expect(screen.getByText('Auditor General')).toBeInTheDocument();
		expect(screen.getByText('Integrity Commission')).toBeInTheDocument();
		expect(screen.getByText('Public Defender')).toBeInTheDocument();
		expect(screen.getByText('Ministry of Finance')).toBeInTheDocument();
	});

	it('should call onTopicClick with entity name when badge is clicked', async () => {
		// Given: the component renders with an onTopicClick callback
		const onTopicClick = vi.fn();
		render(TopicsBar, { props: { ...defaultProps, onTopicClick } });

		// When: user clicks a topic badge
		const badge = screen.getByText('Integrity Commission');
		await fireEvent.click(badge);

		// Then: should call onTopicClick with the entity name
		expect(onTopicClick).toHaveBeenCalledWith('Integrity Commission');
	});

	it('should render nothing when topics array is empty', () => {
		// Given: the component receives an empty topics array
		render(TopicsBar, { props: { ...defaultProps, topics: [] } });

		// When: the page loads

		// Then: should not render any buttons
		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
	});
});
