import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TopicsBar from './TopicsBar.svelte';
import { mockEntities } from '$lib/mocks/fixtures/entities';

describe('TopicsBar', () => {
	const defaultProps = {
		topics: mockEntities,
		selectedTopic: null as string | null,
		topicSort: 'most_found' as const,
		onTopicClick: vi.fn(),
		onSortChange: vi.fn()
	};

	it('should render 8 topic badges', () => {
		// Given: the component receives 8 topics
		render(TopicsBar, { props: defaultProps });

		// When: the page loads

		// Then: should render 8 topic badges
		const topicsBar = screen.getByTestId('topics-bar');
		const badges = topicsBar.querySelectorAll('button');
		expect(badges).toHaveLength(8);
	});

	it('should display entity names as badge text', () => {
		// Given: the component receives topics
		render(TopicsBar, { props: defaultProps });

		// When: the page loads

		// Then: should display each entity name
		for (const entity of mockEntities) {
			expect(screen.getByText(entity.name)).toBeInTheDocument();
		}
	});

	it('should call onTopicClick with entity name when badge is clicked', async () => {
		// Given: the component renders with an onTopicClick callback
		const onTopicClick = vi.fn();
		render(TopicsBar, { props: { ...defaultProps, onTopicClick } });

		// When: user clicks a topic badge
		const badge = screen.getByText(mockEntities[0].name);
		await fireEvent.click(badge);

		// Then: should call onTopicClick with the entity name
		expect(onTopicClick).toHaveBeenCalledWith(mockEntities[0].name);
	});

	it('should render nothing when topics array is empty', () => {
		// Given: the component receives an empty topics array
		render(TopicsBar, { props: { ...defaultProps, topics: [] } });

		// When: the page loads

		// Then: should not render any topic buttons
		const topicsBar = screen.getByTestId('topics-bar');
		const badges = topicsBar.querySelectorAll('button');
		expect(badges).toHaveLength(0);
	});

	it('should render Top and New toggle labels', () => {
		// Given: the component renders
		render(TopicsBar, { props: defaultProps });

		// When: the page loads

		// Then: should display the Topics prefix and both sort toggle labels
		expect(screen.getByText('Topics:')).toBeInTheDocument();
		expect(screen.getByText('Top')).toBeInTheDocument();
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('should highlight Top label when topicSort is most_found', () => {
		// Given: the sort is set to most_found
		render(TopicsBar, { props: { ...defaultProps, topicSort: 'most_found' as const } });

		// When: the page loads

		// Then: Top should have active styling
		const topButton = screen.getByText('Top');
		expect(topButton.className).toContain('font-bold');
		expect(topButton.className).toContain('text-green-600');
	});

	it('should highlight New label when topicSort is latest', () => {
		// Given: the sort is set to latest
		render(TopicsBar, { props: { ...defaultProps, topicSort: 'latest' as const } });

		// When: the page loads

		// Then: New should have active styling
		const newButton = screen.getByText('New');
		expect(newButton.className).toContain('font-bold');
		expect(newButton.className).toContain('text-green-600');
	});

	it('should call onSortChange with latest when New is clicked', async () => {
		// Given: the component renders with default sort
		const onSortChange = vi.fn();
		render(TopicsBar, { props: { ...defaultProps, onSortChange } });

		// When: user clicks the New toggle
		await fireEvent.click(screen.getByText('New'));

		// Then: should call onSortChange with 'latest'
		expect(onSortChange).toHaveBeenCalledWith('latest');
	});

	it('should call onSortChange with most_found when Top is clicked', async () => {
		// Given: the component renders with latest sort
		const onSortChange = vi.fn();
		render(TopicsBar, {
			props: { ...defaultProps, topicSort: 'latest' as const, onSortChange }
		});

		// When: user clicks the Top toggle
		await fireEvent.click(screen.getByText('Top'));

		// Then: should call onSortChange with 'most_found'
		expect(onSortChange).toHaveBeenCalledWith('most_found');
	});

	it('should render selected topic with filled badge styling', () => {
		// Given: the first topic is selected
		const selectedTopic = mockEntities[0].name;
		render(TopicsBar, { props: { ...defaultProps, selectedTopic } });

		// When: the page loads

		// Then: the selected topic badge should have filled green styling
		const selectedButton = screen
			.getByText(selectedTopic)
			.closest('[data-testid="topics-bar"] button');
		const badge = selectedButton?.querySelector('[class*="bg-green-500"]');
		expect(badge).toBeInTheDocument();
	});

	it('should render unselected topics with outline badge styling', () => {
		// Given: the first topic is selected
		const selectedTopic = mockEntities[0].name;
		render(TopicsBar, { props: { ...defaultProps, selectedTopic } });

		// When: the page loads

		// Then: other topic badges should not have filled green styling
		const unselectedButton = screen
			.getByText(mockEntities[1].name)
			.closest('[data-testid="topics-bar"] button');
		const badge = unselectedButton?.querySelector('[class*="bg-green-500"]');
		expect(badge).not.toBeInTheDocument();
	});
});
