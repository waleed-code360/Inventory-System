import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Inventory = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', sku: '', category: '', price: '', quantity: '' });
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); // Default sort by name ascending

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) console.error('Error fetching products:', error);
        else setProducts(data || []);
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const productData = {
            name: formData.name,
            sku: formData.sku,
            category: formData.category, // Kept as optional but fields requested are Name, SKU, Qty, Price
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            user_id: user?.id
        };

        if (formData.id) {
            const { error } = await supabase.from('products').update(productData).eq('id', formData.id);
            if (!error) fetchProducts();
        } else {
            const { error } = await supabase.from('products').insert([productData]);
            if (!error) fetchProducts();
        }
        closeModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await supabase.from('products').delete().eq('id', id);
            fetchProducts();
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({ id: null, name: '', sku: '', category: '', price: '', quantity: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredProducts = sortedProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-gray-500 text-sm">Manage your products and stock levels.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full md:w-auto bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium active:scale-95"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by Name or SKU..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-none shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table View */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Name
                                        {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('sku')} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center gap-1">
                                        SKU
                                        {sortConfig.key === 'sku' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('price')} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Price
                                        {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('quantity')} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Qty
                                        {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading inventory...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No products found.</td>
                                </tr>
                            ) : filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500 md:hidden">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                            {product.sku}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-bold ${product.quantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                {product.quantity}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => openModal(product)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full md:w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="e.g. Wireless Mouse"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">SKU <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="e.g. WM-01"
                                        value={formData.sku}
                                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="e.g. Electronics"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 border focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="0"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
