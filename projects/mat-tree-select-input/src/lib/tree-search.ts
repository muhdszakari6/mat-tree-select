import type { TreeData } from './components/mat-tree-select-input/mat-tree-select-input.component';

/** Decides whether a node matches the search term. */
export type TreeFilterPredicate = (node: TreeData, term: string) => boolean;

/** Default predicate: case-insensitive "contains" match on the node name. */
export const defaultTreeFilterPredicate: TreeFilterPredicate =
  (node, term) => node.name.toLowerCase().includes(term.toLowerCase());

/**
 * Search state shared by both components.
 *
 * Non-matching nodes are hidden rather than removed: mat-select drops any selected value whose
 * option leaves the DOM, which would silently clear selections while the user is searching.
 */
export class TreeSearch {
  term = '';

  /** Nodes to show while searching, or null when there is no active search. */
  private visibleNodes: Set<TreeData> | null = null;

  /** Ancestors of matches, expanded for the duration of the search only. */
  private expandedNodes = new Set<TreeData>();

  update(options: TreeData[], term: string, predicate: TreeFilterPredicate): void {
    this.term = term;
    this.expandedNodes.clear();

    const trimmed = term.trim();
    if (!trimmed) {
      this.visibleNodes = null;
      return;
    }

    const visible = new Set<TreeData>();
    const showSubtree = (node: TreeData) => {
      visible.add(node);
      node.children?.forEach(showSubtree);
    };
    // A matching node is shown with all of its descendants; a node with a matching
    // descendant is shown and expanded so the match is visible.
    const visit = (node: TreeData): boolean => {
      if (predicate(node, trimmed)) {
        showSubtree(node);
        return true;
      }
      let hasMatch = false;
      for (const child of node.children ?? []) {
        hasMatch = visit(child) || hasMatch;
      }
      if (hasMatch) {
        visible.add(node);
        this.expandedNodes.add(node);
      }
      return hasMatch;
    };
    options.forEach(visit);

    this.visibleNodes = visible;
  }

  isHidden(node: TreeData): boolean {
    return this.visibleNodes !== null && !this.visibleNodes.has(node);
  }

  isExpandedBySearch(node: TreeData): boolean {
    return this.expandedNodes.has(node);
  }

  get hasNoResults(): boolean {
    return this.visibleNodes?.size === 0;
  }
}

/**
 * Keys that keep their mat-select behaviour while typing in the search box.
 * Everything else (letters, space, arrows, Home/End) stays in the input, so typing
 * doesn't trigger mat-select's typeahead or select the active option.
 */
const SEARCH_PASSTHROUGH_KEYS = ['Escape', 'Tab'];

/**
 * Focuses the search input once the panel can take focus. From Material 20, openedChange
 * fires before the panel is focusable, so a single focus() call is silently ignored there.
 * preventScroll stops a narrow panel from scrolling sideways and clipping the tree.
 */
export function focusSearchInput(input: HTMLInputElement | undefined, attemptsLeft = 10): void {
  if (!input) {
    return;
  }
  input.focus({ preventScroll: true });
  if (input.ownerDocument.activeElement !== input && attemptsLeft > 0) {
    requestAnimationFrame(() => focusSearchInput(input, attemptsLeft - 1));
  }
}

export function handleSearchKeydown(event: KeyboardEvent): void {
  if (!SEARCH_PASSTHROUGH_KEYS.includes(event.key)) {
    event.stopPropagation();
  }
}
