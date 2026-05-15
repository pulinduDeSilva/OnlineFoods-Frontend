import { useEffect, useState } from 'react';
import { useCart } from '../context/useCart';
import type { Food, Category } from '../types/models';
import { foodService } from '../services/foodService';
import { categoryService } from '../services/categoryService';

export default function FoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [foodRes, catRes] = await Promise.all([foodService.getAll(), categoryService.getAll()]);
        setFoods(foodRes);
        setCategories(catRes);
      } catch {
        setError('Failed to load menu data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFoods =
    selectedCategory === 'all'
      ? foods
      : foods.filter((food) => {
        if (!food.category) return false;
        return food.category.id === selectedCategory;
      });

  if (loading) return <div className="pt-24 text-center">Loading fresh food...</div>;
  if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;

  return (
    <>
        

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-24">
        <aside className='h-80 flex mx-5 justify-center flex-col'>
          <h1 className='text-black text-5xl font-bold md:text-7xl lg:text-8xl'>Welcome.</h1>
       

          <h2 className='text-md mx-1 my-3'>Order your favorite meals in one place. <br /> Quickly discover and filter through various food categories to find exactly what you crave.</h2>
        </aside>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold md:text-4xl">Explore Our Menu</h1>

          <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full border px-4 py-2 text-sm transition ${selectedCategory === 'all' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full border-gray-200 border px-4 py-2 text-sm transition ${selectedCategory === category.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFoods.map((food) => (
            <div key={food.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex h-40 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                <span className="text-sm">{food.name}</span>
              </div>
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{food.name}</h3>
                <span className="font-bold text-green-600">${food.price.toFixed(2)}</span>
              </div>
              <p className="mb-3 text-sm text-gray-600">{food.description || 'No description available.'}</p>
              <div className="mb-4 text-xs text-gray-500">Category: {food.category?.name || 'Uncategorized'}</div>
              <button
                onClick={() => addToCart(food.id)}
                disabled={food.stockQuantity === 0 || cartLoading}
                className="w-full rounded-md bg-black px-3 py-2 text-sm text-white transition hover:opacity-90 disabled:bg-gray-300"
              >
                {food.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>

  );
}