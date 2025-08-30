/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon, XIcon } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search posts...',
  className = '',
  autoFocus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    onSearch(debouncedSearchQuery)
    // @ts-ignore: Unreachable code error
  }, [debouncedSearchQuery])

  const handleClear = useCallback(() => {
    setSearchQuery('')
    onSearch('')
  }, [onSearch])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch(searchQuery)
    },
    [searchQuery, onSearch]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-2xl mx-auto ${className}`}
      role="search"
      aria-label="Search posts"
    >
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base"
          autoFocus={autoFocus}
          aria-label="Search query"
          aria-describedby="search-hint"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <span id="search-hint" className="sr-only">
        Type to search posts. Results will update automatically as you type.
      </span>
    </form>
  )
}

export default SearchBar
