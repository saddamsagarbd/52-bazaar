
const SidebarFilters = ({ categories, onCategorySelect }) => (
        <aside className="w-full bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Filter By</h2>
            {/* Price Filter */}
            {/* <div className="mb-4">
            <label>Price Range</label>
            <input type="range" min="0" max="100" />
            </div> */}
            {/* Color Filter */}
            {/* <div className="mb-4">
            <label>Color</label>
            <div className="flex gap-2 mt-2">
                <span className="w-6 h-6 bg-red-500 rounded-full"></span>
                <span className="w-6 h-6 bg-blue-500 rounded-full"></span>
                <span className="w-6 h-6 bg-green-500 rounded-full"></span>
            </div>
            </div> */}
            {/* Size Filter */}
            {/* <div className="mb-4">
            <label>Size</label>
            <div className="flex gap-2 mt-2">
                <button className="px-2 py-1 border">S</button>
                <button className="px-2 py-1 border">M</button>
                <button className="px-2 py-1 border">L</button>
            </div>
            </div> */}
            {/* Categories */}
            <div className="mb-4">
                <label className="mb-2"><strong>Categories</strong></label>
                <ul className="list-none mt-2">
                    {categories.map((category) => (
                        <label key={category._id} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                onChange={() => onCategorySelect(category._id)}
                                className="form-checkbox h-4 w-4 text-[#6AB802] rounded focus:ring-[#6AB802]"
                            />
                            <span className="ml-3 text-gray-700">{category.name}</span>
                        </label>
                        // <li 
                        //     key={category._id}                        
                        //     onClick={() => onCategorySelect(category._id)}
                        //     className="cursor-pointer mb-2 px-4 py-2 rounded-md bg-[#6AB802] text-white font-semibold hover:bg-[#6AB802]-100 hover:text-white-700 transition"

                        // >{category.name}</li>
                    ))}
                </ul>
            </div>
            {/* Tags */}
            {/* <div>
                <label>Tags</label>
                <span className="inline-block bg-gray-200 px-2 py-1 rounded">New Arrival</span>
            </div> */}
        </aside>
);
export default SidebarFilters;
