'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ProductActions from './product-actions'
import { getActualIndex } from '@/utils/formatDate'

export interface IAuthor {
  _id: string
  name: string
  email: string
}

export interface IPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  tags: string[]
  authorId: IAuthor // populated author object
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  publishedAt: string | null
  __v: number
}

type ProductsTableProps = {
  products: IPost[]
  isLoading: boolean
  isFetching: boolean
  page: number
}

const PRODUCTS_TABLE_HEADERS = ['SL No.', 'Thumbnail', 'Post Title', 'Actions']

export function PostsTable({ products, isLoading, isFetching, page }: ProductsTableProps) {
  return (
    <div className="bg-background p-2 rounded-lg shadow-md">
      <Table>
        {/* table header */}
        <TableHeader className="relative h-9 bg-sidebar">
          <TableRow className="border-b-primary/50">
            {PRODUCTS_TABLE_HEADERS.map((header, index) => (
              <TableHead
                key={header}
                className={cn('bg-primary/10 px-8', {
                  'text-center rounded-tr-md': index === PRODUCTS_TABLE_HEADERS.length - 1,
                  'rounded-tl-md': index === 0,
                })}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* table body */}
        {products?.length > 0 && (
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="px-8">{getActualIndex(index, page, 10)}</TableCell>
                <TableCell className="px-8">
                  <Image
                    src={product?.coverImageUrl || '/no_image.png'}
                    alt={product?.title}
                    height={32}
                    width={32}
                    className="rounded-md size-16"
                    unoptimized
                  />
                </TableCell>
                <TableCell className="px-8 w-[500px] break-words whitespace-normal">
                  {product?.title}
                </TableCell>

                <TableCell className="px-8 text-center">
                  <ProductActions product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {/* loading data state */}
      {(isLoading || isFetching) && (
        <div className="w-fit mx-auto py-4">
          <Loader className="size-5 animate-spin" />
        </div>
      )}

      {/* empty data state */}
      {!isLoading && products?.length <= 0 && (
        <div className="text-center py-4">No data found!</div>
      )}
    </div>
  )
}
