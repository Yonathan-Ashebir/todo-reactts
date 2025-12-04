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
}

export default function FilterSortBar({
  filter,
  sortOrder,
  searchTerm,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onAddClick,
}: FilterSortBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.topRow}>
        <div className={styles.search}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={onAddClick}
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
          >
            All
          </button>
          <button
            className={`${styles.filterBtn} ${
              filter === 'completed' ? styles.active : ''
            }`}
            onClick={() => onFilterChange('completed')}
          >
            Completed
          </button>
          <button
            className={`${styles.filterBtn} ${
              filter === 'pending' ? styles.active : ''
            }`}
            onClick={() => onFilterChange('pending')}
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
              title="Sort descending"
            >
              <FaSortAmountUp className={styles.sortIcon} />
            </button>
          ) : (
            <button
              type="button"
              className={styles.sortButton}
              onClick={() => onSortChange('asc')}
              title="Sort ascending"
            >
              <FaSortAmountDown className={styles.sortIcon} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

