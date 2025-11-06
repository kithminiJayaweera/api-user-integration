import axios from 'axios'
import { Product } from '@/components/data-table/product-columns'

interface ApiProduct {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  category: string
  thumbnail: string
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await axios.get<{ products: ApiProduct[] }>('https://dummyjson.com/products')
  const products: Product[] = res.data.products.map((product: ApiProduct) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discountPercentage: product.discountPercentage,
    rating: product.rating,
    stock: product.stock,
    category: product.category,
    thumbnail: product.thumbnail,
  }))
  return products
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await axios.get<ApiProduct>(`https://dummyjson.com/products/${id}`)
  const p = res.data
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    discountPercentage: p.discountPercentage,
    rating: p.rating,
    stock: p.stock,
    category: p.category,
    thumbnail: p.thumbnail,
  }
}

export default fetchProducts