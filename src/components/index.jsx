import { useEffect, useRef, useState } from "react";
import "./product.css";
import { FaStar } from "react-icons/fa";
import { IoIosAddCircle, IoIosCheckmarkCircle } from "react-icons/io";
import axios from "axios";


const Products = () => {
    const [products, setProducts] = useState([]);
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [likedProducts, setLikedProducts] = useState({});
    const [sortOrder, setSortOrder] = useState("All");
    const [priceFilter, setPriceFilter] = useState("Default");
    const [ratingFilter, setRatingFilter] = useState("Default");
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "enabled"; 
    });
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    useEffect(() => {
        setLoading(true);
        axios
            .get("https://dummyjson.com/products", { 
                params: {
                     limit: 194 
                    } })
            .then((res) => setProducts(res.data.products))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    }, [darkMode]);
    
    const handleLike = (id) => {
        setLikedProducts((prev) => ({
            ...prev,
            [id]: true,
        }));
        setCount((prevCount) => prevCount + 1);
        setTimeout(() => {
            setLikedProducts((prev) => ({
                ...prev,
                [id]: false,
            }));
        }, 3000);
    };

    const filteredProducts = () => {
        let sortedProducts = [...products];

        if (searchTerm.trim()) {
            sortedProducts = sortedProducts.filter((product) =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOrder === "A-Z") {
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === "Z-A") {
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
        }

        if (priceFilter === "Low to High(price)") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (priceFilter === "High to Low(price)") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        if (ratingFilter === "1 to 5") {
            sortedProducts.sort((a, b) => a.rating - b.rating);
        } else if (ratingFilter === "5 to 1") {
            sortedProducts.sort((a, b) => b.rating - a.rating);
        }

        return sortedProducts;
    };

    return (
        <div className={`useproduct ${darkMode ? "dark" : ""}`}>
            <div className="Products">
                <button className="dark-mode-btn " onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀️ Light " : "🌙 Dark "}
                </button>

                <input
                    ref={inputRef}
                    className="search-input"
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-name filter">
                    <option value="All">All</option>
                    <option value="A-Z">A-Z</option>
                    <option value="Z-A">Z-A</option>
                </select>
                <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="filter-price filter">
                    <option value="Default">Default</option>
                    <option value="Low to High(price)">Low to High(price)</option>
                    <option value="High to Low(price)">High to Low(price)</option>
                </select>
                <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="filter-rating filter">
                    <option value="Default">Default</option>
                    <option value="1 to 5">1 to 5</option>
                    <option value="5 to 1">5 to 1</option>
                </select>
                <button className="btn">{count}</button>
            </div>
            {loading ? (
                <div className="loader"></div>
            ) : (
                <ul className="product-list">
                    {filteredProducts().map((product) => (
                        <li className="product" key={product.id}>
                            <img className="product-image" src={product.thumbnail} alt={product.title} />
                            <div  className="product-info">
                                <p>{product.title}</p>
                                <p>Price: {product.price}$</p>
                                <p>
                                    Rating: {product.rating}
                                    <FaStar className="rating" size={15} color="orange" />
                                </p>
                                <button
                                    onClick={() => { handleLike(product.id) }}
                                    className="btns"
                                >i
                                    {likedProducts[product.id] ? "buyed" : "buy"}
                                    {likedProducts[product.id] ? (
                                        <IoIosCheckmarkCircle size={20} />
                                    ) : (
                                        <IoIosAddCircle size={20} />
                                    )}
                                    
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Products;










