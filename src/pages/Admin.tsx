import { useEffect, useState, type FormEvent } from 'react';
import { categoryService } from '../services/categoryService';
import { foodService } from '../services/foodService';
import type { Category, Food } from '../types/models';

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodStockQuantity, setFoodStockQuantity] = useState('');
  const [foodCategoryId, setFoodCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [foodSubmitting, setFoodSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const loadFoods = async () => {
    setFoodsLoading(true);
    setError('');

    try {
      const result = await foodService.getAll();
      setFoods(result);
    } catch {
      setError('Failed to load food items.');
    } finally {
      setFoodsLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void Promise.all([loadCategories(), loadFoods()]);
    });
  }, []);

  const resetForm = () => {
    setName('');
    setEditingId(null);
  };

  const resetFoodForm = () => {
    setFoodName('');
    setFoodDescription('');
    setFoodPrice('');
    setFoodStockQuantity('');
    setFoodCategoryId('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await categoryService.update(editingId, { name: name.trim() });
      } else {
        await categoryService.create({ name: name.trim() });
      }
      resetForm();
      await loadCategories();
    } catch {
      setError('Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFoodSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedPrice = Number(foodPrice);
    const parsedStockQuantity = Number(foodStockQuantity);
    const parsedCategoryId = Number(foodCategoryId);

    if (!foodName.trim()) {
      setError('Food name is required.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Price must be a number greater than or equal to 0.');
      return;
    }

    if (!Number.isInteger(parsedStockQuantity) || parsedStockQuantity < 0) {
      setError('Stock quantity must be a whole number greater than or equal to 0.');
      return;
    }

    if (!foodCategoryId || Number.isNaN(parsedCategoryId)) {
      setError('Category is required.');
      return;
    }

    setFoodSubmitting(true);
    setError('');

    try {
      const trimmedDescription = foodDescription.trim();
      await foodService.create({
        name: foodName.trim(),
        description: trimmedDescription ? trimmedDescription : undefined,
        price: parsedPrice,
        stockQuantity: parsedStockQuantity,
        category: { id: parsedCategoryId },
      });
      resetFoodForm();
      await loadFoods();
    } catch {
      setError('Failed to add food item.');
    } finally {
      setFoodSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;

    setError('');

    try {
      await categoryService.remove(id);
      await loadCategories();
    } catch {
      setError('Failed to delete category.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 pt-24">
      <h1 className="mb-6 text-3xl font-bold">Admin - Category Management</h1>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            placeholder="Category name"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:bg-gray-300"
          >
            {submitting ? 'Saving...' : editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>

        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-md border border-gray-100 p-3">
                <span>{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(category.id);
                      setName(category.name);
                    }}
                    className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Add Food Item</h2>

        <form onSubmit={handleFoodSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={foodName}
            onChange={(event) => setFoodName(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            placeholder="Food name"
          />
          <select
            value={foodCategoryId}
            onChange={(event) => setFoodCategoryId(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            value={foodPrice}
            onChange={(event) => setFoodPrice(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            placeholder="Price"
          />
          <input
            value={foodStockQuantity}
            onChange={(event) => setFoodStockQuantity(event.target.value)}
            type="number"
            min="0"
            step="1"
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            placeholder="Stock quantity"
          />
          <textarea
            value={foodDescription}
            onChange={(event) => setFoodDescription(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black md:col-span-2"
            placeholder="Description"
            rows={3}
          />
          <button
            type="submit"
            disabled={foodSubmitting}
            className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:bg-gray-300 md:col-span-2"
          >
            {foodSubmitting ? 'Saving...' : 'Add Food Item'}
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Food Items</h2>

        {foodsLoading ? (
          <p>Loading food items...</p>
        ) : foods.length === 0 ? (
          <p className="text-gray-600">No food items found.</p>
        ) : (
          <div className="space-y-3">
            {foods.map((food) => (
              <div key={food.id} className="rounded-md border border-gray-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{food.name}</span>
                  <span className="font-semibold text-green-600">${food.price.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{food.description || 'No description available.'}</p>
                <div className="mt-2 text-xs text-gray-500">
                  Category: {food.category?.name || 'Uncategorized'} • Stock: {food.stockQuantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}