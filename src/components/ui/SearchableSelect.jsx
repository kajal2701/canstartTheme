import React, { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/Icon";

const SearchableSelect = ({
  label,
  placeholder = "Select Option",
  className = "",
  value,
  error,
  disabled,
  onChange,
  options = [],
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display label for selected value
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );
  const displayLabel = selectedOption ? selectedOption.label : "";

  const handleSelect = (option) => {
    // Simulate a native event shape for compatibility with handleCustomerChange
    onChange({ target: { value: String(option.value) } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (isOpen) setSearchTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div
      ref={containerRef}
      className={`searchable-select-wrapper ${error ? "is-error" : ""}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <div
        className={`searchable-select-trigger text-control py-2 ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${error ? "is-error" : ""}`}
        onClick={handleToggle}
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        <span className={`searchable-select-value ${!displayLabel ? "searchable-select-placeholder" : ""}`}>
          {displayLabel || placeholder}
        </span>
        <span className="searchable-select-arrow">
          <Icon icon="heroicons:chevron-down" />
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="searchable-select-dropdown">
          {/* Search Input */}
          <div className="searchable-select-search-wrapper">
            <Icon icon="heroicons:magnifying-glass" className="searchable-select-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="searchable-select-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <ul className="searchable-select-options" role="listbox">
            {filteredOptions.length === 0 ? (
              <li className="searchable-select-no-results">
                No results found
              </li>
            ) : (
              filteredOptions.map((option, i) => (
                <li
                  key={option.value || i}
                  className={`searchable-select-option ${
                    String(option.value) === String(value)
                      ? "searchable-select-option-selected"
                      : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={String(option.value) === String(value)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
