import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { MenuItem } from '../types';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Appetizers',
  'Main Course',
  'Desserts',
  'Beverages',
  'Sides',
  'Specials'
];

const ALLERGENS = [
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soy'
];

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Classic Burger',
      price: 12.99,
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      category: 'Main Course',
      isAvailable: true,
      ingredients: ['beef patty', 'lettuce', 'tomato', 'special sauce', 'bun'],
      allergens: ['Wheat', 'Milk'],
      nutritionalInfo: {
        calories: 650,
        protein: 35,
        carbs: 45,
        fat: 25
      }
    }
  ]);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure newItem always has a defined nutritionalInfo object
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    description: '',
    category: 'Main Course',
    isAvailable: true,
    ingredients: [],
    allergens: [],
    nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 } // Ensure this exists
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: newItem.price,
      description: newItem.description,
      category: newItem.category || 'Main Course',
      isAvailable: newItem.isAvailable ?? true,
      ingredients: newItem.ingredients || [],
      allergens: newItem.allergens || [],
      nutritionalInfo: newItem.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    };

    setMenuItems([...menuItems, item]);
    setIsAddingItem(false);
    setNewItem({
      name: '',
      price: 0,
      description: '',
      category: 'Main Course',
      isAvailable: true,
      ingredients: [],
      allergens: [],
      nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 } // Ensure reset
    });
    toast.success('Menu item added successfully');
  };

  const handleEditItem = (item: MenuItem) => {
    const updatedItems = menuItems.map((menuItem) =>
      menuItem.id === item.id ? item : menuItem
    );
    setMenuItems(updatedItems);
    setEditingItemId(null);
    toast.success('Menu item updated successfully');
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast.success('Menu item deleted successfully');
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            {editingItemId === item.id ? (
              // Edit Mode
              <div className="space-y-4">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleEditItem({ ...item, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleEditItem({ ...item, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  step="0.01"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => handleEditItem({ ...item, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
                <select
                  value={item.category}
                  onChange={(e) => handleEditItem({ ...item, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingItemId(null)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={() => handleEditItem(item)}
                    className="px-3 py-1 text-green-600 hover:text-green-800"
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="text-lg font-bold">${item.price.toFixed(2)}</div>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItemId(item.id)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm text-gray-600">
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Menu Item</h2>
              <button
                onClick={() => setIsAddingItem(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border rounded-lg"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Allergens</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALLERGENS.map((allergen) => (
                    <label key={allergen} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={newItem.allergens?.includes(allergen)}
                        onChange={(e) => {
                          const updatedAllergens = e.target.checked
                            ? [...(newItem.allergens || []), allergen]
                            : (newItem.allergens || []).filter((a) => a !== allergen);
                          setNewItem({ ...newItem, allergens: updatedAllergens });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{allergen}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700">Nutritional Information</label>
  <div className="grid grid-cols-2 gap-4 mt-2">
    <div>
      <label className="block text-xs text-gray-500">Calories</label>
      <input
        type="number"
        value={newItem.nutritionalInfo?.calories || 0}
        onChange={(e) =>
          setNewItem({
            ...newItem,
            nutritionalInfo: {
              ...(newItem.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
              calories: parseInt(e.target.value) || 0
            }
          })
        }
        className="mt-1 block w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500">Protein (g)</label>
      <input
        type="number"
        value={newItem.nutritionalInfo?.protein || 0}
        onChange={(e) =>
          setNewItem({
            ...newItem,
            nutritionalInfo: {
              ...(newItem.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
              protein: parseInt(e.target.value) || 0
            }
          })
        }
        className="mt-1 block w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500">Carbs (g)</label>
      <input
        type="number"
        value={newItem.nutritionalInfo?.carbs || 0}
        onChange={(e) =>
          setNewItem({
            ...newItem,
            nutritionalInfo: {
              ...(newItem.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
              carbs: parseInt(e.target.value) || 0
            }
          })
        }
        className="mt-1 block w-full px-3 py-2 border rounded-lg"
      />
    </div>
    <div>
      <label className="block text-xs text-gray-500">Fat (g)</label>
      <input
        type="number"
        value={newItem.nutritionalInfo?.fat || 0}
        onChange={(e) =>
          setNewItem({
            ...newItem,
            nutritionalInfo: {
              ...(newItem.nutritionalInfo || { calories: 0, protein: 0, carbs: 0, fat: 0 }),
              fat: parseInt(e.target.value) || 0
            }
          })
        }
        className="mt-1 block w-full px-3 py-2 border rounded-lg"
      />
    </div>
  </div>
</div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}