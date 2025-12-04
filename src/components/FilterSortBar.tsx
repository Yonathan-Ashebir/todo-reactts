import {
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaPlus,
} from 'react-icons/fa';
import type { FilterType, SortOrder } from '../types';
import styles from './FilterSortBar.module.css';

interface FilterSortBarProps {
  filter: FilterType;
  sortOrder: SortOrder;
  searchTerm: string;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (order: SortOrder) => void;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function FilterSortBar({
  filter,
  sortOrder,
  searchTerm,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onAddClick,
  searchInputRef,
}: FilterSortBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.topRow}>
        <div className={styles.search}>
          <FaSearch className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks... (⌘ + /)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={onAddClick}
          title="New Task (⌘ + K)"
        >
          <FaPlus />
          <span>New Task</span>
        </button>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.filterGroup}>
          <FaFilter className={styles.icon} />
          <button
            className={`${styles.filterBtn} ${
              filter === 'all' ? styles.active : ''
            }`}
            onClick={() => onFilterChange('all')}
            title="All tasks (⌘ + 1)"
          >
            All
          </button>
          <button
            className={`${styles.filterBtn} ${
              filter === 'completed' ? styles.active : ''
            }`}
            onClick={() => onFilterChange('completed')}
            title="Completed tasks (⌘ + 2)"
          >
            Completed
          </button>
          <button
            className={`${styles.filterBtn} ${
              filter === 'pending' ? styles.active : ''
            }`}
            onClick={() => onFilterChange('pending')}
            title="Pending tasks (⌘ + 3)"
          >
            Pending
          </button>
        </div>

        <div className={styles.sortGroup}>
          {sortOrder === 'asc' ? (
            <button
              type="button"
              className={styles.sortButton}
              onClick={() => onSortChange('desc')}
              title="Sort descending (⌘ + S)"
            >
              <FaSortAmountUp className={styles.sortIcon} />
            </button>
          ) : (
            <button
              type="button"
              className={styles.sortButton}
              onClick={() => onSortChange('asc')}
              title="Sort ascending (⌘ + S)"
            >
              <FaSortAmountDown className={styles.sortIcon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

